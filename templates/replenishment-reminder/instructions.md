# Replenishment reminder

Remind customers to reorder a product they use up, a few days before they are likely to run out. One reminder per purchase, only to customers who accept marketing email, and never after they have already reordered.

## 1. Learn each product's interval

Do this for the products marked as consumable (or the products named in these instructions at setup). Relearn once a week, not every run; keep the results in your automation memory with the date.

- When the product has its own usage time (how many days one unit lasts), use it as the interval.
- Otherwise learn it from paid orders of the last 18 months: for each customer who bought the product more than once, take the days between one purchase and the next, divided by the quantity of the earlier purchase. The product's interval is the **median** of those gaps. Ignore gaps under 7 days (top-ups and gifts) and over 365 days.
- Trust a learned interval only when it rests on at least {{minRepeatOrders}} repeat purchases. A product with fewer has no interval yet: leave it out and list it in the weekly summary.

## 2. Find the customers who are due

For each purchase of a product with an interval, the customer **runs out** on the purchase date plus the interval times the quantity. A purchase is **due** for a reminder when today is {{leadDays}} days before that date or later, but not more than 7 days after it. All of these must also be true:
- The customer accepts marketing email. A customer with no consent value, or who unsubscribed, is never reminded. This rule has no exceptions.
- The customer has not bought the same product since that purchase, and has no open order containing it.
- The purchase was paid and not refunded, returned or cancelled.
- The customer has not been reminded about this purchase before (check your memory, keyed by order id and product id) and has had no replenishment reminder for any product in the last 14 days.
- The account is not a test, staff, wholesale or blocked account.

Group the due products per customer, so a customer gets one reminder covering everything they are running out of. Take the earliest run-out dates first, up to {{dailyLimit}} customers. If nobody is due, end the run as skipped (Finish Run with status skipped).

## 3. Remind them

**With Klaviyo connected**, the email is sent by the team's Klaviyo flow, which handles consent and unsubscribes:
- For each customer, find their Klaviyo profile by email. If there is none, or the profile is not subscribed to email marketing, skip the customer and count them in the summary; never subscribe anyone.
- Propose updating the profile's properties: `replenishment_due_date` (the run-out date), `replenishment_products` (the product names) and `replenishment_product_urls` (their links). The team's flow, triggered by that date, sends the email.

**With Resend and no Klaviyo**, draft one short email per customer and propose it for approval:
- Write in {{language}}; follow a brand voice skill when it is loaded.
- **Subject**: name the product, e.g. "Running low on Kiln Roast coffee?". No fake urgency.
- **Body**: two to four sentences. Greet them by first name when known, say it has been about the usual time since their last order of the product, and give a direct link to each product. Do not mention exact order dates, quantities or anything that reads as tracking them.
- End with where to reply: {{replyTo}}, and a line saying they can unsubscribe by replying. If the reply address is empty, flag the run and draft nothing.

**With neither**, put the due customers and their products in the run summary.

After a profile is updated or an email is sent, record the customer, order and product ids with the date in your memory.

## 4. Report

Summarise how many customers were due, how many were reminded, how many were skipped for consent or a missing Klaviyo profile, and how many wait for tomorrow because of the limit. Once a week, add the learned interval per product and the products that do not have enough repeat orders yet. Flag the run when reminders are waiting for approval.
