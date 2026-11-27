# Stuck order chaser

Find the paid orders that are late before their customers have to ask, tell the team in {{channel}}, and draft an honest delay email for each one. Report each delay once: an order already reported for the same reason is not news.

## 1. Find the stuck orders

Read orders placed in the last 60 days that are paid and not cancelled, refunded or delivered. Leave out test orders, orders for pickup in store, and orders marked as pre-orders or made to order (their dates are known to be later).

An order is **stuck** when one of these is true:
- **Not shipped**: nothing has shipped {{unshippedDays}} or more days after it was paid. A partly shipped order is stuck when its remaining items pass the same limit.
- **Tracking stalled**: it has shipped, is not delivered, and its tracking has had no new event for {{stalledDays}} or more days. Use the time of the latest carrier tracking event; when the order has no tracking events at all, use the date it shipped.
- **Delivery problem**: the carrier reported a failed delivery or a problem (failure, attempted delivery, returned to sender) and nothing has happened since.

For each stuck order, note why (not shipped, tracking stalled, delivery problem), how many days it has been, the items still missing, and the carrier with its latest event when there is one.

## 2. Remember what was reported

Use your automation memory, keyed by order id and reason. An order is **newly stuck** when it was not stuck for the same reason on the previous run. When an order ships, is delivered or is cancelled, forget it, so a new problem later is reported again.

If no order is newly stuck, and no order has been stuck for twice its limit (still unresolved and worth repeating once), end the run as skipped (Finish Run with status skipped) so nothing is posted.

## 3. Post to Slack

Stage one message for {{channel}}:

- First line: how many orders are stuck and how many are new today, e.g. "6 orders are stuck, 2 new today".
- Then one line per order, oldest first: order number, customer first name, reason, days, and what is missing or the latest tracking event. Mark orders stuck for twice their limit as **overdue**.
- Keep it under 15 lines; with more, list the 15 oldest and say how many more there are.

Flag the run when any order is overdue or has a delivery problem.

## 4. Draft delay emails (only when drafting is on: {{draftCustomerEmails}})

Skip this step when drafting is off or Resend is not connected. Draft only for **newly stuck** orders, one email per order, never a second email for the same order and reason.

Write in {{language}}. When a customer communication skill is loaded, follow it.

- **Subject**: "An update on your order" followed by the order number.
- **Body**, three to five short sentences: greet the customer by first name when known; say plainly that the order is taking longer than it should and what you know (not shipped yet, or the carrier has not updated the tracking since a date); say what the store is doing about it; give the tracking link when there is one; apologise once.
- Never promise a delivery date the store does not know, never blame the customer, and never offer a refund or discount unless the team adds one.
- End with where to reply: {{replyTo}}. The email goes out from Resend, which does not receive replies, so this address must be in the email. If it is empty, flag the run and leave the emails out until the team sets one.

Propose each email for approval and never send one directly. After an email is sent, record the order id, reason and date in your memory.

## 5. Report

Summarise how many orders are stuck by reason, how many are new, how many emails are waiting for approval, and any order you could not check (for example a shipment without a carrier).
