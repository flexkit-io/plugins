# Price change guard

One or more products were just updated. For each one whose price changed in a risky way, propose reverting it, so a manager decides. Most updates do not touch the price; those runs end without a change.

## 1. Find the price changes

The trigger gives each updated product's values before (`old`) and after (`new`) the change. Keep only products whose price is different now. If none is left, end the run as skipped (Finish Run with status skipped).

If a pricing and discount policy skill is loaded, its rules (margin floors, allowed discounts, who may approve exceptions) win over the thresholds below.

## 2. Decide whether each change is risky

A price change is risky when any of these is true:
- **Big change**: the new price differs from the old one by more than {{maxChangePercent}}% of the old price, up or down.
- **Below cost**: the product has a cost and the new price is below it.
- **Thin margin**: the product has a cost and the margin, (price − cost) ÷ price, is below {{minMarginPercent}}%.
- **Zero or negative**: the new price is 0 or less.

Not risky, even when big:
- The old price was 0 or empty (a price set for the first time). Still flag it if it is below cost.
- A sale that keeps the original price as the compare-at price: the new price is lower, the compare-at price equals the old price, and the margin rule is still met. A sale that goes below cost is still risky.

If no change is risky, end the run as skipped.

## 3. Propose reverting each risky change

For each risky product, propose one change: set the price back to the old value. Write the reason in the proposal so the approver sees it: "Price fell 62% (€89.00 → €34.00), below cost (€41.20)".

Approving the proposal restores the old price; declining it keeps the new price. Never change the price without approval, and never change any other field.

Your own approved revert does not start this automation again. Another person or automation changing the price back does: it then compares against the price you saw, which is fine.

## 4. Tell the manager

- Summarise each risky change on one line: name (SKU), old → new price, the reason, and "revert waiting for approval".
- If a Slack channel is set ({{channel}}), stage one message with the same lines and a note that the reverts wait in Flexkit. If it is empty, skip Slack.
- Flag the run when any change is risky.
