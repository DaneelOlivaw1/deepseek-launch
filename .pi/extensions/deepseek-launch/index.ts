/**
 * DeepSeek Launch — Autonomous Startup Orchestrator
 *
 * Manages CEO and Employee subagents, task lifecycle, and git governance.
 *
 * Architecture:
 *   pi (orchestrator) → CEO subagent (DeepSeek V4 Pro) → decisions, task assignment
 *                     → Employee subagent (DeepSeek V4 Flash) → execution
 *                     → Git commits for wave governance
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type } from "typebox";
import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";

// ─── Types ───────────────────────────────────────────────────

interface TaskFile {
  id: string;
  status: "pending" | "in-progress" | "done" | "passed" | "revised" | "abandoned";
  assignedAt: string;
  deadline?: string;
  task: string;
  purpose: string;
  expectedOutput: string;
  successCriteria: string[];
  employeeReport?: string;
  ceoReview?: { verdict: string; reason: string };
}

interface WaveState {
  number: number;
  decision: string;
  started: boolean;
  taskCount: number;
  doneCount: number;
}

// ─── Helpers ─────────────────────────────────────────────────

function getCompanyDir(cwd: string): string {
  return path.join(cwd, "company");
}

function getTasksDir(cwd: string): string {
  return path.join(getCompanyDir(cwd), "tasks");
}

function getCurrentWave(cwd: string): WaveState {
  const waveFile = path.join(getCompanyDir(cwd), ".wave.json");
  try {
    return JSON.parse(fs.readFileSync(waveFile, "utf-8"));
  } catch {
    return { number: 1, decision: "", started: false, taskCount: 0, doneCount: 0 };
  }
}

function saveWaveState(cwd: string, wave: WaveState): void {
  const waveFile = path.join(getCompanyDir(cwd), ".wave.json");
  fs.writeFileSync(waveFile, JSON.stringify(wave, null, 2));
}

function generateTaskId(): string {
  return crypto.randomUUID().slice(0, 8);
}

function createTaskFile(cwd: string, task: {
  task: string;
  purpose: string;
  expectedOutput: string;
  successCriteria: string[];
  deadline?: string;
}): string {
  const id = generateTaskId();
  const wave = getCurrentWave(cwd);
  const content = `# Task: ${id}

**Status:** pending
**Wave:** ${wave.number}
**Assigned:** ${new Date().toISOString()}
**Deadline:** ${task.deadline || "N/A"}

---

## Task
${task.task}

## Purpose
${task.purpose}

## Expected Output
${task.expectedOutput}

## Success Criteria
${task.successCriteria.map((c, i) => `- [ ] ${c}`).join("\n")}

---

## Employee Report
*(to be filled by employee)*

## CEO Review
*(to be filled by CEO)*
`;

  const filePath = path.join(getTasksDir(cwd), "pending", `${id}.md`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  return id;
}

function moveTaskFile(cwd: string, taskId: string, from: string, to: string): void {
  const src = path.join(getTasksDir(cwd), from, `${taskId}.md`);
  const dst = path.join(getTasksDir(cwd), to, `${taskId}.md`);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  if (fs.existsSync(src)) {
    fs.renameSync(src, dst);
  }
}

function listTaskFiles(cwd: string, status: string): string[] {
  const dir = path.join(getTasksDir(cwd), status);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith(".md"))
    .map(f => f.replace(".md", ""));
}

function readTaskFile(cwd: string, status: string, taskId: string): string | null {
  const filePath = path.join(getTasksDir(cwd), status, `${taskId}.md`);
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

function appendToTaskFile(cwd: string, status: string, taskId: string, section: string, content: string): void {
  const filePath = path.join(getTasksDir(cwd), status, `${taskId}.md`);
  let existing = "";
  try { existing = fs.readFileSync(filePath, "utf-8"); } catch { /* new file */ }
  existing += `\n## ${section}\n${content}\n`;
  fs.writeFileSync(filePath, existing);
}

