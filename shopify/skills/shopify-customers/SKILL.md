---
name: shopify-customers
description: Look up, segment and update Shopify customers with the Admin API tools - profiles, order history and spend, segments, tags and notes, addresses, marketing consent, merges and deletion. Load after shopify-admin for any customer or CRM task.
---

# Customers

Load `shopify-admin` first for IDs, pagination, search syntax, cost and mutation rules.

Customer records are personal data. Read only the fields the task needs, do not list emails, phone numbers or addresses the user did not ask for, and never export the whole customer base without being asked for exactly that. Stores without protected customer data access get `REDACTED` values; say so instead of guessing. Requests to erase a customer's data for privacy regulations are handled by the merchant in the Shopify admin, not with these tools.

## Finding customers

- `customers(first: 50, query: "email:jane@example.com", sortKey: UPDATED_AT, reverse: true) { edges { node { id displayName firstName lastName state numberOfOrders amountSpent { amount currencyCode } tags note createdAt verifiedEmail defaultEmailAddress { emailAddress marketingState } defaultPhoneNumber { phoneNumber smsMarketingConsent { state } } defaultAddress { city provinceCode countryCode } } } pageInfo { hasNextPage endCursor } }`. Filters: `email:`, `phone:`, `first_name:`, `last_name:`, `tag:`, `country:`, `state:ENABLED|DISABLED|INVITED|DECLINED`, `orders_count:>5`, `total_spent:>500`, `created_at:>=2026-01-01`, `last_order_date:`, `accepts_marketing:true`.
- Exact match: `customerByIdentifier(identifier: { emailAddress: "…" })` (also `phoneNumber`, `customerId`). Counts: `customersCount(query:) { count }`.
- Use `defaultEmailAddress { emailAddress }` and `defaultPhoneNumber { phoneNumber }`: the plain `email`, `phone`, `emailMarketingConsent` and `smsMarketingConsent` fields are deprecated.
- Sort keys: `NAME CREATED_AT UPDATED_AT LOCATION ID`.

## A customer's history

`customer(id: $id) { displayName numberOfOrders amountSpent { amount currencyCode } lifetimeDuration orders(first: 10, sortKey: CREATED_AT, reverse: true) { edges { node { id name createdAt displayFinancialStatus displayFulfillmentStatus totalPriceSet { shopMoney { amount currencyCode } } } } } addresses(first: 5) { address1 city provinceCode zip countryCode } }`. For the orders of many customers at once, query `orders` with `query: "customer_id:…"` or run a bulk operation on `customers { … orders { … } }`.

## Segments

Shopify segments are saved queries in Shopify's segment language (`customer_tags CONTAINS 'vip'`, `number_of_orders > 5`, `amount_spent > 500`, `email_subscription_status = 'SUBSCRIBED'`, `last_order_date > -30d`):

- List them: `segments(first: 50, query: "name:VIP") { edges { node { id name query creationDate } } }`.
- Members of a saved segment: `customerSegmentMembers(segmentId: $segmentId, first: 100) { edges { node { id displayName numberOfOrders amountSpent { amount currencyCode } defaultEmailAddress { emailAddress } lastOrderId } } totalCount pageInfo { hasNextPage endCursor } }`.
- An ad-hoc segment without saving it: `customerSegmentMembers(query: "number_of_orders > 5 AND amount_spent > 500", first: 100) { … }`. Save it for the merchant with `segmentCreate(name:, query:)` only when asked.

## Updating customers

- `customerUpdate(input: { id: $id, firstName:, lastName:, note: "…", tags: ["vip"], locale:, taxExempt: }) { customer { id } userErrors { field message } }`. `tags` replaces the list; prefer `tagsAdd(id:, tags:)` / `tagsRemove` for one tag. Changing `email` or `phone` through `customerUpdate` re-verifies the address; tell the user.
- Create: `customerCreate(input: { firstName:, lastName:, email:, phone:, tags:, note:, addresses: [{ address1:, city:, provinceCode:, zip:, countryCode: }] }) { customer { id } userErrors { field message } }`. Invite them to activate an account with `customerSendAccountInviteEmail(customerId:)` when the store uses legacy accounts.
- Marketing consent is its own mutation and needs the customer's explicit consent, recorded with where it came from: `customerEmailMarketingConsentUpdate(input: { customerId: $id, emailMarketingConsent: { marketingState: SUBSCRIBED, marketingOptInLevel: SINGLE_OPT_IN, consentUpdatedAt: "2026-10-31T12:00:00Z" } }) { customer { id } userErrors { field message } }` (states `SUBSCRIBED NOT_SUBSCRIBED UNSUBSCRIBED PENDING`; `customerSmsMarketingConsentUpdate` for SMS). Never subscribe someone who did not opt in.
- Metafields: `metafieldsSet(metafields: [{ ownerId: $customerId, namespace: "custom", key: "birthday", type: "date", value: "1990-05-01" }])`; read with `customer { metafield(namespace:, key:) { value } }`.
- Merge duplicates: check `customer { mergeable { isMergeable reason } }`, then `customerMerge(customerOneId:, customerTwoId:) { job { id done } resultingCustomerId userErrors { field message } }`. Delete: `customerDelete(input: { id: $id })` only works for customers without orders and is irreversible; confirm with the user first.

## Reporting on customers

State the filter or segment, the time range and whether amounts are lifetime (`amountSpent`) or from a set of orders you summed. Report counts from `customersCount` or `totalCount` rather than by paging. Keep personal details out of summaries unless the user asked for them.
