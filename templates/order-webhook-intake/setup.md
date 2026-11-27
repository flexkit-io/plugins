# Setting up order webhook intake

## Map the data

- Order and Customer entities are required, with an order number (unique per order), a total and a link from order to customer. Search the schema for them; they may be called Purchase, Sale, Client or Contact.
- If there is no Customer entity, offer to propose one (email, name, phone, default address) before continuing, or to store the email on the order only and drop step 2.
- `reviewFlag`: if the order has no field for a review reason or a "needs review" boolean, the flags still appear in the run summary and Slack. Offer a schema change only if the user wants flags kept on the record.
- Line items may be a nested list on the order or a separate OrderLine entity. Write the real shape into step 3.

## Connecting the source

The trigger is a webhook. After the automation is created, give the user its URL and secret and tell them where to paste it:
- **Shopify**: Settings → Notifications → Webhooks, event "Order creation" (and "Order update" to keep statuses in sync), format JSON. If the Shopify plugin is connected, mention that the agent can also look orders up directly, but the webhook is what keeps records current.
- **Stripe Checkout / other checkouts**: an endpoint for the "checkout completed" event.
- Anything else that can POST JSON on a new order.

Ask the user to send a test order once the automation is enabled, and offer a test run with a sample payload first.

## Why changes need approval

The template ships with `require_approval`, and you should keep it at setup. Every webhook writes customer data: a malformed payload, a duplicate delivery or a payload crafted by someone who found the URL could create or overwrite real customers. Approval also catches mapping mistakes in the first days, which are the most likely failure. Suggest switching to auto-approve only once the user has approved a week or two of webhooks without corrections, and only if the webhook has a secret set. Even then, flagged orders should still be checked by a person.

## Parameters

Ask for the high-value amount in the store's main currency (suggest roughly 4–5× the store's average order value if you can read it from existing orders), whether to fill in missing customer details, and the Slack channel. The channel is optional: without Slack, flags stay on the run and the order.
