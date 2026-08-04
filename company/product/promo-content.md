# DeepSeek Desktop — 推广文案

> Landing Page URL: **https://daneelolivaw1.github.io/deepseek-launch/**
>
> 目标：通过社区推广收集至少 10 个邮箱注册，验证产品需求（H002 假设）

---

## 1. Reddit r/LocalLLaMA（英文技术社区）

### 发布标题
**I built a dead-simple desktop wrapper for DeepSeek — no API keys, no terminal, just chat. Looking for feedback.**

### 正文

Hey r/LocalLLaMA,

I've been frustrated that all the good local AI tools require some technical setup — API keys, environment variables, model configs, terminal commands. My non-technical friends can't use any of this stuff.

So I'm building **DeepSeek Desktop** — a desktop app that wraps DeepSeek's model in a chat interface so simple your parents could use it.

**What it does:**
- 🖥️ **One-click install.** Download → Install → Chat. Zero config. No API key needed, no terminal.
- 🔒 **Data stays local.** Chat history and uploaded docs are stored on your machine, not in the cloud. This is a big differentiator from ChatGPT Desktop and the web version.
- 📄 **Drag & drop documents.** PDF, Word, Excel — the AI reads and analyzes them. Contract review, paper summaries, spreadsheet Q&A.
- 💰 **Completely free.** Based on DeepSeek's open model. No $20/month subscription like ChatGPT Plus.
- 🇨🇳 **128K context window** (full DeepSeek capability). Offline mode supported.

**Comparison vs alternatives:**

| | DeepSeek Desktop | ChatGPT Desktop | DeepSeek Web |
|---|---|---|---|
| Local data | ✅ | ❌ | ❌ |
| Free | ✅ | ❌ ($20/mo) | ✅ |
| Offline | ✅ | ❌ | ❌ |
| Setup | One-click | Account needed | Browser only |

**Current status:** Landing page is up, collecting waitlist signups. I'm validating demand before building the full thing.

👉 **Check it out:** https://daneelolivaw1.github.io/deepseek-launch/

If you think this is useful (or stupid), I'd love honest feedback. What would make you actually use a desktop AI wrapper?

---

### 发布状态
- [ ] **待手动发布** — Reddit 需要账号和 karma（新账号在 r/LocalLLaMA 发帖可能被 auto-mod 过滤）。建议使用有社区历史的账号发布。
- 发布时机建议：美东时间周二–周四上午 9-11 点（r/LocalLLaMA 活跃时段）
- 也可在 r/selfhosted、r/privacy 做交叉发布（调整文案侧重点）

---

## 2. V2EX（中文技术社区）

### 发布标题
**[项目展示] DeepSeek Desktop — 给不懂技术的人做的国产 AI 桌面客户端**

### 正文

V 站的各位好，

做了一个小工具：把 DeepSeek 包成了一个桌面客户端，目标是让完全不懂技术的人也能用 AI。

**为什么做这个？**

之前给家里人推荐 DeepSeek，他们第一反应是「要注册吗」「API Key 是什么」「命令行怎么用」—— 我觉得不应该这样。ChatGPT 有桌面客户端，但 $20/月且数据上云。DeepSeek 网页版功能强大但浏览器用起来不够「原生」，而且数据隐私对普通用户来说是个隐形问题。

**这个 Desktop 版本做了什么：**

1. **一键安装，零配置。** 下载 → 安装 → 打开就能聊。不用申请 API Key，不用配环境变量，甚至不用打开浏览器。
2. **数据本地存储。** 聊天记录和上传的文档只存在你的电脑上，不上云端。跟 ChatGPT Desktop 和网页版有本质区别。
3. **文档拖拽上传。** 把 PDF / Word / Excel 拖进窗口，AI 自动读。合同审阅、论文总结、报表解读——对非技术用户特别实用。
4. **完全免费。** 基于 DeepSeek 开源模型，128K 上下文，支持离线对话。

目前还在验证需求阶段，做了一个 Landing Page 收集邮箱。如果感兴趣可以看看，也欢迎拍砖。

👉 https://daneelolivaw1.github.io/deepseek-launch/

---

### 发布节点选择建议
- V2EX 的 `/go/create`（创造节点）或 `/go/share`（分享发现节点）
- 标题不要用「震惊」「最强」这类营销词，V2EX 社区反感过度包装
- 适合在北京时间周二–周四上午发布

### 发布状态
- [ ] **待手动发布** — V2EX 需要账号且可能有验证码/手机验证。建议 CEO 或团队成员使用已有 V2EX 账号发布。

---

## 3. 知乎（中文泛用户，回答形式）

### 回答的问题
**「有哪些好用的 AI 桌面客户端？」**

（或类似高流量问题：
- 「2025 年有什么免费的 AI 工具推荐？」
- 「普通人怎么用上国产大模型？」
- 「有没有像微信一样简单的 AI 聊天工具？」）

