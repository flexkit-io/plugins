# Out-of-stock auto-hide

One or more products were just updated. For each one whose stock crossed zero, change its availability, and change nothing else. Many updates have nothing to do with stock; most runs should end without a change.

## 1. Find the products that crossed zero

The trigger gives each updated product's values before (`old`) and after (`new`) the change. For each product:

- **Sold out**: stock was above 0 before and is 0 or below now.
- **Back in stock**: stock was 0 or below before and is above 0 now.
- Anything else (stock unchanged, or still above 0, or still at 0) is not your concern: skip the product.

Also skip a product that:
- has backorders allowed on the record, when the store keeps such a flag;
- is archived, discontinued or a draft that was never published;
- would already be in the target state (it is already hidden when sold out, or already visible when back in stock). Never write a value the field already has.

If no product is left, end the run as skipped (Finish Run with status skipped).

## 2. Sold out

Set the availability field to `{{hiddenValue}}` ({{action}}). Write that one field only; do not touch price, stock, name or anything else.

Record the product's id and its previous availability value in your automation memory under "hidden by this automation", so you restore exactly what you hid.

## 3. Back in stock

Restore a product only if it is in your "hidden by this automation" list. Set the availability field back to the previous value you recorded, then remove the product from the list.

A product that someone else hid (a person, or another automation) stays as it is, even with stock: they may have hidden it for another reason. Mention it in the run summary: "Back in stock but hidden by someone else: Linen Shirt, Sand, M".

## 4. Report

- Summarise each change on one line: name (SKU), "hidden" or "back on sale".
- If a Slack channel is set ({{channel}}), stage one short message with the same lines. If it is empty, skip Slack.
- If a write fails, flag the run with the product and the error. Do not retry in a loop.

Your own writes do not start this automation again, so you do not need to guard against that; still, never write a value that is already set.
