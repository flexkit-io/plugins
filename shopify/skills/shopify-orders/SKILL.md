---
name: shopify-orders
description: Find, inspect and act on Shopify orders with the Admin API tools - order lookups and reports, fulfillment with tracking, refunds and cancellations, draft orders and invoices, order edits, returns, tags and notes. Load after shopify-admin for any order task.
---

# Orders

Load `shopify-admin` first for IDs, pagination, search syntax, cost and mutation rules.

## Finding orders

- By number: `orders(first: 1, query: "name:#1001")`. By customer: `query: "email:jane@example.com"` or `customer_id:1234567890`. By state and time: `query: "financial_status:unpaid created_at:>=2026-10-01"`, `"fulfillment_status:unfulfilled"`, `"tag:priority"`, `"status:open"`.
- Sort with `sortKey: CREATED_AT | UPDATED_AT | PROCESSED_AT | TOTAL_PRICE | ORDER_NUMBER | CUSTOMER_NAME | FINANCIAL_STATUS | FULFILLMENT_STATUS` and `reverse: true` for newest first.
- Orders older than 60 days need the `read_all_orders` scope on the connected app.

Useful order fields: `id name createdAt processedAt displayFinancialStatus displayFulfillmentStatus returnStatus confirmed test cancelledAt closedAt tags note poNumber email customer { id displayName defaultEmailAddress { emailAddress } } shippingAddress { name address1 city provinceCode zip countryCode } totalPriceSet { shopMoney { amount currencyCode } } subtotalPriceSet totalShippingPriceSet totalTaxSet totalDiscountsSet totalRefundedSet totalOutstandingSet discountCodes paymentGatewayNames risk { assessments { riskLevel } }`.

Line items: `lineItems(first: 50) { edges { node { id title variantTitle sku quantity unfulfilledQuantity refundableQuantity originalUnitPriceSet { shopMoney { amount currencyCode } } discountedTotalSet { shopMoney { amount } } variant { id } product { id } } } }`.

Financial statuses: `PENDING AUTHORIZED PARTIALLY_PAID PAID PARTIALLY_REFUNDED REFUNDED VOIDED EXPIRED`. Fulfillment statuses: `UNFULFILLED PARTIALLY_FULFILLED FULFILLED IN_PROGRESS ON_HOLD SCHEDULED PENDING_FULFILLMENT RESTOCKED REQUEST_DECLINED FULFILLMENT_NOT_REQUIRED`.

## Reports

Count before you list: `ordersCount(query: "created_at:>=2026-10-01 financial_status:paid") { count precision }`. For revenue over a period, page `orders` with the `query:` filter and sum `currentTotalPriceSet` (what the customer owes after edits and refunds) or `totalReceivedSet`; say which you used, and exclude `test: true` orders. For thousands of orders use a bulk operation. Shopify's own reports (Analytics) remain the source of truth for financial reporting; present your numbers as a calculation from order data.

## Fulfilling an order

Fulfillment goes through fulfillment orders, not line items:

1. Read them: `order(id: $id) { fulfillmentOrders(first: 10) { edges { node { id status requestStatus assignedLocation { name location { id } } supportedActions { action } lineItems(first: 50) { edges { node { id remainingQuantity totalQuantity sku productTitle variantTitle } } } } } } }`. Only fulfillment orders with status `OPEN` or `IN_PROGRESS` can be fulfilled.
2. `fulfillmentCreate(fulfillment: { lineItemsByFulfillmentOrder: [{ fulfillmentOrderId: $foId, fulfillmentOrderLineItems: [{ id: $foLineItemId, quantity: 2 }] }], trackingInfo: { company: "UPS", number: "1Z…", url: "https://…" }, notifyCustomer: true }) { fulfillment { id status trackingInfo { company number url } } userErrors { field message } }`. Leave `fulfillmentOrderLineItems` out to fulfil everything remaining on that fulfillment order.
3. Update tracking later with `fulfillmentTrackingInfoUpdate(fulfillmentId:, trackingInfoInput: { company number url }, notifyCustomer:)`. Hold or move fulfillment orders with `fulfillmentOrderHold`, `fulfillmentOrderReleaseHold`, `fulfillmentOrderMove(id:, newLocationId:)`.

Existing fulfillments: `order { fulfillments(first: 10) { id status displayStatus createdAt trackingInfo { company number url } } }`.

## Refunds

