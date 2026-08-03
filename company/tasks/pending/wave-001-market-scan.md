# Task: wave-001-market-scan — DeepSeek Ecosystem Pain Point Scan

**Assigned by:** CEO (Founder)
**Assigned to:** employee-1 (DeepSeek V4 Flash)
**Created:** Day 0
**Deadline:** +1 day (Day 1)
**Status:** pending
**Wave:** 001

---

## Task

Systematically scan the DeepSeek developer ecosystem across multiple channels to identify user pain points, unmet needs, and potential business opportunities. Focus on finding **specific, addressable problems** that someone might pay to solve.

### Scan these channels (spend ~30 min per channel):

1. **GitHub** — Search "DeepSeek" repos. What are people building? Look at Issues, Discussions, and READMEs for pain points. Also check DeepSeek's official repos for feature requests and complaints.

2. **Reddit** — r/LocalLLaMA, r/deepseek, r/MachineLearning, r/selfhosted. Search "DeepSeek" and read top threads from past 3 months. What are people struggling with?

3. **Hacker News** — Search "DeepSeek" on HN/Algolia. Read top threads. What do developers care about? What's missing?

4. **Twitter/X** — Search "DeepSeek" + "problem" / "wish" / "need" / "missing". What are developers complaining about or requesting?

5. **DeepSeek Official Docs & API** — Read the API docs, platform docs. What's confusing? What's missing compared to OpenAI/Cursor/Anthropic ecosystems?

6. **Chinese Dev Communities** — 知乎, V2EX, 即刻. Search "DeepSeek 问题" / "DeepSeek 痛点". These are DeepSeek's home-market users — what do they need?

7. **Comparative Analysis** — Look at the OpenAI ecosystem (Cursor, Copilot, LangChain, etc.) and Anthropic ecosystem. What tools/integrations/plugins exist there that DON'T exist for DeepSeek?

## Purpose

We have $100, 30 days, and one employee. Before we spend a single day building anything, we need evidence about WHERE to build. This scan is our first data point. It answers: "Is there a real business here or not?"

## Expected Output

A structured report saved to `company/product/market-scan-report.md` with these sections:

### 1. Raw Data Points (minimum 15)
List each finding with source link. Example format:
```
[1] Reddit r/LocalLLaMA: "DeepSeek API keeps timing out on long context" — 47 upvotes, 23 comments
    Source: https://reddit.com/...
    Pain point: API reliability for long contexts
```

### 2. Pain Point Taxonomy
Group findings into categories. For each category:
- **Category name** (e.g., "API Reliability", "Tooling Gap", "Documentation", "Cost/Performance Tradeoffs")
- **Frequency**: How many data points? How much engagement?
- **Intensity**: Are people angry/frustrated, or mildly inconvenienced?
- **Willingness-to-pay signal**: Is anyone saying "I'd pay for X"?

### 3. Top 3-5 Business Opportunities
For each opportunity:
- **Problem statement** (one sentence)
- **Target user** (who has this problem?)
- **Existing solutions** (if any)
- **Why DeepSeek ecosystem specifically?** (domain constraint check)
- **Rough size estimate**: How many people seem to have this problem? (order of magnitude: 100s? 1000s? 10000s?)
- **Monetization hypothesis**: Would users pay? How much? ($5/mo? $50/mo?)

### 4. NEGATIVE EVIDENCE (mandatory)
Actively search for signals that the ecosystem is WELL-SERVED:
- Are there already good solutions for the pain points found?
- Are users saying "this is fine, no problems"?
- Is the ecosystem too small to support a business?
- What's the strongest argument AGAINST building a business in the DeepSeek ecosystem right now?

## Success Criteria

- [ ] At least 15 raw data points with sources
- [ ] At least 3 distinct pain point categories identified
- [ ] At least 2 potential business ideas with monetization hypotheses
- [ ] Negative evidence section completed (not empty)
- [ ] Report written to `company/product/market-scan-report.md`

## Hypothesis

**Falsifiable hypothesis:** "If DeepSeek's developer ecosystem is experiencing rapid growth with unmet needs, then a systematic scan of 7 channels will identify at least 3 distinct, addressable pain points where users express willingness to pay. **Fail if:** fewer than 3 distinct pain point categories OR zero willingness-to-pay signals OR negative evidence convincingly shows the ecosystem is well-served."

---

## Employee Report (完成后填写)
{员工提交的结果和交付物路径}

## CEO Review (审查后填写)
**判决:** PASS / REVISE / ABANDON
**依据:** {原因}