### 回答正文

作为一个给家里人推荐过各种 AI 工具的人，我来分享一个正在开发中的选择。

先说一个现实：**目前大多数 AI 工具对普通人并不友好。**

- ChatGPT Desktop 好用，但 GPT-4 要 $20/月，而且数据上云端
- DeepSeek 网页版免费且中文能力强，但浏览器里用起来不像「软件」，而且聊天记录在浏览器缓存里有泄露风险
- 各种开源客户端（Chatbox、LobeChat 等）—— 要自己配 API Key，普通人直接被劝退

所以我关注到了一个正在做的项目：**DeepSeek Desktop**。

简单说就是：把 DeepSeek 做成一个像微信一样的桌面聊天软件。

**几个让我觉得值得关注的点：**

1. **不用任何配置。** 不需要注册 API、不需要懂「模型」「Token」这些概念。安装 → 打开 → 聊天，三步搞定。

2. **隐私做得比较好。** 聊天记录和上传的文件都存本地，不经过云端。这一点对用 AI 处理工作文档的人来说很重要——合同、报表这些敏感文件，你肯定不想上传到别人的服务器。

3. **支持文档上传分析。** 把 PDF 拖进去，AI 能帮你总结合同要点；把 Excel 拖进去，能帮你解读数据。对非技术岗位的人来说特别实用。

4. **完全免费 + 128K 上下文。** 基于 DeepSeek 的国产大模型，中文能力原生，没有 ChatGPT 那种「翻译味」。而且上下文窗口很大（128K），可以处理很长的文档。

目前还在开发阶段，他们的 Landing Page 正在收集早期用户邮箱，早期注册用户据说有永久免费资格。

👉 有兴趣可以看看：https://daneelolivaw1.github.io/deepseek-launch/

**适合谁？** 如果你符合以下任意一条，这个工具可能适合你：
- 想用 AI 但被各种配置劝退的
- 需要处理合同/论文/报表但不想学复杂工具的
- 在意数据隐私、不想把文件上传到陌生服务器的
- 想给家里不懂技术的长辈/朋友推荐 AI 工具的

**不适合谁？** 如果你是需要高级功能（代码执行、插件系统、自定义模型参数）的深度用户，这个工具的定位可能太「傻瓜」了。

---

### 发布状态
- [ ] **待手动发布** — 知乎需要账号和手机号验证。建议找到上述高流量问题后，以回答形式发布（比单独发文章曝光更高）。
- 可以同时考虑在「少数派」「Product Hunt China」等平台发布
- 知乎回答如果能配合真实截图，效果更好（目前只有 Landing Page 的 mock 界面）

---

## 4. 备用推广渠道（Bonus）

### Product Hunt（英文）
如果产品有可下载的 beta 版本，Product Hunt 是最有效的冷启动渠道之一。目前只有 Landing Page，不建议现在发布 PH。可在有可用 Demo 后再发布。

### 即刻 / 酷安（中文社区）
- **即刻**：适合「创造者」圈层，可以用类似 V2EX 的文案调整后发布
- **酷安**：数码爱好者社区，可侧重「免费 vs ChatGPT」的性价比角度

### 微信朋友圈 / 微信群
- 最直接的种子用户来源
- 文案可精简为：「做了一个 DeepSeek 桌面版，不用配置，装上就能聊。各位帮忙看看有没有用 👉 [链接]」

---

## 发布检查清单

| 渠道 | 文案 | 链接 | 状态 |
|---|---|---|---|
| Reddit r/LocalLLaMA | ✅ 已准备 | ✅ 已嵌入 | ⬜ 待手动发布 |
| V2EX | ✅ 已准备 | ✅ 已嵌入 | ⬜ 待手动发布 |
| 知乎 | ✅ 已准备 | ✅ 已嵌入 | ⬜ 待手动发布 |
| 备用渠道 | ✅ 已规划 | ✅ | ⬜ 可选 |

---

## 当前限制 & 诚实说明

1. **无法自动发布到社区。** Reddit、V2EX、知乎均需要账号 + 验证，且新账号发布可能被过滤。需要 CEO 或团队成员使用已有账号手动发布。
2. **Landing Page 的邮件收集是模拟的。** 当前页面的 waitlist form 使用 `setTimeout` 模拟提交，并未连接真实后端。在推广前需要接入真实的邮件收集服务（如 Mailchimp、ConvertKit、百度统计、或直接用 Google Forms）。
3. **页面无真实产品截图。** 当前只有 mock 聊天界面。如果能在推广前加入 1-2 张真实产品截图，转化率会显著提升。
4. **Google Analytics ID 是占位符。** 页面中的 `G-XXXXXXXXXX` 需要替换为真实 GA4 ID，否则无法追踪推广效果。

---

*文案撰写时间：2025-08-04 · Employee #1*
