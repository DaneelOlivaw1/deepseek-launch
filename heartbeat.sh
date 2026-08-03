#!/bin/bash
# CEO Heartbeat — 系统 cron 触发，每次全新 session
# 用法: ./heartbeat.sh
# 置于系统 crontab: */30 * * * * /Users/daneel/project/deepseek-launch/heartbeat.sh

cd /Users/daneel/project/deepseek-launch

# 导出 DeepSeek API key（从 pi 配置推断，需确认）
export DEEPSEEK_API_KEY="${DEEPSEEK_API_KEY:-}"

# 执行 Heartbeat — pi -p 模式，每次创建新 session
pi -p --provider deepseek --model deepseek-v4-pro \
  "🔥 CEO HEARTBEAT — 系统定时唤醒 (30min)。

你是 DeepSeek Launch 的 pi Orchestrator。

⚠️ 这是全新 session。必须从文件系统读取所有状态，不依赖上下文。

## Step 0: 读取全部状态
1. company/company_state.md
2. company/strategy.md
3. company/experiments.md
4. company/lessons.md
5. company/agents/ceo/memory.md
6. company/tasks/pending/
7. company/tasks/in-progress/
8. company/tasks/done/

## Step 1: 读取历史会话（长期记忆）
读取 ~/.pi/agent/sessions/--Users-daneel-project-deepseek-launch--/ 下最近 5 个 JSONL 会话文件，提取关键 CEO 决策、实验结果和教训。

## Step 2: 判断状态并行动
按照 AGENTS.md 的 CEO Heartbeat 流程执行：
- 有待审查任务 → 优先审查
- 有超时任务 → 处理阻塞
- 员工空闲 → CEO 做决策，创建新任务
- Wave 结束 → conduct-review + Git Commit

## Step 3: 提交
如果触发了 Wave 结束：git add -A && git commit -m 'wave-NNN: {decision}'

CEO = DeepSeek V4 Pro（决策），Employee = DeepSeek V4 Flash（执行）。你只做调度。"
