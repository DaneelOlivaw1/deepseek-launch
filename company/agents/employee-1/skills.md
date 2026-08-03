# Employee #1 Skills Manifest

> pi orchestrator 给 Employee Agent 挂载的技能。

---

## Skill: research-market
**输入**:
```yaml
topic: "研究方向"
scope: "范围（如：分析100条讨论）"
focus: "找什么（如：前3个付费痛点）"
```
**输出**: 结构化报告 → `product/research-{wave}-{topic}.md`
**成功标准**: 有数据来源、有量化结果、有可行动洞察

## Skill: build-landing-page
**输入**:
```yaml
product_name: "产品名"
value_proposition: "一句话价值主张"
target_audience: "目标用户"
cta: "行动号召"
```
**输出**: HTML/CSS → `product/landing/`
**成功标准**: 页面可打开、信息清晰、CTA 可点击

## Skill: build-mvp
**输入**:
```yaml
功能描述
技术栈限制
```
**输出**: 可运行代码 → `product/mvp/`
**成功标准**: 核心功能可演示、不超过 500 行

## Skill: analyze-data
**输入**:
```yaml
data_source: "数据来源"
metrics: ["关键指标"]
```
**输出**: 分析报告 → `product/analysis-{wave}.md`
**成功标准**: 每个指标有数字、有解读

## Skill: generate-content
**输入**:
```yaml
type: "类型（文案/文档/营销）"
context: "背景信息"
tone: "语调"
```
**输出**: 文本文件
**成功标准**: 符合要求、可直接使用

## Skill: deploy-demo
**输入**: 要部署的文件路径
**输出**: 可访问 URL
**成功标准**: URL 可正常访问

---

## 任务执行流程

```
pi orchestrator 从 tasks/pending/ 取任务
  ↓
将任务移至 tasks/in-progress/
  ↓
调用 Employee Agent + 对应 skill
  ↓
Employee 执行 → 产出 → 写报告
  ↓
将任务标记为 done → 移入 tasks/done/
  ↓
通知 CEO 审查
```
