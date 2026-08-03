# Task Queue

> pi orchestrator 管理所有任务。
> 任务生命周期：pending → in-progress → done → (CEO review) → archived

---

## Pending Tasks
`tasks/pending/`
> 当前：空。等待 CEO Wave 001 决策后创建第一个任务。

---

## In Progress
`tasks/in-progress/`
> 当前：空。

---

## Done (Awaiting CEO Review)
`tasks/done/`
> 当前：空。

---

## Task Template
每一个任务文件格式：

```markdown
# Task: {task-id}

**Assigned by:** CEO
**Assigned to:** employee-1
**Created:** {timestamp}
**Deadline:** {deadline}
**Status:** pending | in-progress | done | passed | revised | abandoned

---

## Task
{具体任务描述}

## Purpose
{为什么做}

## Expected Output
{交付物描述}

## Success Criteria
- [ ] 条件1
- [ ] 条件2

---

## Employee Report (完成后填写)
{员工提交的结果和交付物路径}

## CEO Review (审查后填写)
**判决:** PASS / REVISE / ABANDON
**依据:** {原因}
```
