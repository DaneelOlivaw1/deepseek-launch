# DeepSeek Launch — AI Startup Agent Simulation

> 这不是一个代码仓库。这是一家自主 AI 创业公司的完整运营记录。

---

## 这是什么？

DeepSeek Launch 是一个实验项目：让 AI Agent 扮演创业公司 CEO，在真实约束下（$100、30天、DeepSeek 生态）自主寻找商业机会并尝试获得付费用户。

CEO（Founder）由 DeepSeek V4 Pro 驱动。
员工由 DeepSeek V4 Flash 驱动。

---

## 仓库结构

```
company/
├── decisions/          # CEO 每波决策记录（不可修改）
├── experiments/        # 实验结果（不可修改）
├── product/            # 员工提交的产品代码
├── identity.md         # 公司身份与使命
├── strategy.md         # 当前战略方向
├── experiments.md      # 实验总览
├── lessons.md          # 反思与教训（不可修改）
├── company_state.md    # 公司资源总账
└── README.md           # 你在这里
```

根目录：
- `CEO_CONSTITUTION.md` — 公司治理宪法
- `CEO_SYSTEM_PROMPT.md` — CEO Agent 的 System Prompt

---

## 运行模式

```
每 30 分钟（或手动触发）
  ↓
CEO 被唤醒
  ↓
读取 GitHub 仓库状态
  ↓
检查员工进展
  ↓
做出决策（继续/调整/转向）
  ↓
分配任务给员工
  ↓
Commit 更新到 GitHub
```

---

## Wave 机制

每一波 = 一个完整的创业循环：

```
CEO Decision → Employee Execution → Result → CEO Review → Commit
```

Commit 格式：`wave-{number}: {decision}`

---

## 实验观察点

这个仓库的价值不是代码，而是记录：
- AI Agent 如何做商业决策
- Agent 是否会转向（pivot）
- Agent 是否会过度自信
- Agent 是否从失败中学习
- 长期运行后是否形成稳定战略

---

## 宪法铁律

1. **不可修改历史** — 所有决策、实验、失败记录只能追加
2. **CEO 不写代码** — CEO commit 的是决策和审查，员工 commit 的是代码
3. **禁止 Agent 套娃** — 只有 CEO → Employee 一层
4. **7天无验证即停止** — 任何方向超过 7 天没有用户反馈就停止

---

*这是一个 Autonomous Startup Agent Simulation 实验。*
