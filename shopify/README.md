# Shopify

Work with a Shopify store through the Admin GraphQL API: orders, fulfillment, refunds, products, variants, inventory, collections, customers, discounts, metafields and bulk exports.

The plugin's MCP server is hosted by Flexkit at `https://flexkit.io/api/mcp/shopify`. It exposes the same four tools the Flexkit agent uses for a project's own data, pointed at the store's Admin API (version 2026-10): `search_schema` (the full Admin schema, by resource, field, mutation, input or enum name), `validate_graphql`, `execute_graphql_query` and `run_graphql_mutation`. Mutations report Shopify's `userErrors` as failures and follow the project's approval rules.

## Connecting

Connect through Flexkit Studio → AI → Marketplace. Shopify has no OAuth flow for a store's own tooling, so the plugin takes credentials of an app you create for your store:

- **Dev Dashboard app (recommended).** In the [Shopify Dev Dashboard](https://dev.shopify.com/dashboard/), create an app, select the Admin API access scopes the agent should have (for example `read_orders`, `read_products`, `read_customers`; add `write_*` scopes only if the agent should change store data), release a version and install it on your store. Enter the store's myshopify.com domain and the app's Client ID and Client secret from its Settings page. Flexkit exchanges them for an access token through Shopify's [client credentials grant](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/client-credentials-grant) and renews it every 24 hours. The store and the app must belong to the same Shopify organization.
- **Legacy custom app.** For a custom app created in the Shopify admin before 2026, enter the store domain and the app's Admin API access token (`shpat_…`).

Flexkit verifies the credentials with Shopify before saving them, stores them encrypted, and sends the access token only to its own Shopify MCP server, which forwards each operation to `https://<store>.myshopify.com/admin/api/2026-10/graphql.json`. The agent can use the tools but never sees the token, client secret or store password; Studio shows only the store name. The agent gets exactly the access scopes the store granted the app. Replace the credentials with Reconnect, or remove them with Disconnect. Credentials Shopify rejects mark the connection as needing a reconnect.

## Skills

- `shopify-admin`: IDs, pagination, Shopify's search syntax, query cost, mutations and `userErrors`, bulk operations, access scopes and reporting. The agent loads it first for any Shopify task.
- `shopify-orders`: lookups and reports, fulfillment with tracking, refunds and cancellations, draft orders and invoices, order edits, returns, tags and notes.
- `shopify-products`: products, variants and prices, inventory levels and adjustments, collections, publishing, product metafields.
- `shopify-customers`: profiles, order history, segments, tags and notes, marketing consent, merges and deletion, with care for personal data.

Credentials are stored by the platform, never in this repository.
