# Search Console quick wins

Every week, find pages that Google already shows often but that few searchers click, and propose a better SEO title and meta description for each. Track every change you make and report, four weeks later, whether it worked. You only change the SEO title and meta description of records; never a name, a description, a slug, a price or anything else.

Search Console data lags about three days. Use the 28 days that end three days before today, and call that "the last 28 days".

## 1. Follow up on earlier changes

Read your automation memory for changes you made earlier (record id, page URL, date applied, the old and new title, clicks, impressions, click rate and position in the 28 days before the change).

For every change applied 28 or more days ago that has no follow-up yet:
- Query Search Console for that page over the 28 days starting the day after the change was approved.
- Compare clicks, impressions, click rate and average position with the stored "before" numbers.
- Verdict: **worked** when click rate rose by at least 20% (relative) and clicks rose; **no change** within ±20%; **worse** when click rate fell by more than 20%. If impressions or position moved a lot (position changed by more than 3 places, or impressions by more than 50%), say the result is mixed with other changes and do not claim the rewrite caused it.
- Mark it followed up in memory. For **worse**, suggest restoring the old title (quote it) in the report; do not restore it yourself.

## 2. Find this week's candidates

1. Find the property with list_sites. Use the property recorded in memory or named in the setup notes; never guess between several.
2. Query search analytics for the last 28 days with dimensions **page**, aggregation by page, up to 1000 rows.
3. Keep pages with at least {{minImpressions}} impressions and an average position between 4 and 15.
4. Work out the expected click rate for the page's position (about 7% at position 4, 5% at 5–6, 3% at 7–10, 1.5% at 11–15) and keep pages whose actual click rate is below that. These are the quick wins: Google already ranks them, the snippet is not earning the click.
5. Leave out pages you changed in the last 8 weeks, pages that are not product or content pages the project holds (home page, cart, account, search results), and pages already rejected by a person in a previous run (memory).
6. Rank by missed clicks: impressions × (expected click rate − actual click rate). Take the top {{maxPages}}.

Match each page to its record by its slug or path, as set up. If no record matches, list the page in the report as "not in Flexkit" and skip it.

## 3. Rewrite the title and description

For each candidate:
- Query Search Console for the page's top 10 search queries (dimension **query**, filtered to the page) over the same 28 days.
- Read the record: name, current SEO title and description, and the facts that describe it. If a brand voice or product copy skill is loaded, follow it.
- Write in {{language}}:
  - **SEO title**, 50–60 characters: lead with the words of the query with the most impressions, if it honestly describes the page; then the most useful detail (material, type, use). Add "{{brandSuffix}}" at the end only when the title still fits.
  - **Meta description**, 140–155 characters: answer what the searcher wanted, with one or two concrete facts from the record. No claim the record does not support, no prices, no "best" or "cheapest".
- Do not repeat the current text with small changes: if you cannot do clearly better, skip the page and say why.

Propose each change as its own mutation of the SEO title and meta description only, so the team can approve some and reject others. Store in memory, per proposal: record id, page URL, old and new title and description, and the "before" numbers (clicks, impressions, click rate, position).

When a proposal is approved, note the date as "applied". When one is rejected, remember the page so you do not propose it again for 8 weeks.

## 4. Report

End with a short report:
1. **Follow-ups**: one line per change that reached four weeks: page, verdict, click rate before → after, clicks before → after.
2. **This week**: one line per proposal: page, impressions, position, click rate vs expected, the query it now targets.
3. Pages skipped and why (not in Flexkit, nothing better to write).

If there are no follow-ups and no candidates, end the run as skipped (Finish Run with status skipped).
