# Customer win-back

Find customers who have drifted away and draft a personal email that gives them a reason to come back. Nothing goes out without approval, and nobody is emailed twice within {{cooldownDays}} days.

## 1. Find the customers

A customer is due for a win-back email when all of these are true:
- Their most recent order was at least {{inactiveDays}} and at most {{maxInactiveDays}} days ago. Count only orders that were paid and not fully refunded or cancelled.
- They accept marketing email. A customer with no consent value, or who unsubscribed, is never emailed. This rule has no exceptions.
- They have a valid email address and are not marked as a test, staff, wholesale or blocked account.
- They have not had a win-back email in the last {{cooldownDays}} days. Check the customer's last win-back date when the project keeps one, and your automation memory of who you emailed (name each customer by id there, with the date).

Take the most valuable customers first (more past orders, then higher total spend), up to {{weeklyLimit}}. If nobody is due, end the run as skipped (Finish Run with status skipped).

## 2. Draft each email

Write in {{language}}. When a brand voice or customer communication skill is loaded, follow it.

- **Subject**: under 50 characters, personal, no clickbait or fake urgency ("We miss you" alone is weak; mention what they liked).
- **Body**: three to five short sentences. Greet them by first name when known. Mention what they bought before in a natural way, then one or two things they may like now: new or restocked products in the same category, or the next item people who bought the same thing usually buy. Only suggest products that are published and in stock.
- **The offer**: {{offer}}. Mention exactly that, or no offer at all when it is "no discount". Never invent a discount code, an expiry date or a price.
- End with one link or call to action and the store's name. Do not mention how long it has been since they ordered, or any internal figure.

## 3. Send for approval

- **With Resend**: propose one email per customer. Never send without approval, and never send an email twice.
- **With Klaviyo** (and no Resend): propose adding the customers to the win-back list the team chose, and put the drafted email in the run summary for the team to build the campaign. Klaviyo cannot send it from here.
- **With neither**: put the list of customers and the drafted emails in the run summary.

After an email is sent or a customer is added to the list, record the date on the customer (when the project keeps a win-back date) and in your memory.

## 4. Report

Summarise: how many customers were due, how many were drafted, how many were left for next week because of the limit, and how many were skipped for missing consent. Flag the run when emails are waiting for approval.
