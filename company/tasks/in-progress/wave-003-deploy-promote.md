# Task: wave-003-deploy-promote — 部署 Landing Page + 推广

**Assigned by:** CEO (Founder)
**Assigned to:** employee-1 (DeepSeek V4 Flash)
**Created:** Day 1
**Deadline:** +1 day (Day 2)
**Status:** completed
**Wave:** 003

---

## Task

把 DeepSeek Desktop 的 Landing Page 部署到公网，并准备推广内容。

### Part 1: 部署 Landing Page 到 GitHub Pages

1. 将 `landing-page.html` 重命名为 `index.html`，放到项目根目录或 `docs/` 目录
2. 启用 GitHub Pages（需要在 GitHub repo 设置，如果还没推送到 GitHub，先推送）
3. 确保页面可以通过 `https://<username>.github.io/deepseek-launch/` 访问
4. 如果无法使用 GitHub Pages，用其他免费方案（如 Netlify Drop、Vercel、或直接告诉用户用 ngrok）

### Part 2: 撰写推广文案

为以下社区撰写适配的推广内容，写入 `company/product/promo-content.md`：

1. **Reddit r/LocalLLaMA** (英文，技术社区)
   - 标题吸引人，内容真诚
   - 强调：免费、开源模型、隐私保护

2. **V2EX** (中文，技术社区)
   - 突出 DeepSeek 国产优势
   - 低调真诚，不要像广告

3. **知乎** (中文，泛用户)
   - 以回答问题的形式："有哪些好用的 AI 桌面客户端？"
   - 自然介绍产品

每篇包含：
- 标题/开头
- 核心卖点（3 点）
- 链接（部署后的 URL）
- Call to Action

### Part 3: 在社区发布

如果工具允许（bash 可以执行 curl 等），尝试在至少 1 个社区实际发布。如果不行（需要账号、验证码等），将文案准备好，标记为"待 CEO 手动发布"。

## Purpose

Landing Page 只有被人看到才能验证需求。部署 + 推广是让 H002 假设得到真正验证的关键一步。

## Expected Output

1. Landing Page 部署到公网（或明确的部署方案）
2. `company/product/promo-content.md` — 至少 3 篇推广文案
3. 如果可能，至少 1 个社区实际已发布

## Success Criteria

- [x] `index.html` 可以通过公网 URL 访问（或明确说明如何部署）
- [x] 至少 3 篇推广文案，适配不同社区
- [x] 每篇文案包含 URL 链接和 CTA
- [x] 如果无法实际发布，说明原因和下一步

---

## Employee Report
**Completed:** 2025-08-04 02:10 UTC
**Employee:** Employee #1 (DeepSeek V4 Flash)

### Summary

✅ **Part 1 — 部署完成。** Landing Page 已成功部署到 GitHub Pages。
- GitHub Repo: `DaneelOlivaw1/deepseek-launch` (public)
- Live URL: **https://daneelolivaw1.github.io/deepseek-launch/**
- HTTP 200 confirmed, all content rendering correctly (20+ key term matches verified)
- 技术细节：通过 `gh` CLI 创建 repo、push 代码、启用 Pages；遇到 Jekyll 覆盖 index.html 的问题，通过 `.nojekyll` 文件解决

✅ **Part 2 — 推广文案完成。** 为 3 个主要社区 + 备用渠道撰写了适配文案：
- Reddit r/LocalLLaMA：英文，强调隐私/免费/本地数据
- V2EX：中文技术社区，低调真诚，侧重国产优势
- 知乎：以回答「有哪些好用的 AI 桌面客户端？」形式，面向泛用户
- Bonus：Product Hunt / 即刻 / 酷安 / 微信朋友圈的补充建议

⚠️ **Part 3 — 未实际发布。** 原因：Reddit、V2EX、知乎均需要账号登录 + 验证码/手机验证，无法通过 bash/curl 自动发布。所有文案已标注「待 CEO 手动发布」。

### Deliverables
- `index.html` — Landing Page（项目根目录，已部署）
- `company/product/promo-content.md` — 3 篇推广文案 + 备用渠道 + 诚实说明

### Important Caveats（CEO 请知悉）
1. **邮件收集是模拟的。** Waitlist form 使用 `setTimeout` 模拟成功，未连接真实后端。需接入 Mailchimp/ConvertKit/Google Forms 才能实际收集邮箱。
2. **Google Analytics ID 是占位符** (`G-XXXXXXXXXX`)，需替换为真实 GA4 ID。
3. **页面只有 mock 截图**，无真实产品界面。如果有 beta 截图替换，转化率会更好。
4. **发布需要真实社区账号**，新注册账号可能被过滤，建议使用有历史的账号。

## CEO Review (审查后填写)
**判决:** REVISE
**依据:** 
- ✅ Landing Page 部署成功，Reddit r/LocalLLaMA 英文文案可用
- ❌ 推广文案 2/3 面向中文社区（V2EX、知乎）— 目标用户是国际非技术用户，方向错误
- ❌ 邮件收集是假的（setTimeout 模拟），零邮箱收集 — H002 不可证伪
- ❌ GA ID 是占位符 — 无法追踪访问数据
- 📋 修正方向：Task #2（重写英文推广）+ Task #3（Google Forms 邮件收集 + GA ID）
- 📋 Lesson: 目标用户约束必须写入任务描述（禁止中文社区）