function spawnSubagent(
  pi: ExtensionAPI,
  cwd: string,
  agentName: string,
  task: string
): Promise<{ stdout: string; stderr: string; code: number }> {
  // Read agent definition
  const agentFile = path.join(cwd, ".pi", "agents", `${agentName}.md`);
  if (!fs.existsSync(agentFile)) {
    return Promise.resolve({
      stdout: "",
      stderr: `Agent not found: ${agentName}`,
      code: 1,
    });
  }

  const agentContent = fs.readFileSync(agentFile, "utf-8");
  // Extract frontmatter and body
  const fmMatch = agentContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const body = fmMatch ? fmMatch[2] : agentContent;
  const fm = fmMatch ? fmMatch[1] : "";

  // Parse model from frontmatter
  let model = "deepseek-v4-flash";
  const modelMatch = fm.match(/^model:\s*(.+)$/m);
  if (modelMatch) {
    model = modelMatch[1].trim();
  }

  // Parse tools from frontmatter
  let tools: string[] | undefined;
  const toolsMatch = fm.match(/^tools:\s*(.+)$/m);
  if (toolsMatch) {
    tools = toolsMatch[1].split(",").map((t: string) => t.trim()).filter(Boolean);
  }

  // Build the command: pi -p with the agent's system prompt + task
  const systemPrompt = body.trim();
  const args: string[] = [
    "-p",
    "--model", `deepseek/${model}`,
    "--system-prompt", systemPrompt,
    "--no-skills",
    "--no-extensions",
    "--no-context-files",
  ];

  // If tools are specified, limit to those tools
  if (tools && tools.length > 0) {
    args.push("--tools", tools.join(","));
  }

  args.push(task);

  return pi.exec("pi", args, {
    cwd,
    timeout: 300000, // 5 min timeout
  });
}

// ─── Extension ───────────────────────────────────────────────

