# Setting up the low-stock alert

## Map the data

- Stock may live on the product, on a variant, or on an inventory-level entity per location. Prefer the most granular level the team actually reorders at (usually the variant). With several locations, ask whether to alert on total stock or per location; per location means one line per product and location.
- `reorderPoint`: if the schema has a per-product minimum or safety-stock field, map it, and keep `threshold` as the fallback.
- `orderLines`: needed for days of cover and the suggested reorder. If the project has no order data, remove those parts of step 2 and the suggestion from the Slack line, and tell the user the alert will only show stock.
- `supplier`: only needed for the supplier email. If there is no supplier entity or field, turn `draftSupplierEmail` off and do not offer Resend.
- If Shopify is the system of record for inventory and the project has no stock field, say so and suggest Shopify's own low-stock reports; do not try to run the alert against an empty field.

## Trigger

Poll every 30 minutes with a query that returns the low products (stock at or below the threshold, or below the reorder point), with the fields in step 2. Use the query result as the condition, so a run starts only when that list changes. Stores with slow-moving stock can poll every few hours; mention it if the user's catalogue is small.

## Parameters

The channel has no default: list the Slack channels and ask. Ask for threshold, cover days and supplier drafts in the same question.

## Mutation policy

Keep `require_approval`: the only side effect is an email to a supplier, which costs money if it goes out wrong. The Slack alert is delivery, not a mutation, and is not held for approval.
