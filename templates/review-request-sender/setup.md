# Setting up the review request sender

## Where reviews are written

Reviews usually live in a reviews app (Judge.me, Yotpo, Okendo, Shopify Product Reviews) or on a platform such as Trustpilot or Google, not in Shopify itself. The automation does not need to read them: it only needs the link where a customer leaves one. Ask where the store collects reviews and how its review page is addressed:
- One page per product: map `reviewUrl`, or put the pattern in `reviewLink` (for example `https://northline.example/products/{handle}#reviews`).
- One page for the whole store (Trustpilot, Google): put it in `reviewLink`; the email then asks about the order, naming the products.

If the reviews app already sends its own review requests, say so: the customer would get two. Suggest turning one off, or not using this template.

## Map the data

- `deliveredAt`: the delivery date. Shopify has it on the order's fulfillments (`deliveredAt`) when the carrier reports delivery. When delivery is not tracked, use the ship date and add the usual delivery time to `daysAfterDelivery`, and tell the user.
- `orderStatus`: ask which values mean refunded, returned, being returned or cancelled.
- `openIssue`: map whatever records complaints or returns (a return entity, a support ticket, a tag on the order). Without one, the run can only skip refunded and returned orders; tell the user an unhappy customer who has not asked for a refund may still get a request.
- `marketingConsent` is required. If the customer entity has no consent field, do not set up the template: a review request is marketing email under GDPR, CAN-SPAM and CASL. Offer to add the field.

## Which email plugin

Neither is required:
- **Klaviyo** is the better choice when the store uses it: it checks consent and adds the unsubscribe link itself. The automation sets the request on each customer's profile; the team builds one flow in Klaviyo, triggered by the date property `review_request_date` (on the day), that sends the email with `review_request_products` and `review_request_urls`. Klaviyo's tools cannot create flows, so walk the user through it and say requests only go out once the flow is live.
- **Resend** sends each approved email directly. Ask for the reply address (`replyTo`); Resend does not receive replies. The domain must be verified in Resend.
- **Neither**: the run lists the due orders, so the team can try it first.

## Parameters

Ask in one question for the days after delivery, the review link, the products per request, the daily limit, the reply address (with Resend) and the language. Suggest more days for products that take time to judge (shoes, skincare: 14 to 21) and fewer for simple ones.

## Mutation policy

Keep `require_approval` at first: each request reaches a real customer. With Klaviyo, the change is a profile property and the flow still checks consent, so after a few weeks the team can switch to `auto_approve`.
