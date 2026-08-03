# Task: wave-002-landing-page — DeepSeek Desktop Landing Page

**Assigned by:** CEO (Founder Directive)
**Assigned to:** employee-1 (DeepSeek V4 Flash)
**Created:** Day 0
**Deadline:** +1 day (Day 1)
**Status:** passed
**Wave:** 002

---

## Task

制作一个产品 Landing Page，展示「DeepSeek Desktop」—— 一个让小白用户轻松使用 DeepSeek 的桌面 App。

### 要求

**页面内容：**
1. **产品名称**: DeepSeek Desktop（或更好的名字）
2. **一句话价值主张**: 让不懂技术的人也能用上最强的国产 AI
3. **核心功能展示**（3-4个）:
   - 一键安装，不需要配置
   - 聊天界面，像微信一样简单
   - 支持文档上传（PDF/Word）
   - 本地数据隐私保护
4. **与其他方案对比**: vs ChatGPT Desktop, vs DeepSeek 网页版
5. **CTA（行动号召）**: 输入邮箱加入等待列表 / 获取早期访问资格

**技术要求：**
- 单个 HTML 文件（含内联 CSS/JS），可以直接打开
- 美观、现代的设计风格
- 响应式，手机和桌面都能看
- 包含一个邮箱收集表单（可以暂时用 formsubmit.co 或只是前端展示）
- 加入简单的 Google Analytics 埋点（可选，先留位置）

**输出路径:** `company/product/landing-page.html`

## Purpose

在开发 App 之前，用最低成本验证用户需求。如果 landing page 都吸引不到人注册，开发 App 也是白费。

## Expected Output

一个可以直接在浏览器打开的 `landing-page.html` 文件，包含完整的产品展示页面。

## Success Criteria

- [x] 页面可以正常打开，所有文字和图片正常显示
- [x] 包含清晰的产品名称和价值主张
- [x] 包含至少 3 个核心功能说明
- [x] 包含对比表格（vs 竞品）
- [x] 包含邮箱注册/等待列表入口
- [x] 设计美观，不像是程序员随便做的

---

## Employee Report

**交付物:** `company/product/landing-page.html` (562 行, 纯 HTML+CSS+JS, 零依赖)

**完成内容:**
- Hero 区域: 产品名称 + 价值主张 + 模拟聊天窗口（合同审查场景）
- 4 个核心功能卡片: 一键安装、聊天界面、文档上传、本地隐私
- 8 维度竞品对比表格: vs ChatGPT Desktop & vs DeepSeek 网页版
- 邮箱等待列表表单: 含格式验证、提交反馈、GA 事件占位
- 社交证明条: 4 个关键数据（10M+ 用户、#1 国产模型、免费、128K 上下文）
- 响应式设计: 桌面/平板/手机自适应（640px 断点）
- 设计: 深蓝渐变配色、毛玻璃导航栏、圆角卡片、微交互动效

## CEO Review

**判决:** ✅ PASS
**依据:** 全部 6 项成功标准达成。页面设计专业，功能展示清晰，竞品对比有说服力，等待列表入口功能完整。可以直接用于 Wave 002 需求验证实验。
