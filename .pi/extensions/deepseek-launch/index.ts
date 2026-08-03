/**
 * DeepSeek Launch — Autonomous Startup Orchestrator (v2)
 *
 * File-based architecture:
 *   CEO subagent → writes decisions/tasks to files → writes .signal.json
 *   Employee subagent → reads tasks, writes results → writes .employee-done.json
 *   Extension (pi) → reads signals, manages state, commits to git
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type } from "typebox";
import * as fs from "node:fs";
import * as path from "node:path";

// ─── Paths ───────────────────────────────────────────────────

function companyDir(cwd: string) { return path.join(cwd, "company"); }
function tasksDir(cwd: string) { return path.join(companyDir(cwd), "tasks"); }
function signalFile(cwd: string) { return path.join(companyDir(cwd), ".signal.json"); }
function employeeDoneFile(cwd: string) { return path.join(companyDir(cwd), ".employee-done.json"); }
function waveFile(cwd: string) { return path.join(companyDir(cwd), ".wave.json"); }

// ─── Wave State ──────────────────────────────────────────────

interface WaveState { number: number; started: boolean; }

function getWave(cwd: string): WaveState {
  try { return JSON.parse(fs.readFileSync(waveFile(cwd), "utf-8")); }
  catch { return { number: 1, started: false }; }
}
function saveWave(cwd: string, w: WaveState) { fs.writeFileSync(waveFile(cwd), JSON.stringify(w)); }

// ─── File Helpers ────────────────────────────────────────────

function ensureDir(dir: string) { fs.mkdirSync(dir, { recursive: true }); }

function listDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith(".md")).map(f => f.replace(".md", ""));
}

function moveFile(src: string, dst: string) {
  ensureDir(path.dirname(dst));
  if (fs.existsSync(src)) fs.renameSync(src, dst);
}

function readSignal(cwd: string): any | null {
  try { return JSON.parse(fs.readFileSync(signalFile(cwd), "utf-8")); }
  catch { return null; }
}
function clearSignal(cwd: string) {
  try { fs.unlinkSync(signalFile(cwd)); } catch {}
}
function readEmployeeDone(cwd: string): any | null {
  try { return JSON.parse(fs.readFileSync(employeeDoneFile(cwd), "utf-8")); }
  catch { return null; }
}
function clearEmployeeDone(cwd: string) {
  try { fs.unlinkSync(employeeDoneFile(cwd)); } catch {}
}

// ─── Subagent Spawner ────────────────────────────────────────

async function spawnAgent(
  pi: ExtensionAPI,
  cwd: string,
  agentName: string,
  task: string,
): Promise<{ stdout: string; stderr: string; code: number }> {
  const agentFile = path.join(cwd, ".pi", "agents", `${agentName}.md`);
  if (!fs.existsSync(agentFile)) return { stdout: "", stderr: `Agent not found: ${agentName}`, code: 1 };

  const content = fs.readFileSync(agentFile, "utf-8");
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const fm = fmMatch ? fmMatch[1] : "";
  const body = fmMatch ? fmMatch[2].trim() : content.trim();

  let model = "deepseek-v4-flash";
  const mm = fm.match(/^model:\s*(.+)$/m);
  if (mm) model = mm[1].trim();

  let tools: string[] | undefined;
  const tm = fm.match(/^tools:\s*(.+)$/m);
  if (tm) tools = tm[1].split(",").map((t: string) => t.trim()).filter(Boolean);

  const args: string[] = [
    "-p", "--model", `deepseek/${model}`,
    "--system-prompt", body,
    "--no-skills", "--no-extensions", "--no-context-files",
  ];
  if (tools && tools.length > 0) args.push("--tools", tools.join(","));
  args.push(task);

  return pi.exec("/opt/homebrew/bin/pi", args, { cwd, timeout: 300000 });
}

// ─── CEO Prompt Builder ──────────────────────────────────────

function buildCEOPrompt(cwd: string): string {
  const wave = getWave(cwd);

  // Read current state for context
  let stateSummary = "";
  try { stateSummary = fs.readFileSync(path.join(companyDir(cwd), "company_state.md"), "utf-8").slice(0, 800); } catch {}
  try { stateSummary += "\n" + fs.readFileSync(path.join(companyDir(cwd), "strategy.md"), "utf-8").slice(0, 500); } catch {}

  const doneTasks = listDir(path.join(tasksDir(cwd), "done"));
  const pendingTasks = listDir(path.join(tasksDir(cwd), "pending"));
  const inProgressTasks = listDir(path.join(tasksDir(cwd), "in-progress"));

  return `CEO HEARTBEAT — Wave ${wave.number}

## Current State Summary
${stateSummary}

## Task Queue
- Pending: ${pendingTasks.length > 0 ? pendingTasks.join(", ") : "none"}
- In Progress: ${inProgressTasks.length > 0 ? inProgressTasks.join(", ") : "none"}
- Done (awaiting review): ${doneTasks.length > 0 ? doneTasks.join(", ") : "none"}

## Your Job
1. READ these files in order:
   - company/company_state.md (full)
   - company/strategy.md (full)
   - company/experiments.md (full)
   - company/lessons.md (full)
   - company/identity.md
   - company/DECISION_SCIENCE.md (your methodological framework)

2. REVIEW completed tasks:
   ${doneTasks.length > 0
     ? `Tasks in company/tasks/done/ need review. Read each one. Determine if the result validates or invalidates the hypothesis.`
     : "No tasks to review."}

3. DECIDE and WRITE OUTPUT (pick ONE):

   **If assigning employee task:**
   a. Write task file to company/tasks/pending/{id}.md (use template from your agent definition)
   b. Write company/.signal.json: {"action":"assign_task","task_id":"{id}","hypothesis":"..."}

   **If closing this wave (experiment cycle complete):**
   a. Write company/decisions/wave-${String(wave.number).padStart(3, '0')}.md
   b. Write company/experiments/wave-${String(wave.number).padStart(3, '0')}-result.md
   c. If beliefs changed, APPEND to company/lessons.md
   d. Write company/.signal.json: {"action":"close_wave","wave":${wave.number},"decision_summary":"one-line commit message"}

   **If waiting (need more data, employee still working):**
   a. Write company/.signal.json: {"action":"wait","reason":"why"}

## Scientific Requirements
- Falsifiable hypotheses with numbers
- Compare at least 2 alternatives before deciding
- State confidence intervals
- Check for confirmation bias
- After results: do Bayesian update (prior → posterior)

## Remember
- $100 budget, 30 days, 1 employee
- No product > 7 days without validation
- Data > opinion
- Take ACTION — don't just describe. WRITE the files.`;
}

// ─── Extension ───────────────────────────────────────────────

export default function (pi: ExtensionAPI) {

  pi.registerFlag("autopilot", {
    description: "Run CEO heartbeat automatically on startup and exit",
    type: "boolean", default: false,
  });

  // ═══ CORE: Heartbeat Logic ═══
  async function runHeartbeat(cwd: string, log: (s: string) => void): Promise<string> {
    ensureDir(path.join(tasksDir(cwd), "pending"));
    ensureDir(path.join(tasksDir(cwd), "in-progress"));
    ensureDir(path.join(tasksDir(cwd), "done"));
    ensureDir(path.join(tasksDir(cwd), "passed"));
    ensureDir(path.join(tasksDir(cwd), "abandoned"));
    ensureDir(path.join(companyDir(cwd), "decisions"));
    ensureDir(path.join(companyDir(cwd), "experiments"));
    ensureDir(path.join(companyDir(cwd), "product"));

    if (!fs.existsSync(waveFile(cwd))) saveWave(cwd, { number: 1, started: false });

    let output = "";
    const wave = getWave(cwd);

    // ── STEP 1: Check employee completion ──
    const empDone = readEmployeeDone(cwd);
    if (empDone && empDone.task_id) {
      log(`Employee done: ${empDone.task_id} → ${empDone.status}`);
      if (empDone.status === "completed") {
        moveFile(
          path.join(tasksDir(cwd), "in-progress", `${empDone.task_id}.md`),
          path.join(tasksDir(cwd), "done", `${empDone.task_id}.md`)
        );
      }
      clearEmployeeDone(cwd);
    }

    // ── STEP 2: Check CEO signal ──
    const signal = readSignal(cwd);
    if (signal) {
      log(`CEO signal: ${signal.action}`);
      clearSignal(cwd);

      if (signal.action === "assign_task" && signal.task_id) {
        // Move task from pending to in-progress, dispatch employee
        moveFile(
          path.join(tasksDir(cwd), "pending", `${signal.task_id}.md`),
          path.join(tasksDir(cwd), "in-progress", `${signal.task_id}.md`)
        );
        wave.started = true;
        saveWave(cwd, wave);

        log(`Dispatching employee for task: ${signal.task_id}`);
        const empPrompt = `EXECUTE TASK\n\nRead company/tasks/in-progress/${signal.task_id}.md carefully.\nDo the work described there. Write deliverables to company/product/.\nWhen done, append your report to the task file and write company/.employee-done.json as specified in your agent instructions.`;
        const empResult = await spawnAgent(pi, cwd, "employee", empPrompt);

        if (empResult.code === 0) {
          output += `Employee dispatched: ${signal.task_id}\n`;
          log("Employee completed");
        } else {
          output += `Employee FAILED: ${empResult.stderr.slice(0, 200)}\n`;
          log(`Employee failed: ${empResult.stderr.slice(0, 200)}`);
        }
      } else if (signal.action === "close_wave") {
        // Git commit
        const wavenum = String(signal.wave || wave.number).padStart(3, "0");
        const commitMsg = `wave-${wavenum}: ${signal.decision_summary || "wave complete"}`;

        await pi.exec("git", ["add", "-A"], { cwd });
        const { code, stderr } = await pi.exec("git", ["commit", "-m", commitMsg], { cwd });

        output += `Wave ${wavenum} CLOSED. Commit: ${commitMsg}\n`;
        if (code === 0) log(`Git committed: ${commitMsg}`);
        else log(`Git commit warning: ${stderr || "failed"}`);

        // Advance wave
        saveWave(cwd, { number: (signal.wave || wave.number) + 1, started: false });
      } else if (signal.action === "wait") {
        output += `CEO waiting: ${signal.reason}\n`;
        log(`CEO waiting: ${signal.reason}`);
      }
    }

    // ── STEP 3: Spawn CEO if no pending decisions ──
    const pendingTasks = listDir(path.join(tasksDir(cwd), "pending"));
    const inProgress = listDir(path.join(tasksDir(cwd), "in-progress"));
    const doneTasks = listDir(path.join(tasksDir(cwd), "done"));

    if (inProgress.length === 0 && doneTasks.length === 0 && pendingTasks.length === 0) {
      // No tasks in flight — CEO needs to make a fresh decision
      log("No active tasks, waking CEO for fresh decision...");
      const ceoPrompt = buildCEOPrompt(cwd);
      const ceoResult = await spawnAgent(pi, cwd, "ceo", ceoPrompt);

      if (ceoResult.code === 0) {
        output += `CEO decision cycle complete.\n${ceoResult.stdout.slice(0, 500)}\n`;
        log("CEO completed successfully");
      } else {
        output += `CEO ERROR: ${ceoResult.stderr.slice(0, 300)}\n`;
        log(`CEO error: ${ceoResult.stderr.slice(0, 300)}`);
      }
    } else if (doneTasks.length > 0) {
      // Tasks done but not reviewed — CEO needs to review
      log(`${doneTasks.length} task(s) awaiting review, waking CEO...`);
      const ceoPrompt = buildCEOPrompt(cwd);
      const ceoResult = await spawnAgent(pi, cwd, "ceo", ceoPrompt);

      if (ceoResult.code === 0) {
        output += `CEO review complete.\n${ceoResult.stdout.slice(0, 500)}\n`;
      }
    } else {
      output += `Tasks in progress (${inProgress.length}), waiting for employee.\n`;
      log(`Waiting: ${inProgress.length} task(s) in progress`);
    }

    return output;
  }

  // ═══ SESSION START ═══
  pi.on("session_start", async (_event, ctx) => {
    const cwd = ctx.cwd;

    if (pi.getFlag("autopilot")) {
      console.log("[autopilot] Starting heartbeat cycle...");
      const result = await runHeartbeat(cwd, (msg) => console.log(`[autopilot] ${msg}`));
      console.log(result);
      pi.sendMessage({ customType: "heartbeat", content: result, display: false });
      ctx.shutdown();
      return;
    }

    if (ctx.hasUI) {
      ctx.ui.notify("DeepSeek Launch ready. /heartbeat | /company-status", "info");
    }
  });

  // ═══ COMMAND: /heartbeat ═══
  pi.registerCommand("heartbeat", {
    description: "Trigger CEO decision cycle",
    handler: async (_args, ctx) => {
      ctx.ui.notify("Heartbeat starting...", "info");
      const result = await runHeartbeat(ctx.cwd, (msg) => {
        if (ctx.hasUI) ctx.ui.notify(msg, "info");
      });
      pi.sendMessage({ customType: "heartbeat", content: result, display: true });
      return result;
    },
  });

  // ═══ COMMAND: /company-status ═══
  pi.registerCommand("company-status", {
    description: "Show company state and task queue",
    handler: async (_args, ctx) => {
      const cwd = ctx.cwd;
      const pending = listDir(path.join(tasksDir(cwd), "pending"));
      const inProgress = listDir(path.join(tasksDir(cwd), "in-progress"));
      const done = listDir(path.join(tasksDir(cwd), "done"));

      let status = `\n═══ DeepSeek Launch Status ═══\n`;
      status += `Wave: ${getWave(cwd).number}\n`;
      status += `📋 Pending: ${pending.join(", ") || "none"}\n`;
      status += `🔄 In Progress: ${inProgress.join(", ") || "none"}\n`;
      status += `✅ Done (awaiting review): ${done.join(", ") || "none"}\n`;

      try {
        status += `\n---\n${fs.readFileSync(path.join(companyDir(cwd), "company_state.md"), "utf-8").slice(0, 400)}\n`;
      } catch {}
      status += `════════════════════════\n`;

      pi.sendMessage({ customType: "company-status", content: status, display: true });
      return status;
    },
  });

  // ═══ SHUTDOWN: Ensure git save ═══
  pi.on("session_shutdown", async (_event, ctx) => {
    const cwd = ctx.cwd;
    const w = getWave(cwd);
    if (w.started) {
      const { stdout: st } = await pi.exec("git", ["status", "--porcelain"], { cwd });
      if (st.trim().length > 0) {
        await pi.exec("git", ["add", "-A"], { cwd });
        await pi.exec("git", ["commit", "-m", `wave-${String(w.number).padStart(3, "0")}: auto-save`], { cwd });
      }
    }
  });
}
