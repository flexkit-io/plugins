# Content freshness audit

Every month, find the published pages and articles that have gone stale, explain what is out of date in each, and propose a fix. Never publish, unpublish or delete content.

## 1. Find candidates

- Only published content: skip drafts, archived pages and anything scheduled for later.
- A page is a **candidate** when it has not been updated for {{staleMonths}} months or more, or when it is newer but step 2 finds a hard problem in it (a past date, a wrong price, a link to something gone).
- Order candidates by last update, oldest first, and review at most {{maxItems}}. Say how many more are waiting.
- Skip pages this automation already proposed edits for in the last 60 days that were rejected: the team decided to keep them. Use your automation memory to remember them, with the date.

## 2. Check each candidate

Read the whole text and look for:
- **Past dates and seasons**: "this summer", "in 2024", "our autumn sale", event or launch dates that have passed, "new" for something launched more than a year ago. Today's date is the reference.
- **Prices**: any price quoted for a product the project still sells. Compare with the product's current price; flag a mismatch, and say both numbers.
- **Missing things**: links or mentions of products, collections or pages that no longer exist in the project or are unpublished. Match by slug or by exact name.
- **Time-bound claims**: "free shipping until…", "limited stock", promo codes, opening hours or contact details that differ from other content in the project.
- **Age alone**: if nothing else is wrong, a page older than {{staleMonths}} months is still listed, as "review only", so someone confirms it is still true.

External links cannot be checked from here; do not claim a link is broken unless it points to a record of this project that is gone.

## 3. Write the fix (only when proposing edits is on: {{proposeEdits}})

- For each hard problem, propose the smallest edit that fixes it: replace the sentence or phrase, keep the rest of the text exactly as it is. Match the page's tone; follow the publishing checklist or brand voice skill when one is loaded.
- Prices: use the current price from the product record. Dates: remove the date or reword to something that does not expire ("our seasonal sale"), unless the page is a dated news post, which stays as it is and gets no edit.
- A link to a missing product: point it to the product's replacement only if one is obviously named in the project (same name, a "replaced by" field); otherwise propose removing the link and keeping the text.
- Propose all edits of one page together, so the reviewer sees the page's changes in one place. Pages listed as "review only" get no edit.

## 4. Report

- If no page is a candidate, end the run as skipped (Finish Run with status skipped) so nothing is posted.
- Otherwise write a short report: how many pages were reviewed, how many have hard problems, how many are review only, and how many wait for next month. Then one line per page, hard problems first: title (slug), last updated, what is wrong in a few words, and whether an edit was proposed.
- When a Slack channel is set ({{channel}}), stage the same report for it, at most 15 lines.

Flag the run when any page quotes a wrong price or links to something gone.
