# Reporting definitions: Northline Goods

## Time

- Time zone: Europe/London. Week: Monday to Sunday. Order date: `placedAt`.
- Days compare with the previous 7-day average; weeks with the same week last year.

## Orders

An order counts when `financialStatus` is `paid` or `partially_refunded` and `test` is false. Wholesale orders (tag `wholesale`) are reported separately.

## Revenue

Net revenue = `subtotalPrice` − `totalRefunded`, excluding tax and shipping, in GBP. Refunds count on the order's day.

## AOV

Net revenue ÷ counted orders. Not shown for a day with fewer than 5 orders.

## Customers

New: first counted order in the period. Returning: a counted order before the period.

## Known data quirks

Orders before 1 March 2025 were imported without discounts, so revenue before then is gross.

---

Check with these definitions: **yesterday, 24 November — 61 orders, £4,690 net revenue, AOV £76.89.**
