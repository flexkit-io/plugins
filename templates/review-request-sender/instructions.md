# Review request sender

Ask happy customers for a review once they have had time to use what they bought. One request per order, only to customers who accept marketing email, and never to someone who is waiting on a complaint, return or refund.

## 1. Find the orders that are due

An order is **due** when all of these are true:
- It was delivered between {{daysAfterDelivery}} and {{daysAfterDelivery}} + 7 days ago. Orders older than that are left alone; a late request feels odd.
- It was paid and is not refunded, partly refunded, returned, being returned or cancelled.
- Neither the order nor the customer has an open complaint, support ticket or return. When unsure, skip the order.
- The customer accepts marketing email. A customer with no consent value, or who unsubscribed, is never asked. This rule has no exceptions.
- The order has not been asked about before (check your automation memory, keyed by order id), and the customer has had no review request in the last 30 days.
- The account is not a test, staff, wholesale or blocked account.

Take the oldest deliveries first, up to {{dailyLimit}} orders. If nothing is due, end the run as skipped (Finish Run with status skipped).

## 2. Pick the products to ask about

For each order, ask about at most {{productsPerRequest}} products: the most expensive first, then those with the fewest reviews when the project keeps review counts. Leave out gift cards, shipping protection, samples and anything marked as not reviewable. Each product gets its own link: its review URL when it has one, otherwise {{reviewLink}} with the product filled in. If neither exists, skip the product; an order left with no products is skipped.

## 3. Ask

Never offer anything in return for a review, and never ask for a positive one: incentivised or steered reviews break the rules of most review platforms and consumer law in many countries.

**With Klaviyo connected**, the email is sent by the team's Klaviyo flow, which handles consent and unsubscribes:
- Find the customer's Klaviyo profile by email. If there is none, or it is not subscribed to email marketing, skip the order and count it in the summary; never subscribe anyone.
- Propose updating the profile's properties: `review_request_date` (today), `review_request_order` (the order number), `review_request_products` (the product names) and `review_request_urls` (their review links). The team's flow, triggered by that date, sends the email.

**With Resend and no Klaviyo**, draft one short email per order and propose it for approval:
- Write in {{language}}; follow a brand voice skill when it is loaded.
- **Subject**: name the product, e.g. "How is your Waxed Canvas Tote?".
- **Body**: two to four sentences. Greet them by first name when known, ask how the product is working out, and give the review link for each product. Say a short review helps other customers decide. If something is wrong, invite them to reply instead, so the team can help.
- End with where to reply: {{replyTo}}, and a line saying they can stop these emails by replying. If the reply address is empty, flag the run and draft nothing.

**With neither**, put the due orders and their links in the run summary.

After a profile is updated or an email is sent, record the order id, customer id and date in your memory.

## 4. Report

Summarise how many orders were due, how many requests were made, and how many were skipped and why (consent, open issue, no review link, no Klaviyo profile, the daily limit). Flag the run when requests are waiting for approval.
