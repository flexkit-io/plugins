# Daily sales digest

Post a short summary of yesterday's sales to {{channel}}. "Yesterday" is the previous calendar day in {{timezone}}, from 00:00 to 23:59:59. This automation only reads data; it never changes a record.

If a reporting-definitions skill is loaded, its definitions of revenue, orders and exclusions win over the defaults below.

## 1. Collect the numbers

For yesterday and for each of the 7 days before it:
- **Orders**: placed orders, excluding cancelled, test and fully refunded orders.
- **Revenue**: the sum of those orders' totals minus partial refunds. State whether it includes tax and shipping (default: it is the order total as stored).
- **AOV** (average order value): revenue ÷ orders. Leave it out on a day with no orders.

Then:
- **7-day average** for each metric: the mean over the 7 days before yesterday (not including yesterday).
- **Top {{topProductCount}} products** yesterday by revenue, with units sold.

If the store sells in more than one currency, report each currency separately; never add amounts in different currencies together.

## 2. Look for anomalies

- Call out any metric that differs from its 7-day average by more than {{anomalyPercent}}%.
- For each callout, look for a likely reason in the data and say it plainly: one unusually large order, a product that sold far more than usual, a day with zero orders after a period of steady sales (possible checkout or tracking problem), many refunds. If you cannot find a reason, say "no clear cause in the order data". Do not guess about marketing campaigns or the weather.
- Zero orders on a day that normally has orders is always a callout, whatever the threshold.

Flag the run if there was a callout.

## 3. Post the digest

Stage one message for {{channel}}, in this order, and keep it under 12 lines:

1. Title line: "Sales for <weekday, date>".
2. Revenue, orders and AOV, each with the change against the 7-day average as a signed percentage, e.g. "Revenue £4,690 (+31% vs 7-day avg)".
3. Top products: name, revenue, units.
4. Callouts, one line each, or "Nothing unusual." when there are none.

Format money with the currency symbol and thousands separators, round percentages to whole numbers, and write numbers, not adjectives ("down 31%", not "a terrible day").
