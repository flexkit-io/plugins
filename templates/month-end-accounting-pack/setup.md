# Setting up the month-end accounting pack

## Map the data

- Order number, date and total are required. Tax, shipping and country make it an accounting pack rather than a sales export; map them whenever the schema has them, and if tax is not stored, say the pack will not show tax by country and the accountant will have to work it out.
- Refunds may be their own entity, or amounts on the order with a refund date. Map whichever exists; with only a refunded amount and no date, refunds are counted in the month of the order, and say so.
- With more than one currency, map `currency`; the pack never adds currencies together.
- If orders live only in Shopify and not in the project, say this template needs the orders in Flexkit, and suggest syncing them first.

## Payouts

Shopify payouts need the Shopify connection's access to Shopify Payments payouts, which a store's custom app may not have granted. Try one payouts query during setup; if it is refused, tell the user which access to add in the Shopify app, or leave payouts out. PayPal is only useful if the store takes PayPal.

## The email

- Ask for the accountant's address and a reply-to address (usually the owner's own inbox; Resend only sends, and replies go to the reply-to address).
- Resend must have a verified sending domain. If it has none, keep the email off and let the team download the files from the run.
- The links are permanent and anyone with a link can open the file. Say so: the files hold sales and customer countries, not customer names, but the email should only go to the accountant. Do not add customer names or emails to the exports.

## Parameters

Ask in one question: the schedule and time zone (06:00 on the 1st), the store name, the accountant's email (optional) and the reply-to address.

## Mutation policy

Keep `require_approval`: the email goes outside the company, and the owner should see the numbers before the accountant does.

## First run

Offer a test run with the accountant's email left out, so the user can check last month's pack before anything is sent.
