# Setting up the stuck order chaser

## Where the orders are

- **Shopify connected**: read the orders from the Shopify plugin. Load its `shopify-orders` skill first. Use `displayFinancialStatus` for payment and `displayFulfillmentStatus` for shipping, and each order's `fulfillments` for what shipped: `createdAt`, `displayStatus` (for example IN_TRANSIT, FAILURE, ATTEMPTED_DELIVERY, DELIVERED), `inTransitAt`, `deliveredAt`, `trackingInfo` and the fulfillment's `events`, which hold the carrier updates with their `happenedAt` time. Check the exact field names with Shopify's `search_schema` before writing them into the instructions.
- **No Shopify**: map the project's own order fields below.

Ask which applies when both exist, and use one source only.

## Tracking events are not always there

Shopify only has carrier events when the store's carrier or shipping app reports them back (Shopify does this for many common carriers). Check a few recently shipped orders:
- If they have tracking events, keep the "tracking stalled" and "delivery problem" checks.
- If they have tracking numbers but no events, the "tracking stalled" check can only count days since shipping, which flags every slow-but-fine delivery. Suggest raising `stalledDays` to the carrier's usual delivery time plus a few days, or removing that check, and tell the user why.
- Project orders without Shopify rarely have tracking events: keep only the "not shipped" check unless the schema has a tracking status and its update date.

## Map the data

- `paymentStatus` and `fulfillmentStatus`: ask which values mean paid, unshipped, partly shipped, shipped and delivered, and write them into the instructions.
- `shippedAt`: needed for the "tracking stalled" check without carrier events.
- `customerEmail`: needed only for the delay emails. Without it, turn `draftCustomerEmails` off.
- Ask whether the store has pre-orders or made-to-order products, and how to recognise them (a tag, a product type), so they are not reported every day.

## Emails and replies

The delay email is a service message about the customer's own order, so it does not need marketing consent. Resend only sends: customer replies never reach Flexkit. Ask for the address replies should go to and put it in `replyTo`; without one, keep drafting off. The sending domain must be verified in Resend.

## Parameters

The channel has no default: list the Slack channels and ask. Ask for the days limits, drafting and the reply address in the same question. Suggest `unshippedDays` from the store's promised dispatch time (for example 2 working days becomes 3).

## Mutation policy

Keep `require_approval`: every email goes to a real customer who is already waiting. The Slack list is delivery, not a mutation, and is not held for approval.
