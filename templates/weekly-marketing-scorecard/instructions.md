# Weekly marketing scorecard

Every Monday, post one scorecard of last week to {{channel}}. "Last week" is Monday 00:00 to Sunday 23:59:59 in {{timezone}}. Compare each number with the week before and with the average of the 4 weeks before last week. This automation only reads; it never changes a record and never sends anything but the Slack post.

If a reporting-definitions skill is loaded, its definitions of revenue, orders and exclusions win over the defaults below.

## 1. Collect the numbers

Use every source that is connected; leave out the sections of a source that is not, without comment. Use the properties and accounts named in the setup notes.

**Sales** (project orders, always):
- Orders, revenue and AOV, excluding cancelled, test and fully refunded orders.
- New vs returning customers (a customer is new when last week holds their first order), when customers are mapped.
- Top 3 products by revenue, and the top discount codes by orders, when mapped.

**Traffic** (Google Analytics, when connected):
- Sessions, and sessions by default channel group (organic search, paid, email, social, direct, referral).
- Ecommerce conversion rate (purchases ÷ sessions) and, when the property has it, GA4 purchase revenue. If GA4 revenue differs from order revenue by more than 10%, mention it once: tracking may be missing orders.

**Search** (Search Console, when connected): search data lags about three days, so use the 7 days ending three days ago, and the same span a week earlier.
- Clicks, impressions, click rate and average position.
- The 3 queries and 3 pages whose clicks rose most, and the 3 that fell most.

**Email** (Klaviyo, when connected):
- Campaigns sent last week: name, recipients, open rate, click rate, attributed revenue.
- Flow revenue in total, and the top flow.

If a source fails, keep going with the others and say in one line which one could not be read.

## 2. Find what changed and why

For every headline number (revenue, orders, AOV, sessions, conversion rate, search clicks, email revenue), work out the change against the week before and the 4-week average. Call out a change above {{changePercent}}% against the 4-week average.

For each callout, find the likely reason in the data and connect sources: "Revenue +34%: the 'Spring linen' email (Thursday) brought £1,920, and organic clicks to the linen shirts rose 40%." Say "no clear cause in the data" when there is none. Do not credit or blame anything you cannot see in the data (weather, competitors, ads you have no numbers for).

## 3. Three things to do this week

End with exactly three actions, each concrete, tied to a number above, and doable this week by the team. Good: "Restock Linen Shirt M: it drew 18% of product views last week and is sold out." "Resend the spring email to non-openers: 41% open rate, £1,920 revenue." Bad: "Improve SEO." "Post more on social media." When the data does not support three good actions, give fewer and say so.

## 4. Post

Stage one Slack message, under 25 lines:
1. Title: "Marketing scorecard, week of <Monday date>".
2. **Sales**: revenue, orders, AOV, new customers, each with "(+12% vs last week, +8% vs 4-wk avg)".
3. **Traffic**, **Search**, **Email**: the headline numbers of each connected source, in one or two lines each.
4. **What changed**: the callouts with their reasons, or "No big changes."
5. **This week**: the three actions, numbered.

Format money with the currency symbol, round percentages to whole numbers, and never add amounts in different currencies together.
