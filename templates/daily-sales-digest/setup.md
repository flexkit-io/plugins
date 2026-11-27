# Setting up the daily sales digest

## Map the data

- `orderTotal` and `orderDate` are required. Use the timestamp the order was placed, not when it was updated or fulfilled.
- `orderStatus`: find the values that mean cancelled, test or refunded in this project and write them into step 1 of the instructions by name (for example "status is not `cancelled` or `test`").
- `lineItems`: if order lines are not stored, remove the top-products section and say so.
- `currency`: ask whether the store sells in more than one currency. If it only sells in one, remove the multi-currency paragraph and write the currency into the instructions.
- If the user's orders live in Shopify and are not synced into the project, the digest cannot be built from project data. Say so; do not point the automation at an empty entity.

## Skills

Offer the `reporting-definitions` skill: it settles what "revenue" and "an order" mean for this store (gross or net, tax, shipping, refunds), so this digest agrees with every other report. If the project already has a skill with metric definitions, use it instead.

## Parameters

Ask for the channel (no default; list the Slack channels), the time zone (suggest the project's or the user's), the posting time and the anomaly threshold together. When the user changes the time, update the cron in the trigger, not only the parameter. Small stores with a handful of orders a day swing a lot: suggest a higher threshold (40–50%) when yesterday's order count is typically under 20.

## Notifications and policy

`notifyRule` is `always` because the digest is the point of the automation. The automation never writes data, so the mutation policy only matters if someone later edits it to make changes; keep `require_approval`.
