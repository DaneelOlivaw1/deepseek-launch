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

---

## Employee Report

**Completed:** 2025-08-04 ~02:30 UTC
**Employee:** Employee #1
**Status:** ✅ Completed

### Summary
Wrote 3 English promotional posts targeting international communities, replacing the 2 Chinese posts (V2EX, 知乎). All posts include title, body, CTA with landing page URL, best posting times (UTC-referenced), and community-specific rules/risks.

### Posts Written

| # | Channel | Replaces | Angle | Risk Level |
|---|---------|----------|-------|------------|
| 1 | Reddit r/privacy | V2EX (中文) | Local-first privacy, no cloud, no telemetry | Medium-High |
| 2 | Reddit r/macapps | 知乎 (中文) | Free Mac AI assistant, no subscription | Low-Medium |
| 3 | HN Show HN / Ask HN | (Bonus) | Transparency about validation stage | High (Show HN) / Medium (Ask HN) |

### Key Honest Findings
- 🚨 **Landing page is in Chinese (zh-CN).** Promoting a Chinese-only page to English communities will severely hurt conversion. Documented this prominently.
- 🚨 **Waitlist form is simulated** (`setTimeout` fakes success). No emails are actually collected. H002 cannot be tested without fixing this.
- 🚨 **GA ID is placeholder** (`G-XXXXXXXXXX`). No visitor tracking possible.
- ⚠️ **HN Show HN rules:** Landing pages with waitlist forms don't qualify per HN guidelines. Included both a Show HN version (risky) and an Ask HN alternative (safer).
- The r/privacy post is framed as a personal privacy discovery story, not a product pitch — this matches community norms but must be posted by an account with genuine history.

### Deliverables
- `company/product/promo-content-intl.md` — 3 English promotional posts + posting guidelines + critical blockers doc

### What's Preserved
- ✅ Reddit r/LocalLLaMA English post (unchanged from original `promo-content.md`)

### Recommended Action Before Posting
1. Add English version to landing page (minimum: hero + CTA + features)
2. Connect waitlist form to real email collection (Google Forms, Mailchimp, etc.)
3. Replace GA4 placeholder with real ID
4. Then post in order: r/macapps → r/privacy → r/LocalLLaMA → HN (Ask HN version)

### Success Criteria Check
- [x] 3 English posts targeting international communities
- [x] Tone matches each community's culture (informational for privacy, recommendation-style for macapps, transparent/self-aware for HN)
- [x] All posts include landing page URL
- [x] 0 Chinese-language content in deliverables
