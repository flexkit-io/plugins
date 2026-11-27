# Setting up the price change guard

## Map the data

- `price` is required. With variants priced separately, map the variant price and point the trigger at the variant entity.
- `cost`: map it if the store keeps a cost or purchase price. Without it, the below-cost and margin checks cannot run: remove them from step 2, set `minMarginPercent` aside, and tell the user the guard will only catch big changes.
- `compareAtPrice`: map it if the store shows sale prices this way; it keeps planned sales from being flagged. Without it, remove the sale exception from step 2 and suggest a higher `maxChangePercent` during sale periods.
- Multiple currencies or price lists: ask which price matters and name it in step 1.

## Trigger

Entity trigger on product (or variant) **update**. Updates arrive in small batches, so one run can cover several products. A bulk price update (for example a sale applied to 300 products) starts runs for all of them; if the user runs big sales this way, suggest pausing the guard during the sale, or raising the threshold, and say so plainly.

## Skills

Offer `pricing-discount-policy`: it holds the store's margin floors and discount rules, so the guard checks prices the same way the team does. If the user sets it up, the thresholds stay as a fallback.

## Mutation policy

Keep `require_approval`: the guard's only action is a proposed revert, and approving it is the manager's decision. Auto-approve would undo every big price change automatically, including intended ones.

## Parameters

Ask for the change threshold, the minimum margin (suggest the store's real floor if a pricing skill or the user states one; 0 means only below-cost prices) and the optional Slack channel in one question. List the Slack channels if Slack is connected.
