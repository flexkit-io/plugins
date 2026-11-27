# Reporting definitions: [[store name]]

Use these definitions for every number you report about sales, orders and customers: digests, reports, charts and answers to questions. When a request needs a metric that is not defined here, say which definition you used.

## Time

- **Time zone**: [[e.g. Europe/London; days run 00:00–23:59 in this zone]]
- **Week**: [[e.g. Monday to Sunday]]
- **Order date**: [[the field that dates an order, e.g. `placedAt`, not `updatedAt`]]
- **Comparisons**: [[the default comparison, e.g. "vs the previous 7-day average" for days, "vs the same week last year" for weeks]]

## Orders

An order counts when: [[the inclusion rule, using real status values]]

> Example: `financialStatus` is `paid` or `partially_refunded`, and `test` is false. Excluded: `cancelled`, `voided`, `refunded`, draft orders, orders tagged `wholesale` (reported separately).

## Revenue

[[Which amount counts as revenue and what it includes.]]

> Example: **Net revenue** = order subtotal after discounts, minus refunds, excluding tax and shipping. Field: `subtotalPrice` minus `totalRefunded`. Refunds count on the day of the order, not the day of the refund.

- **Currency**: [[e.g. report in GBP; orders in other currencies use `presentmentTotal` converted at the order's stored rate. Never add different currencies.]]

## Average order value (AOV)

[[e.g. net revenue ÷ counted orders, for the same period. Not reported for a day with fewer than 5 orders.]]

## Customers

- **New customer**: [[e.g. a customer whose first counted order is in the period]]
- **Returning customer**: [[e.g. a customer with a counted order before the period]]
- **Repeat rate**: [[e.g. share of customers with 2+ counted orders in the last 365 days]]

## Products

- **Top products**: [[e.g. ranked by net revenue, grouped by product (all variants together); show units too]]
- **Units sold**: [[e.g. line item quantity on counted orders, minus refunded quantity]]

## Formatting

[[How numbers are shown, e.g. "£4,210" with no decimals over £1,000; percentages rounded to whole numbers with a sign: "+18%".]]

## Known data quirks

[[Anything that makes a number misleading: a migration date before which data is incomplete, a channel that is not synced, bulk imports.]]

> Example: orders before 1 March 2025 were imported without discounts, so revenue before then is gross. Marketplace orders (Amazon) are not in the project.
