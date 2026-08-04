# Task: Fix Landing Page — Real Email Collection + Google Analytics

**Assigned:** Day 1
**Wave:** 003 (Revision Phase)
**Priority:** 🔴 Critical (BLOCKER — all promotion is wasted without this)

## Task

Fix the two critical issues on the live Landing Page:

### Part 1: Replace Fake Email Collection with Real Collection

**Current problem:** The waitlist form in `index.html` uses `setTimeout` to simulate submission. It does NOT collect any emails. This makes H002 unfalsifiable.

**Required fix:** Replace the fake form with a real Google Forms embed.

**Why Google Forms (not Mailchimp):**

| Factor | Google Forms | Mailchimp |
|--------|-------------|-----------|
| Cost | $0 | $0 (free tier, 500 contacts) |
| Setup time | 5 minutes | 30-60 minutes |
| Embed method | `<iframe>` | Embedded form + JS |
| Email verification | Manual (check responses) | Automated |
| Export | Google Sheets auto-sync | CSV export |
| Migration risk | Low (export CSV anytime) | Medium (lock-in) |
| GDPR | Acceptable for validation | Better |

**CEO Decision: Google Forms.** Rationale: At 0 users and 0 validated demand, the only requirement is "actually collect emails." Google Forms achieves this with minimal time cost. We can migrate to Mailchimp/ConvertKit when we have ≥50 subscribers — premature optimization before then.

**Steps:**
1. Read the current `index.html`, locate the waitlist form (search for `setTimeout` or form submit handler).
2. Create a Google Form with 1 field: Email address (with validation).
3. Get the Google Form's embed `<iframe>` URL from "Send → Embed HTML."
4. Replace the fake form in `index.html` with the Google Forms `<iframe>`. 
5. If iframe styling is ugly, wrap it in a styled container. Or use the Google Forms "pre-filled link" approach with a custom HTML form that POSTs to the Google Forms endpoint.
6. Add a note in the page: "We'll email you when DeepSeek Desktop is ready. No spam, unsubscribe anytime."
7. Test: submit a test email and verify it appears in Google Forms responses.

### Part 2: Replace Placeholder Google Analytics ID

**Current problem:** `G-XXXXXXXXXX` is a placeholder. No analytics data is being collected.

**Required fix:**
1. CEO will create a real GA4 property and provide the Measurement ID.
2. Replace `G-XXXXXXXXXX` with the real ID in `index.html`.
3. If CEO hasn't provided the ID yet: leave a clearly marked `<!-- TODO: REPLACE WITH REAL GA4 ID -->` comment AND add a fallback that logs to console for local verification.

**If GA4 ID is not available from CEO:** Add a lightweight, privacy-respecting alternative. Suggest using a simple pageview counter (like hitcount.io or a Cloudflare Worker) as a stopgap. The critical thing is: **we must be able to count visitors before we promote.**

### Part 3: Deploy Updated Page

1. Commit changes to git.
2. Push to `main` branch.
3. Verify live at https://daneelolivaw1.github.io/deepseek-launch/
4. Test email form submission on the live page.

## Purpose

Without real email collection, **every promotion action is wasted.** H002 hypothesis ("≥10 people will leave their email") is unfalsifiable with a fake form. This task unblocks the entire experiment.

## Expected Output

1. Updated `index.html` with real Google Forms email collection (working, tested)
2. Updated `index.html` with real GA4 ID (or documented fallback)
3. Live site verified: email submission → appears in Google Forms responses

## Success Criteria
- [ ] Submitting an email on the live page actually saves it (verifiable in Google Forms/Sheets)
- [ ] No `setTimeout` or mock submission code remains in the form handler
- [ ] GA4 ID is real (or documented with fallback + TODO)
- [ ] Updated page is live at https://daneelolivaw1.github.io/deepseek-launch/
- [ ] Test email collected: `ceo-test@deepseek-launch.dev` appears in responses

## Hypothesis
**H003-fix:** If we replace the fake email form with Google Forms embed, we can collect ≥10 real emails during Wave 003 promotion. Fail condition: form breaks on live site, or collects 0 emails after 48 hours of promotion.
