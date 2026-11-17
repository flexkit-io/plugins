---
name: paypal-payments
description: Create and send PayPal invoices, refund payments, add shipment tracking, manage subscriptions and products, and review disputes, transactions and sales in a connected PayPal business account. Use whenever the user wants to bill a customer, refund an order, answer a dispute, check what was paid, or report on PayPal sales.
---

# Working with PayPal

The PayPal tools act on the connected business account, in the live PayPal environment. Invoices go to real customers, refunds return real money, and accepted dispute claims cannot be undone. Look up the exact tool names and parameters in the tool list; do not assume a tool exists.

## Before money moves or a customer is contacted

Refunding a payment, capturing (paying) an order, accepting a dispute claim, sending an invoice or a reminder, cancelling a sent invoice, and creating, changing or cancelling a subscription all affect a customer or the account's money.

1. **Read first:** fetch the payment, order, invoice, dispute or subscription, and check that it is the one the user means (customer, amount, date, status).
2. **State exactly what will happen:** the action, the amount and currency, the customer, and the PayPal id. For a refund, say whether it is full or partial; a refund without an amount refunds the full captured payment. For a subscription change, say what the customer will be charged next and when.
3. **Avoid doing it twice:** check for an existing refund on the capture, an earlier invoice for the same customer and items, or a subscription the customer already has, before you create another. If a call fails or times out, look up the result before you retry.
4. **Never guess amounts or currencies.** Use the values from PayPal or from the Flexkit records, and ask when they disagree or are missing. Keep the payment's own currency.

For several refunds, invoices or changes at once, list them all with their totals and go ahead only after the user agrees.

## Invoices

- Create the invoice as a draft, show the customer, line items, taxes, total and due date, and send it only when the user asks for it to be sent.
- Use the customer's email and name from the Flexkit record when there is one, and say which record you used.
- A reminder emails the customer again; do not send one for an invoice that is paid or was sent very recently unless the user asks.

## Disputes

- Summarize the dispute first: the reason, the amount, the buyer's claim, the deadline, and what PayPal needs.
- Accepting a claim gives the buyer the disputed amount back and closes the dispute. Explain this and confirm before accepting. When the user wants to contest a dispute, gather the evidence (order, shipment tracking, messages) from Flexkit and tell them which steps must be done in PayPal itself.

## Shipment tracking

Add tracking to the PayPal transaction when an order ships: it helps the seller in "item not received" disputes. Use the carrier and tracking number from the Flexkit order or shipment record, and check for existing tracking before you add more.

## Reporting

For questions about sales, payments or fees, list transactions with a date range (the default is only the last 31 days) and summarize: totals by currency, counts, refunds, fees, and anything unusual. Use the merchant insights tool for order and sales trends. Do not paste long transaction lists; summarize and offer an export.

## Linking Flexkit and PayPal

When a PayPal invoice, payment, refund or dispute concerns Flexkit records (an order, a customer, a product), name the records and include their Flexkit links when you have them. If the project's schema has a field for a PayPal id or status, offer to save it on the record afterwards; that change follows the project's own approval rules.
