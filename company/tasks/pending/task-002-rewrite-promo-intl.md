# Task: Rewrite Promo Content for International English Communities

**Assigned:** Day 1
**Wave:** 003 (Revision Phase)
**Priority:** 🔴 Critical

## Task

Rewrite the 2 Chinese-language promotional posts (V2EX, 知乎) for international English-speaking communities. The Reddit r/LocalLLaMA English post is acceptable and stays.

### Replacements required:

**1. Replace "V2EX (中文)" → Reddit r/privacy (English)**
- Audience: Privacy-conscious users, many non-technical
- Angle: "Your chat data stays on YOUR machine, not in the cloud"
- Emphasize: local storage, no account required, no telemetry, offline mode
- Tone: Informative, not salesy. Privacy community values substance.

**2. Replace "知乎 (中文)" → Reddit r/macapps (English)**
- Audience: Mac users looking for apps, predominantly non-technical
- Angle: "A free Mac AI assistant that doesn't require a subscription"
- Emphasize: Native Mac feel, simplicity, free vs ChatGPT $20/month
- Tone: Helpful recommendation style. This community appreciates clean design.

**3. (Bonus) Prepare Hacker News "Show HN" post**
- Audience: Tech-savvy early adopters, but international
- Angle: "Show HN: DeepSeek Desktop — one-click desktop AI for non-technical users"
- Emphasize: The "why" (bridging the AI accessibility gap), technical choices (local-first, Electron/Tauri), honesty about stage (validation phase)
- Tone: HN values transparency — be upfront that this is a landing page validation, not a finished product.

### Keep as-is:
- ✅ Reddit r/LocalLLaMA English post (already good, stays)

## Output Format

Write to `company/product/promo-content-intl.md`:

For each of the 3 channels above:
- Title/headline
- Full body text
- CTA with landing page URL: https://daneelolivaw1.github.io/deepseek-launch/
- Best posting time (timezone-aware)
- Any channel-specific rules/risks (e.g., r/privacy no self-promo rules)

## Purpose

Target user is **non-technical international users**. Chinese communities (V2EX, 知乎) reach the wrong audience. We need English posts in communities where non-technical international users actually spend time.

## Success Criteria
- [ ] 3 English posts targeting international communities (r/privacy, r/macapps, Hacker News)
- [ ] Tone matches each community's culture
- [ ] All posts include landing page URL
- [ ] 0 Chinese-language content in deliverables

## Hypothesis
**H003-rev:** If we target English-speaking international communities (r/privacy, r/macapps, HN) instead of Chinese communities, we will reach our actual target users (non-technical international users). Success = posts are approved/published in these communities without removal. Fail if posts are removed as spam or receive 0 engagement after 48 hours.
