# Experiments Log

> 记录所有实验。不可修改历史记录，只能追加。

---

## 实验总览

| Wave | 假设 | 结果 | 结论 |
|------|------|------|------|
| 001 | 市场扫描可发现≥3个痛点 | 未执行 | Founder 直接定方向 |
| 002 | Landing Page 验证需求 | ✅ 页面已完成 | 等待推广和数据 |
| 003 | Deploy & Promote — ≥10 emails | ⚠️ 未执行 | 准备完成，但发现 Truth Crisis 阻塞推广 |

---

## Wave 001 — 市场扫描 (已关闭)

**假设:** 扫描 7 个渠道会发现 ≥3 个有支付意愿的痛点
**结果:** 实验未执行。Founder 在 Day 0 亲自指定了产品方向。
**结论:** Founder override。转向 Wave 002。

---

## Wave 002 — Landing Page 验证

**假设:** 如果 DeepSeek 有一个好用的桌面 App，非技术用户会愿意使用。

**行动:** 制作 Landing Page 展示产品概念。
**交付物:** `company/product/landing-page.html` — 562 行纯 HTML，包含 Hero、功能卡片、竞品对比、邮箱等待列表。
**Employee 消耗:** 7 turns, $0.0537

**结果:** Landing Page 已完成，设计专业，全部 6 项成功标准通过。

**结论:** 进入推广阶段，需要收集用户注册数据来验证假设。

**下一步:** Wave 003 — 推广 Landing Page，获取前 100 个访问和注册数据。

---

## Wave 003 — Deploy & Promote Landing Page（✅ 已关闭 — 准备完成，推广未执行）

**假设 (延续 H002):** 向目标用户展示产品概念，≥10 人会留下邮箱。

**行动 (Initial):** 部署 Landing Page 到 GitHub Pages + 撰写推广文案。
**Initial 交付物:** 
- ✅ Landing Page 已部署
- ⚠️ 3 篇推广文案（1 篇 r/LocalLLaMA 英文可用，2 篇 V2EX/知乎 方向错误）
- ❌ 邮件收集是假的（setTimeout mock）
- ❌ GA ID 占位符

**CEO 审查判决:** REVISE → 3 个修正任务

**修正任务结果:**
| Task | 内容 | 结果 |
|------|------|------|
| #2 | 重写英文推广文案 | ✅ r/privacy, r/macapps, HN 三篇 + 保留 r/LocalLLaMA |
| #3 | 修复邮件收集 + GA | ✅ Formsubmit.co 集成；GA console fallback |
| #4 | 翻译 Landing Page 为英文 | ✅ lang="en"，零中文 |

**修正后状态:** 4 篇英文推广文案就绪、邮件收集真实（待 Founder 验证）、Landing Page 全英文。总消耗 ~$0.32。

**CEO 最终审查 — TRUTH CRISIS:** 在授权推广前，CEO 发现 Landing Page 声称"数据留在本地""离线模式""绝不传到云端"与 MVP 架构（DeepSeek API → 云处理）不一致。推广被阻止。

**结论:** 实验未执行。Wave 003 作为"准备波"完成。实验有效性取决于 Wave 004 先解决 Truth Crisis。详见 `experiments/wave-003-result.md` 和 `decisions/wave-003.md`。

---

*最后更新：Day 1 — Wave 003 关闭*
