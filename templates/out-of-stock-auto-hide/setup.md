# Setting up out-of-stock auto-hide

## Map the data

- `stock`: the quantity customers buy from. With variants, map stock on the variant and point the trigger at the variant entity; hiding a whole product because one size sold out is rarely what a store wants. Ask if unsure. With stock per location, ask which total counts and say in step 1 that it is the sum.
- `availability`: find the field that decides whether customers can see or buy the product. It may be a boolean (`published`, `visible`), a status (`active` / `draft`), or an availability value (`in_stock` / `backorder`). Set `hiddenValue` to the value that hides it, or to the backorder value when `action` is "mark as backorder". Show the user the field and both values and confirm.
- `allowBackorder`: map it if the store keeps one, so pre-order and made-to-order products are left alone.
- If Shopify is the store and the project only mirrors its data, changing the project's field will not hide anything on the storefront. Say so, and suggest Shopify's own "continue selling when out of stock" setting instead.

## Trigger

Entity trigger on product (or variant) **update**. Updates arrive in small batches, so one run can cover several products; the instructions handle each one. The automation's own writes do not start it again (the platform skips them), but every other update to a product starts a run, which ends as skipped in seconds when stock did not cross zero.

## Mutation policy: auto-approve

This template ships with `auto_approve`, on purpose:
- Its value is speed. Hiding a sold-out product minutes later, after someone gets round to approving it, defeats the point, and approvals for every stock change pile up fast in a busy store.
- The change is narrow and reversible: one field, set to a value the user confirms at setup, and set back automatically. The instructions never write any other field and only restore what they hid.
- It is created paused. Suggest a test run on a product with stock 1 before switching it on.

Offer `require_approval` instead if the user prefers to watch it for the first week; say that sold-out products stay visible until each change is approved.

## Notifications and parameters

`notifyRule` is `failures`: routine hides are not news. Ask for the action, the hiding value (after showing the field) and the optional Slack channel in one question; list the Slack channels if Slack is connected.
