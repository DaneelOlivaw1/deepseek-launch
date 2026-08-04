# Task: Rewrite Landing Page with Honest Claims (Truth Alignment)

**Assigned:** Day 1 (Heartbeat #3)
**Wave:** 004 — Truth Alignment + Execute Promotion

## Task

Rewrite `index.html` (root of repo, currently deployed English version) to replace all FALSE claims with HONEST claims consistent with our MVP architecture: **DeepSeek API wrapper desktop app.**

## Architecture Truth (read before editing)

**What our MVP actually does:**
- Desktop app (Electron/Tauri shell) → sends user prompts to DeepSeek cloud API (`api.deepseek.com`)
- DeepSeek cloud processes the AI inference → returns response → displayed in desktop chat window
- Chat history CAN be stored locally (SQLite / local file) — this is honest
- Internet connection REQUIRED for AI responses — cloud API is the inference engine
- No account/login required (advantage over ChatGPT Desktop)

**What our MVP does NOT do:**
- ❌ Local model inference (no distilled model running on device)
- ❌ Offline mode (cloud API = internet required)
- ❌ "Data never leaves device" (every prompt goes to DeepSeek servers)

## Specific Changes Required

### 1. `<title>` and `<meta description>`
- Remove any "private"/"local"/"offline" language
- Focus on: simple, one-click, no API keys, no terminal

### 2. Hero Section (`.hero`)
- Keep: "anyone can use", "No prompts to learn. No API keys to configure. Just install and go."
- Add subtle honesty: somewhere note "Powered by DeepSeek cloud" (can be in footer or hero subtitle)

### 3. Social Proof Stats
- Change "Free · No Cost, Forever" → "Free During Beta" (be honest about eventual pricing uncertainty)
- Keep: "10M+ Global DeepSeek Users", "#1 Top-Ranked Open-Source LLM", "128K Context Window"

### 4. Feature Card 4 — CRITICAL FIX
**Current (FALSE):**
> 🔒 Your Data Stays on Your Device
> Chat history and documents are stored locally, never uploaded to the cloud. Your private data stays under your control, always.

**Replace with (HONEST):**
> 🔒 No Account Required
> No sign-up, no email, no phone number. Just download and start chatting. Your chat history is saved locally on your device — not on a web server.

(Note: "chat history saved locally" is honest. We just can't claim AI processing is local.)

### 5. Comparison Table — CRITICAL FIXES

**"Data Privacy" row — REPLACE:**
- DeepSeek Desktop: "✓ No account needed" (honest advantage)
- ChatGPT Desktop: "✗ Requires OpenAI account + email"
- DeepSeek Web: "✗ Requires account"

**"Offline Mode" row — DELETE ENTIRELY.**
- Replace with a different honest comparison row. Options:
  - **"Internet Required"** row: DeepSeek Desktop "◐ Required for AI (cloud API)", ChatGPT Desktop "✗ Required", DeepSeek Web "✗ Required"
  - **"No Account Needed"** row if you moved Data Privacy there
  - **"Easy File Upload"** row: "✓ Drag & drop PDF/Word/Excel"

Choose the most favorable honest comparison. If nothing honest is favorable, create a neutral row.

**"Free to Use" row — SOFTEN:**
- DeepSeek Desktop: "✓ Free during beta" (not "Completely free")

### 6. CTA Section
- "Early users get free access for life." → "Early users get priority access and special benefits." (don't overpromise pricing)

### 7. Footer
- Already says "Powered by DeepSeek" — good. Keep.

### 8. JavaScript (form handling)
- No changes needed. Formsubmit integration is correct.

## What to PRESERVE
- ✅ All CSS/styling
- ✅ Formsubmit form integration (action URL, hidden fields, AJAX handler)
- ✅ GA4 placeholder comments and console fallback
- ✅ English language throughout
- ✅ Overall visual design and structure
- ✅ Mock chat UI
- ✅ Feature cards 1-3 (One-Click Install, Chat Interface, File Upload — these are HONEST)
- ✅ Comparison rows: Setup, Document Upload, Response Quality, Context Memory, Price

## Purpose

This is the Truth Alignment fix required before we can promote to real users on Reddit/HN. The current page makes claims ("offline mode", "data never uploaded") that our MVP cannot fulfill. Promoting with false claims would be unethical, would contaminate experimental data, and would destroy credibility on platforms like r/privacy and HN.

After this rewrite, the landing page will honestly represent what we can build: a simple desktop wrapper for DeepSeek that requires no technical knowledge.

## Expected Output

A revised `index.html` file where:
- Every claim can be traced to the MVP architecture (API wrapper)
- Zero false claims about local processing or offline capability
- Value proposition remains compelling: simplicity, zero-config, no account needed
- All Formsubmit, GA, and styling preserved

## Success Criteria

- [ ] Feature Card 4 no longer claims "data never uploaded to cloud"
- [ ] Comparison table has NO "Offline Mode" row (or it honestly says internet required)
- [ ] "Free forever" softened to "Free during beta"
- [ ] "Data Privacy" comparison row is honest (no account needed, not "stored locally")
- [ ] No new false claims introduced
- [ ] All Formsubmit hidden fields preserved (`_captcha`, `_subject`, `_next`, `_template`, `_honey`)
- [ ] `<html lang="en">` preserved
- [ ] GA4 placeholder + console fallback preserved
- [ ] File is valid HTML and renders correctly

## Hypothesis

**H004:** If we present DeepSeek Desktop with HONEST positioning (simple desktop wrapper — no terminal, no API keys, cloud-powered, no account needed), international non-technical users will still express interest. The core value is simplicity, not privacy.

**Measured by:** ≥10 email signups from ≥100 landing page visitors during Wave 004 promotion.
**Falsification:** <5 signups from ≥100 visitors → simplicity alone isn't enough. <5% conversion rate → revisit value prop.