1. Let Shopify calculate it: `order(id: $id) { suggestedRefund(refundLineItems: [{ lineItemId: $lineItemId, quantity: 1 }], refundShipping: true) { amountSet { shopMoney { amount currencyCode } } maximumRefundableSet { shopMoney { amount } } shipping { amountSet { shopMoney { amount } } } suggestedTransactions { gateway kind amountSet { shopMoney { amount currencyCode } } parentTransaction { id } } } }`. Show the user the amount before refunding.
2. `refundCreate(input: { orderId: $id, note: "…", notify: true, refundLineItems: [{ lineItemId: $lineItemId, quantity: 1, restockType: RETURN, locationId: $locationId }], shipping: { fullRefund: true }, transactions: [{ orderId: $id, gateway: $gateway, kind: REFUND, amount: $amount, parentId: $parentTransactionId }] }) { refund { id totalRefundedSet { shopMoney { amount currencyCode } } } userErrors { field message } }`. Copy `gateway`, `amount` and `parentTransaction.id` from the suggested transactions; without `transactions` the refund restocks or adjusts without returning money.
3. Previous refunds: `order { refunds { id createdAt note totalRefundedSet { shopMoney { amount } } } transactions { id kind status gateway amountSet { shopMoney { amount } } createdAt } }`.

## Cancelling

`orderCancel(orderId: $id, reason: CUSTOMER, refundMethod: { originalPaymentMethodsRefund: true }, restock: true, notifyCustomer: true, staffNote: "…") { job { id done } orderCancelUserErrors { field message code } userErrors { field message } }`. Reasons: `CUSTOMER DECLINED FRAUD INVENTORY STAFF OTHER`. Cancelling is asynchronous: re-read `cancelledAt` and `displayFinancialStatus` after the job is done. Only unfulfilled (or fully refunded) orders can be cancelled; otherwise refund or return instead. `orderClose` / `orderOpen` archive and unarchive without refunding.

## Draft orders and invoices

- Create: `draftOrderCreate(input: { customerId: $customerId, email: "…", lineItems: [{ variantId: $variantId, quantity: 2 }, { title: "Custom item", originalUnitPriceWithCurrency: { amount: "10.00", currencyCode: USD }, quantity: 1 }], shippingAddress: { … }, useCustomerDefaultAddress: true, note: "…", tags: [], appliedDiscount: { valueType: PERCENTAGE, value: 10, title: "Loyalty" } }) { draftOrder { id name invoiceUrl totalPriceSet { shopMoney { amount currencyCode } } } userErrors { field message } }`.
- Send the invoice: `draftOrderInvoiceSend(id:, email: { to:, subject:, customMessage: })`. Turn it into an order once paid or to mark as paid: `draftOrderComplete(id:, paymentGatewayId:)`. Edit with `draftOrderUpdate(id:, input:)`, remove with `draftOrderDelete(input: { id })`.
- `orderCreate(order: { … }, options: { sendReceipt: false, inventoryBehaviour: DECREMENT_OBEYING_POLICY })` creates a finished order directly (imports, POS-like sales); prefer draft orders when the customer still has to pay.

## Editing a placed order

`orderEditBegin(id: $orderId) { calculatedOrder { id } userErrors { field message } }` → `orderEditAddVariant(id: $calculatedOrderId, variantId:, quantity:)`, `orderEditSetQuantity(id:, lineItemId: $calculatedLineItemId, quantity:, restock: true)`, `orderEditAddCustomItem`, `orderEditAddLineItemDiscount` → `orderEditCommit(id: $calculatedOrderId, notifyCustomer: true, staffNote: "…") { order { id } userErrors { field message } }`. Nothing changes until the commit; the calculated order shows the new totals before you commit.

## Returns

`returnCreate(returnInput: { orderId: $id, returnLineItems: [{ fulfillmentLineItemId: $fulfillmentLineItemId, quantity: 1, returnReasonDefinitionId: $reasonId, returnReasonNote: "…" }], notifyCustomer: true }) { return { id status } userErrors { field message } }` starts a return for fulfilled items (get `fulfillmentLineItemId` from `fulfillments { fulfillmentLineItems(first:) { edges { node { id lineItem { id title } quantity } } } }`). Then `returnProcess` / `returnRefund` to restock and refund, `returnClose`, `returnCancel`. Customer-requested returns arrive with status `REQUESTED` and are answered with `returnApproveRequest` / `returnDeclineRequest`.

## Tags, notes and attributes

`tagsAdd(id: $orderId, tags: ["priority"])`, `tagsRemove`, `orderUpdate(input: { id: $orderId, note: "…", email: "…", shippingAddress: { … }, customAttributes: [{ key: "gift_message", value: "…" }] })`. `orderUpdate` cannot change line items, prices or statuses; use order edits, refunds or cancellation for those.
