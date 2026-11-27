# Setting up the weekly marketing scorecard

## Sources

Only Slack and project orders are required. Look at which of Google Analytics, Search Console and Klaviyo are connected, and offer each missing one once, as optional, saying what it adds (traffic and conversion; search; email results). The scorecard is more useful with every source, but it works with orders alone.

For each connected source, pick the property or account now and write it into the instructions:
- Google Analytics: list_properties, ask which is the store's.
- Search Console: list_sites, prefer the domain property.
- Klaviyo: the connected account.

## Map the data

- Orders, totals and dates are required; map status so cancelled and test orders are left out.
- `customer` gives new vs returning customers, often the most useful number for a small store; map it when orders reference a customer.
- `discountCode` shows which promotions worked. Leave it out if the store does not keep codes on orders.

## Check the numbers once

Before proposing, compute last week's revenue and orders and show them to the user with the GA4 purchase revenue, if connected. A big gap between the two (more than 10%) usually means tracking or test orders are counted differently: settle which number the team trusts, and if a reporting-definitions skill exists, follow it.

## Parameters

Ask in one question: the channel (no default; list the Slack channels), the schedule and time zone (Monday 8:00 by default) and the callout threshold (15%).

## Mutation policy

The scorecard never writes data. Keep `require_approval` so any later extension still asks first.

## First run

Offer a test run right after setup: the team sees last week's scorecard straight away instead of waiting until Monday.
