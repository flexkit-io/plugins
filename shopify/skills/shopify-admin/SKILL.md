---
name: shopify-admin
description: Work with a connected Shopify store through its Admin GraphQL API tools (search_schema, validate_graphql, execute_graphql_query, run_graphql_mutation). Load first for any Shopify task; it covers IDs, pagination, the search syntax, query cost, mutations and userErrors, bulk exports and access scopes.
---

# Working with a Shopify store

The Shopify tools act on one connected store with exactly the Admin API access scopes the store granted the connected app. You never see the access token and must never ask the user for it, a client secret or a store password.

## Workflow

1. `search_schema` without a query lists every resource (orders, products, customers, inventory, fulfillment, discounts, metafields…) with its number of query fields and mutations. Search a resource, field, mutation, input type or enum by name to get its definition. Never guess a field, argument or type name: the Admin API is large and names are specific (`displayFinancialStatus`, not `financialStatus`; `defaultEmailAddress { emailAddress }`, not `email`).
2. `validate_graphql` before every execution. It catches unknown fields and wrong variable types without spending the store's API budget.
3. `execute_graphql_query` to read, `run_graphql_mutation` to change. Pass values as variables, never by string interpolation.

Definitions marked `@deprecated` name their replacement; use the replacement (for example `fulfillmentCreate`, not `fulfillmentCreateV2`; `collectionUpdate`, not `collectionAddProducts`).

## IDs, numbers and handles

- Every object has a global ID: `gid://shopify/Order/1234567890`, `gid://shopify/Product/…`, `gid://shopify/ProductVariant/…`, `gid://shopify/Customer/…`, `gid://shopify/InventoryItem/…`, `gid://shopify/Location/…`. Mutations and single-object queries (`order(id:)`, `product(id:)`, `customer(id:)`) take the GID as an `ID` variable.
- An order *number* (`#1001`) is the order's `name`; find the order with `orders(first: 1, query: "name:#1001")`. Products also have a `handle`: `productByHandle(handle:)` (deprecated in favour of `productByIdentifier(identifier: { handle: "…" })`).
- Keep the GIDs you get back; reuse them instead of searching again.

## Lists, pagination and search

- List fields are connections: `orders(first: 50, after: $cursor, sortKey: CREATED_AT, reverse: true) { edges { node { … } } pageInfo { hasNextPage endCursor } }`. `first` is at most 250. Fetch only as many pages as the question needs; for more than a few thousand objects use a bulk operation (below).
- Most list fields take `query:` in Shopify's search syntax: `field:value`, ranges (`created_at:>=2026-01-01`, `total_price:>100`), `AND`, `OR`, `NOT` or `-`, quoted phrases, and `*` suffix wildcards. Examples: orders `financial_status:paid fulfillment_status:unfulfilled created_at:>=2026-10-01`; products `status:active vendor:Acme tag:sale`; customers `email:jane@example.com`, `orders_count:>5`, `tag:vip`. Search the Shopify docs page linked in the field's description when a filter name is unclear; the schema definition of the list field lists the supported filters.
- Counts are cheap: `ordersCount(query: "…") { count precision }`, `productsCount`, `customersCount`. Prefer them to paging through everything to count.
- Dates in the API are UTC ISO 8601. The store's time zone is `shop { ianaTimezone }`; convert when the user asks for a local day, and say which time zone you used.
- Money is a `MoneyBag`: `totalPriceSet { shopMoney { amount currencyCode } }`. Amounts are decimal strings; keep the currency code with every amount you report.

## Query cost

Every request costs points against the store's per-store bucket (1000 points on most plans, 2000 and more on Plus; restored at 50 to 100 points per second). The cost is roughly one point per object plus one per connection, multiplied by `first`, so a nested connection inside a list of 250 is expensive. Each result ends with the cost of the query and the points left. Request only the fields you need, keep nested lists small (`lineItems(first: 10)`), and when the remaining points are low, wait before the next large query. A throttled result says so; wait a second and retry with a smaller query.

## Mutations

- Find the mutation and its input type with `search_schema`; read the input type before writing the call.
- Always select `userErrors { field message }` (some payloads name it differently, for example `mediaUserErrors`). Shopify reports invalid input there with a 200 status; the tool treats a non-empty list as a failure and shows you the messages. Fix the input rather than retrying unchanged.
- Changes hit the live store immediately and cannot be undone. Read the current state first, say what you are about to change, and never cancel, refund, delete or bulk-update without the user asking for exactly that. Plugin actions also follow the project's approval rules.
- Tags: `tagsAdd(id:, tags:)` and `tagsRemove` work on orders, products, customers and more without touching other fields.
- Metafields: `metafieldsSet(metafields: [{ ownerId, namespace, key, type, value }]) { metafields { id } userErrors { field message } }`. Read them with `metafield(namespace:, key:) { value jsonValue type }` or `metafields(first:, namespace:)` on the owner. `type` is required unless a definition exists for the namespace and key.

## Bulk operations (large exports)

For every order, product or customer of a large store, run the query as a bulk operation instead of paging:

1. `bulkOperationRunQuery(query: """ { orders(query: "created_at:>=2026-01-01") { edges { node { id name createdAt totalPriceSet { shopMoney { amount currencyCode } } } } } } """) { bulkOperation { id status } userErrors { field message } }` — the query must be a single root connection without `first`/`after`, and only one bulk query runs at a time per store.
2. Poll `currentBulkOperation { id status objectCount url errorCode completedAt }` every few seconds until `status` is `COMPLETED` (or `FAILED`; `errorCode` says why).
3. `url` is a temporary link to a JSONL file (one object per line, nested objects on their own lines with `__parentId`). Give the link to the user, or process the file if you have a tool that can fetch it; the link expires after a week.

## Errors and access

- "Access denied for … field" or an "ACCESS_DENIED" error: the connected app lacks that access scope (`read_customers`, `write_orders`, `read_all_orders` for orders older than 60 days…). Tell the user which scope is missing; they add it to the app in the Shopify Dev Dashboard, release a new version, approve it on the store, and reconnect Shopify in AI → Plugins.
- "Reconnect Shopify": the token was rejected. Ask the user to reconnect from the connect card or AI → Plugins; never ask them to paste credentials into the chat.
- Shopify may redact customer data (`REDACTED`) for apps without protected customer data access; say so instead of guessing.

## Reporting

- State the store, the filter (`query:`), the time range and time zone, and how many objects you looked at.
- Keep amounts with their currency and prefer short tables for lists. Keep the GraphQL out of the answer unless the user asks for it.
- Store facts for context: `shop { name myshopifyDomain currencyCode ianaTimezone primaryDomain { url } plan { publicDisplayName shopifyPlus } }`.
