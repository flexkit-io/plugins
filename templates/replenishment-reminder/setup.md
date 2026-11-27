# Setting up the replenishment reminder

## Which products

Only products people use up and buy again belong here: coffee, tea, candles, skincare, filters, pet food. Clothes, bags and furniture do not. If the product entity has a field that marks consumables, map it. If not, list the product types or categories and ask which ones count, then name them in the instructions; offer to add a `consumable` boolean so the team can change it later without editing the automation.

If the store knows how long a product lasts (a 250 g bag is about 14 days for one person), map `usageDays`: it is better than a learned interval, especially for new products.

## Is there enough history?

Before finishing, check the order history: count, per consumable product, the repeat purchases of the last 18 months. Tell the user which products have enough (at least `minRepeatOrders`) and which do not. A store with fewer than a few hundred orders may have none yet: then suggest filling in `usageDays` for the main products, or waiting a few months.

## Which email plugin

Neither is required:
- **Klaviyo** is the better choice when the store uses it: Klaviyo checks consent and adds the unsubscribe link itself. The automation only sets a date and the product names on each customer's profile. The team builds one flow in Klaviyo, triggered by the date property `replenishment_due_date` (on the day), that sends the reminder using `replenishment_products` and `replenishment_product_urls`. Klaviyo's tools cannot create flows, so walk the user through it and tell them the first reminders only go out once the flow is live.
- **Resend** sends each approved email directly. Ask for the reply address (`replyTo`); Resend does not receive replies. The domain must be verified in Resend.
- **Neither**: the run lists who is due, so the team can try it first.

## Map the data

- `marketingConsent` is required. If the customer entity has no consent field, do not set up the template: explain that reminders are marketing email, which needs consent under GDPR, CAN-SPAM and CASL, and offer to add the field. Shopify's "accepts marketing" is the usual source.
- `orderLines` with product and quantity are required: the interval comes from them.
- `productUrl`: if only a handle is stored, ask for the store's base URL and put the pattern in the instructions.

## Parameters

Ask in one question for the lead time, the minimum repeat purchases, the daily limit, the reply address (with Resend) and the language. Suggest a lead time that covers delivery: if shipping takes 3 days, remind at least 5 days early.

## Mutation policy

Keep `require_approval` at first: each reminder reaches a real customer. With Klaviyo, the change is a profile property and Klaviyo's flow still checks consent, so a team that has watched a few weeks of approvals can switch to `auto_approve`.