export default function (pi: ExtensionAPI) {

  // ═══ FLAG: --autopilot ═══
  // When set, runs heartbeat automatically on startup (for cron/launchd)
  pi.registerFlag("autopilot", {
    description: "Run CEO heartbeat automatically on startup and exit",
    type: "boolean",
    default: false,
  });

  // ═══ TOOL: ceo_assign_task ═══
  // CEO calls this to assign work to the employee
  pi.registerTool({
    name: "ceo_assign_task",
    label: "Assign Task",
    description:
      "Assign a specific task to the employee. Only one task can be in progress at a time. " +
      "Include: task description, purpose, expected output, success criteria.",
    parameters: Type.Object({
      task: Type.String({ description: "Specific, actionable task description" }),
      purpose: Type.String({ description: "Why this task matters for the company" }),
      expected_output: Type.String({ description: "What deliverable the employee should produce" }),
      success_criteria: Type.String({ description: "Comma-separated list of success criteria" }),
      deadline: Type.Optional(Type.String({ description: "Optional deadline" })),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      const cwd = ctx.cwd;
      const wave = getCurrentWave(cwd);

      // Check if there's already an in-progress or pending task
      const inProgress = listTaskFiles(cwd, "in-progress");
      const pending = listTaskFiles(cwd, "pending");
      if (inProgress.length > 0 || pending.length > 0) {
        return {
          content: [{
            type: "text",
            text: `❌ Cannot assign task. There is already a task in progress (${inProgress[0] || pending[0]}). Wait for it to complete before assigning a new one.`,
          }],
        };
      }

      const criteria = params.success_criteria
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);

      const taskId = createTaskFile(cwd, {
        task: params.task,
        purpose: params.purpose,
        expectedOutput: params.expected_output,
        successCriteria: criteria,
        deadline: params.deadline,
      });

      // Start the wave if not started
      if (!wave.started) {
        wave.started = true;
        wave.decision = params.task.slice(0, 80);
        saveWaveState(cwd, wave);
      }

      wave.taskCount++;
      saveWaveState(cwd, wave);

      return {
        content: [{
          type: "text",
          text: `✅ Task assigned!\n\nTask ID: ${taskId}\nWave: ${wave.number}\nTask: ${params.task}\nPurpose: ${params.purpose}\n\nEmployee will be dispatched automatically.`,
        }],
        details: { taskId, wave: wave.number },
      };
    },
  });

  // ═══ TOOL: ceo_review_result ═══
  // CEO reviews a completed employee task
  pi.registerTool({
    name: "ceo_review_result",
    label: "Review Result",
    description:
      "Review an employee's completed task. Read the task file in tasks/done/ first, then call this tool with your verdict: PASS, REVISE, or ABANDON.",
    parameters: Type.Object({
      task_id: Type.String({ description: "The task ID to review" }),
      verdict: Type.String({ description: "PASS, REVISE, or ABANDON" }),
      reason: Type.String({ description: "Why you made this decision" }),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      const cwd = ctx.cwd;
      const taskId = params.task_id;
      const verdict = params.verdict.toUpperCase();

      // Check task exists in done
      const taskContent = readTaskFile(cwd, "done", taskId);
      if (!taskContent) {
        return {
          content: [{ type: "text", text: `❌ Task ${taskId} not found in done/` }],
        };
      }

      const wave = getCurrentWave(cwd);

      if (verdict === "PASS") {
        moveTaskFile(cwd, taskId, "done", "passed");
        wave.doneCount++;
        saveWaveState(cwd, wave);

        // Update the task file with CEO review
        const passedFile = path.join(getTasksDir(cwd), "passed", `${taskId}.md`);
        let content = fs.readFileSync(passedFile, "utf-8");
        content += `\n## CEO Review\n**Verdict:** PASS ✅\n**Reason:** ${params.reason}\n`;
        fs.writeFileSync(passedFile, content);

        return {
          content: [{
            type: "text",
            text: `✅ Task ${taskId} PASSED.\nReason: ${params.reason}\n\nWave ${wave.number} progress: ${wave.doneCount}/${wave.taskCount} tasks done.\n\nIf this experiment cycle is complete, use ceo_close_wave to commit.`,
          }],
        };
      } else if (verdict === "REVISE") {
        moveTaskFile(cwd, taskId, "done", "pending");
        const pendingFile = path.join(getTasksDir(cwd), "pending", `${taskId}.md`);
        let content = fs.readFileSync(pendingFile, "utf-8");
        content += `\n## CEO Review\n**Verdict:** REVISE 🔄\n**Reason:** ${params.reason}\n`;
        fs.writeFileSync(pendingFile, content);

        return {
          content: [{
            type: "text",
            text: `🔄 Task ${taskId} returned for REVISION.\nReason: ${params.reason}\n\nEmployee will re-attempt with feedback.`,
          }],
        };
      } else {
        // ABANDON
        moveTaskFile(cwd, taskId, "done", "abandoned");
        const abandonedFile = path.join(getTasksDir(cwd), "abandoned", `${taskId}.md`);
        let content = fs.readFileSync(abandonedFile, "utf-8");
        content += `\n## CEO Review\n**Verdict:** ABANDONED ❌\n**Reason:** ${params.reason}\n`;
        fs.writeFileSync(abandonedFile, content);

        return {
          content: [{
            type: "text",
            text: `❌ Task ${taskId} ABANDONED.\nReason: ${params.reason}\n\nRecord this failure in company/lessons.md.`,
          }],
        };
      }
    },
  });

  // ═══ TOOL: ceo_close_wave ═══
  // CEO closes the current wave, writes decision/experiment logs, commits to git
  pi.registerTool({
    name: "ceo_close_wave",
    label: "Close Wave",
    description:
      "Close the current wave. This writes the decision log and experiment log, creates a git commit, and increments the wave counter. Call this when an experiment cycle is complete.",
    parameters: Type.Object({
      decision_summary: Type.String({ description: "One-line summary of the wave's decision" }),
      situation: Type.String({ description: "What happened this wave" }),
      evidence: Type.String({ description: "What data was collected" }),
      decision: Type.String({ description: "What was decided" }),
      reason: Type.String({ description: "Why this decision" }),
      hypothesis: Type.String({ description: "What was the experiment hypothesis" }),
      action: Type.String({ description: "What action was taken" }),
      result: Type.String({ description: "What was the result" }),
      conclusion: Type.String({ description: "What did we learn" }),
      previous_belief: Type.Optional(Type.String({ description: "What we believed before (if changed)" })),
      new_belief: Type.Optional(Type.String({ description: "What we believe now (if changed)" })),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      const cwd = ctx.cwd;
      const wave = getCurrentWave(cwd);

      if (!wave.started) {
        return {
          content: [{ type: "text", text: "❌ No active wave to close. Assign a task first." }],
        };
      }

      const date = new Date().toISOString().split("T")[0];

      // 1. Write Decision Log
      const decisionContent = `# Wave ${String(wave.number).padStart(3, "0")} Decision

**Date:** ${date}
**CEO:** Founder

## Situation
${params.situation}

## Evidence
${params.evidence}

## Decision
${params.decision}

## Reason
${params.reason}
`;
      const decisionPath = path.join(getCompanyDir(cwd), "decisions", `wave-${String(wave.number).padStart(3, "0")}.md`);
      fs.mkdirSync(path.dirname(decisionPath), { recursive: true });
      fs.writeFileSync(decisionPath, decisionContent);

      // 2. Write Experiment Log
      const experimentContent = `# Wave ${String(wave.number).padStart(3, "0")} Experiment

## Hypothesis
${params.hypothesis}

## Action
${params.action}

## Result
${params.result}

## Conclusion
${params.conclusion}

---

*This record is immutable. Do not modify.*
`;
      const experimentPath = path.join(getCompanyDir(cwd), "experiments", `wave-${String(wave.number).padStart(3, "0")}-result.md`);
      fs.writeFileSync(experimentPath, experimentContent);

      // 3. Update lessons if beliefs changed
      if (params.previous_belief && params.new_belief) {
        const lessonsPath = path.join(getCompanyDir(cwd), "lessons.md");
        let lessons = "";
        try { lessons = fs.readFileSync(lessonsPath, "utf-8"); } catch { /* new */ }
        lessons += `\n## Wave ${wave.number} Lesson\n\n**之前认为：** ${params.previous_belief}\n\n**现在认为：** ${params.new_belief}\n\n---\n`;
        fs.writeFileSync(lessonsPath, lessons);
      }

      // 4. Update experiments.md overview
      const experimentsOverviewPath = path.join(getCompanyDir(cwd), "experiments.md");
      let overview = "";
      try { overview = fs.readFileSync(experimentsOverviewPath, "utf-8"); } catch { /* new */ }
      overview += `\n| Wave ${wave.number} | ${params.hypothesis.slice(0, 50)}... | ${params.result.slice(0, 50)}... | ${params.conclusion.slice(0, 50)}... |`;
      fs.writeFileSync(experimentsOverviewPath, overview);

      // 5. Update company state
      const statePath = path.join(getCompanyDir(cwd), "company_state.md");
      let state = "";
      try { state = fs.readFileSync(statePath, "utf-8"); } catch { /* new */ }
      state = state.replace(/Wave：\d+/, `Wave：${wave.number + 1}`);
      state = state.replace(/最后更新：Day \d+/, `最后更新：Day ${wave.number}`);
      fs.writeFileSync(statePath, state);

      // 6. Git commit
      const commitMsg = `wave-${String(wave.number).padStart(3, "0")}: ${params.decision_summary}`;
      await pi.exec("git", ["add", "-A"], { cwd });
      const { code, stderr } = await pi.exec("git", ["commit", "-m", commitMsg], { cwd });

      // 7. Advance wave
      wave.number++;
      wave.started = false;
      wave.taskCount = 0;
      wave.doneCount = 0;
      wave.decision = "";
      saveWaveState(cwd, wave);

      let result = `✅ Wave ${wave.number - 1} CLOSED.\n\n`;
      result += `Commit: ${commitMsg}\n`;
      result += `Decision log: company/decisions/wave-${String(wave.number - 1).padStart(3, "0")}.md\n`;
      result += `Experiment log: company/experiments/wave-${String(wave.number - 1).padStart(3, "0")}-result.md\n`;

      if (code === 0) {
        result += `\nGit commit: ✅ Created`;
      } else {
        result += `\nGit commit: ⚠️ ${stderr || "failed"}`;
      }

      result += `\n\nNext wave: ${wave.number}`;

      return { content: [{ type: "text", text: result }] };
    },
  });

  // ═══ TOOL: employee_report_done ═══
  // Employee calls this when they finish a task
  pi.registerTool({
    name: "employee_report_done",
    label: "Report Done",
    description:
      "Report that you've completed your assigned task. Include a summary of what you did and the path to your deliverables.",
    parameters: Type.Object({
      task_id: Type.String({ description: "The task ID you completed" }),
      summary: Type.String({ description: "Summary of what you did and what you found" }),
      deliverables: Type.String({ description: "Path(s) to deliverable files, comma-separated" }),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      const cwd = ctx.cwd;
      const taskId = params.task_id;

      // Check task exists in pending or in-progress
      const inPending = readTaskFile(cwd, "pending", taskId);
      const inProgress = readTaskFile(cwd, "in-progress", taskId);

      if (!inPending && !inProgress) {
        return {
          content: [{ type: "text", text: `❌ Task ${taskId} not found.` }],
        };
      }

      // Move to done
      if (inProgress) {
        moveTaskFile(cwd, taskId, "in-progress", "done");
      } else {
        moveTaskFile(cwd, taskId, "pending", "done");
      }

      // Append employee report
      const reportContent = `**Completed:** ${new Date().toISOString()}\n**Summary:** ${params.summary}\n**Deliverables:** ${params.deliverables}`;
      appendToTaskFile(cwd, "done", taskId, "Employee Report", reportContent);

      return {
        content: [{
          type: "text",
          text: `✅ Task ${taskId} reported as DONE.\n\nSummary: ${params.summary}\nDeliverables: ${params.deliverables}\n\nCEO will review in the next heartbeat.`,
        }],
      };
    },
  });

  // ═══ COMMAND: /heartbeat ═══
  pi.registerCommand("heartbeat", {
    description: "Trigger a CEO decision cycle — CEO reads state, reviews tasks, makes decisions",
    handler: async (_args, ctx) => {
      const cwd = ctx.cwd;
      ctx.ui.notify("Heartbeat starting...", "info");

      const result = await runHeartbeat(cwd, (msg: string) => {
        if (ctx.hasUI) ctx.ui.notify(msg, "info");
      });

      pi.sendMessage({
        customType: "heartbeat",
        content: result,
        display: true,
        details: { wave: getCurrentWave(cwd).number },
      });

      return result;
    },
  });

  // ═══ COMMAND: /company-status ═══
  pi.registerCommand("company-status", {
    description: "Show current company state and task queue",
    handler: async (_args, ctx) => {
      const cwd = ctx.cwd;
      const wave = getCurrentWave(cwd);
      const pending = listTaskFiles(cwd, "pending");
      const inProgress = listTaskFiles(cwd, "in-progress");
      const done = listTaskFiles(cwd, "done");

      let status = `\n═══ COMPANY STATUS ═══\n`;
      status += `Wave: ${wave.number}\n`;
      status += `Started: ${wave.started ? "Yes" : "No"}\n`;
      status += `Tasks this wave: ${wave.taskCount} | Done: ${wave.doneCount}\n\n`;
      status += `📋 Pending: ${pending.length} | 🔄 In Progress: ${inProgress.length} | ✅ Done (awaiting review): ${done.length}\n`;

      // Read company state
      try {
        const stateContent = fs.readFileSync(path.join(getCompanyDir(cwd), "company_state.md"), "utf-8");
        status += `\n---\n${stateContent.slice(0, 500)}\n`;
      } catch { /* skip */ }

      status += `════════════════════\n`;

      pi.sendMessage({
        customType: "company-status",
        content: status,
        display: true,
      });

      return status;
    },
  });

  // ═══ CORE: Heartbeat logic (used by command and autopilot) ═══
  async function runHeartbeat(cwd: string, log: (msg: string) => void): Promise<string> {
    // Ensure directories
    const dirs = [
      path.join(getCompanyDir(cwd), "tasks", "pending"),
      path.join(getCompanyDir(cwd), "tasks", "in-progress"),
      path.join(getCompanyDir(cwd), "tasks", "done"),
      path.join(getCompanyDir(cwd), "tasks", "passed"),
      path.join(getCompanyDir(cwd), "tasks", "abandoned"),
      path.join(getCompanyDir(cwd), "decisions"),
      path.join(getCompanyDir(cwd), "experiments"),
      path.join(getCompanyDir(cwd), "product"),
    ];
    for (const dir of dirs) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Initialize wave state if not exists
    const waveFile = path.join(getCompanyDir(cwd), ".wave.json");
    if (!fs.existsSync(waveFile)) {
      saveWaveState(cwd, { number: 1, decision: "", started: false, taskCount: 0, doneCount: 0 });
    }

    let output = "";
    const wave = getCurrentWave(cwd);

    // Step 1: Dispatch pending tasks to employee
    const pendingTasks = listTaskFiles(cwd, "pending");
    if (pendingTasks.length > 0) {
      log(`Dispatching ${pendingTasks.length} pending task(s)...`);

      for (const taskId of pendingTasks) {
        moveTaskFile(cwd, taskId, "pending", "in-progress");
        const taskContent = readTaskFile(cwd, "in-progress", taskId);
        if (!taskContent) continue;

        log(`Employee working on: ${taskId}`);
        const employeePrompt = `
Execute the task described in company/tasks/in-progress/${taskId}.md.

First, read that file to understand what you need to do.
Then do the work. Write all deliverables to company/product/.
When done, call employee_report_done with:
- task_id: "${taskId}"
- summary: what you did and found
- deliverables: paths to files you created

IMPORTANT: Really do the work. Don't simulate results. If you need to research, do it. If you need to build, build it.`;

        const empResult = await spawnSubagent(pi, cwd, "employee", employeePrompt);
        if (empResult.code !== 0) {
          log(`Employee task ${taskId} FAILED: ${empResult.stderr.slice(0, 200)}`);
        } else {
          log(`Employee task ${taskId} completed`);
        }
      }
    }

    // Step 2: Check for done tasks, then wake CEO
    const doneTasks = listTaskFiles(cwd, "done");
    const ceoPrompt = `HEARTBEAT — Wave ${wave.number}

You are the CEO. Follow this exact process:

1. READ company state (in this order):
   - company/company_state.md
   - company/strategy.md  
   - company/experiments.md
   - company/lessons.md
   - company/identity.md
   - company/DECISION_SCIENCE.md

2. REVIEW completed tasks (if any):
   - List files in company/tasks/done/
   ${doneTasks.length > 0 ? `- There ${doneTasks.length === 1 ? 'is' : 'are'} ${doneTasks.length} task(s) waiting: ${doneTasks.join(', ')}` : '- No tasks awaiting review'}
   - For each done task, read it and call ceo_review_result

3. DECIDE next action:
   - If experiment cycle is complete → ceo_close_wave
   - If more validation needed → ceo_assign_task with a specific, falsifiable experiment
   - If direction seems wrong → explain why, then ceo_close_wave with pivot rationale

4. FRAMEWORKS TO APPLY (from DECISION_SCIENCE.md):
   - Every hypothesis must be FALSIFIABLE (with numbers)
   - Every decision must consider at least 2 alternatives
   - State your confidence interval for each prediction
   - Check yourself for cognitive biases (confirmation bias, overconfidence, sunk cost)

5. REMEMBER:
   - $100 budget, 30 days, 1 employee
   - No product > 7 days without user validation
   - Data > opinion. Falsifiable > vague.
   - You are building a REAL business. Treat it that way.

DO NOT just describe what you see. TAKE ACTION with the tools.`;

    log(`Waking CEO (DeepSeek V4 Pro) for Wave ${wave.number}...`);
    const ceoResult = await spawnSubagent(pi, cwd, "ceo", ceoPrompt);

    if (ceoResult.code !== 0) {
      log(`CEO error: ${ceoResult.stderr.slice(0, 300)}`);
      output += `CEO ERROR: ${ceoResult.stderr}\n`;
    } else {
      log(`CEO completed. Output: ${ceoResult.stdout.slice(0, 300)}...`);
      output += ceoResult.stdout;
    }

    // Summary
    const afterPending = listTaskFiles(cwd, "pending");
    const afterDone = listTaskFiles(cwd, "done");
    const afterWave = getCurrentWave(cwd);

    output += `\n═══ HEARTBEAT DONE ═══\n`;
    output += `Wave: ${afterWave.number} | Pending: ${afterPending.length} | Awaiting review: ${afterDone.length}\n`;

    return output;
  }

  // ═══ SESSION START ═══
  pi.on("session_start", async (_event, ctx) => {
    const cwd = ctx.cwd;

    // Ensure directories
    const dirs = [
      path.join(getCompanyDir(cwd), "tasks", "pending"),
      path.join(getCompanyDir(cwd), "tasks", "in-progress"),
      path.join(getCompanyDir(cwd), "tasks", "done"),
      path.join(getCompanyDir(cwd), "tasks", "passed"),
      path.join(getCompanyDir(cwd), "tasks", "abandoned"),
      path.join(getCompanyDir(cwd), "decisions"),
      path.join(getCompanyDir(cwd), "experiments"),
      path.join(getCompanyDir(cwd), "product"),
    ];
    for (const dir of dirs) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Initialize wave state
    const waveFile = path.join(getCompanyDir(cwd), ".wave.json");
    if (!fs.existsSync(waveFile)) {
      saveWaveState(cwd, { number: 1, decision: "", started: false, taskCount: 0, doneCount: 0 });
    }

    // ═══ AUTOPILOT: Run heartbeat immediately ═══
    if (pi.getFlag("autopilot")) {
      console.log("[autopilot] Starting autonomous heartbeat...");
      const result = await runHeartbeat(cwd, (msg: string) => console.log(`[autopilot] ${msg}`));
      console.log(result);

      // Send as message for session recording
      pi.sendMessage({
        customType: "heartbeat-autopilot",
        content: result,
        display: false,
        details: { wave: getCurrentWave(cwd).number },
      });

      // Request graceful shutdown after heartbeat completes
      ctx.shutdown();
      return;
    }

    if (ctx.hasUI) {
      ctx.ui.notify("DeepSeek Launch ready. /heartbeat | /company-status | --autopilot for cron", "info");
    }
  });

  // ═══ SESSION SHUTDOWN: Git auto-commit if wave was active ═══
  pi.on("session_shutdown", async (_event, ctx) => {
    const cwd = ctx.cwd;
    const wave = getCurrentWave(cwd);

    if (wave.started && wave.doneCount > 0) {
      // Check git has uncommitted changes
      const { stdout: status } = await pi.exec("git", ["status", "--porcelain"], { cwd });
      if (status.trim().length > 0) {
        const commitMsg = `wave-${String(wave.number).padStart(3, "0")}: auto-save (wave in progress)`;
        await pi.exec("git", ["add", "-A"], { cwd });
        await pi.exec("git", ["commit", "-m", commitMsg], { cwd });

        if (ctx.hasUI) {
          ctx.ui.notify(`Auto-committed: ${commitMsg}`, "info");
        }
      }
    }
  });
}
