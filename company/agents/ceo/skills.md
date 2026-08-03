# CEO Skills Manifest

> 这是 pi orchestrator 给 CEO agent 挂载的技能列表。
> CEO 不执行这些技能指向的具体操作（代码、调研），CEO 只做决策、审查、分配。

---

## Skill: read-company-state
**类型**: 内部
**触发**: 每次 CEO Heartbeat
**操作**:
1. 读取 `company/company_state.md` — 财务、时间、人力
2. 读取 `company/strategy.md` — 当前方向
3. 读取 `company/experiments.md` — 实验状态
4. 读取 `company/tasks/in-progress/` — 员工进行中任务
5. 读取 `company/tasks/done/` — 待审查任务
6. 读取 `company/agents/ceo/memory.md` — 自己的记忆
**输出**: 现状摘要

## Skill: assign-task
**类型**: CEO → pi orchestrator
**触发**: CEO 决策后需要员工执行
**输入**:
```yaml
employee: employee-1
task: "具体任务描述"
purpose: "为什么做"
expected_output: "交付物"
success_criteria: "通过条件"
deadline: "时间限制"
```
**操作**: pi orchestrator 将任务写入 `tasks/pending/`，然后调度 Employee Agent 执行
**规则**: 同一员工同时只能有 1 个 in-progress 任务

## Skill: review-employee-output
**类型**: 内部
**触发**: `tasks/done/` 非空时
**操作**:
1. 读取员工提交的结果
2. 对比 Success Criteria
3. 三种判决：
   - **PASS** → 记录结果到 `experiments/`，更新 `experiments.md`
   - **REVISE** → 退回 `tasks/pending/` 并附修改意见
   - **ABANDON** → 记录失败到 `lessons.md`，关闭任务
**输出**: 判决 + 依据

## Skill: make-decision
**类型**: 内部
**触发**: 需要做方向选择时
**操作**: 填写 Decision Log，写入 `decisions/wave-NNN.md`
**输出**: Decision Log

## Skill: conduct-review
**类型**: 内部 → pi orchestrator
**触发**: 每波结束
**操作**:
1. 回答 5 个反思问题
2. 更新 `company/lessons.md`
3. 更新 `company/agents/ceo/memory.md`
4. 更新 `company/strategy.md`（如果方向变）
5. 通知 pi orchestrator：本波结束，创建 Git Commit
**Commit 内容**: Decision Log + Experiment Log + Lesson Update

## Skill: pivot
**类型**: 内部
**触发**: 实验连续失败或市场认知改变
**操作**:
1. 记录转向原因到 `lessons.md`
2. 更新 `strategy.md`
3. 存档当前实验
4. 创建新的 Wave Decision
**注意**: pivot 不能删除历史，只能追加

---

## 禁止 CEO 做的事情
- ❌ 写代码
- ❌ 执行调研
- ❌ 直接修改 product/
- ❌ 创建新的 agent
- ❌ 修改历史记录
