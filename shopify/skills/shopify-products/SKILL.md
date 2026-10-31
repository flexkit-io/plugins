---
name: shopify-products
description: Read and change Shopify products, variants, prices, inventory levels, collections, product metafields and publishing with the Admin API tools. Load after shopify-admin for catalog, stock or pricing tasks.
---

# Products, variants, inventory and collections

Load `shopify-admin` first for IDs, pagination, search syntax, cost and mutation rules.

## Finding products

- `products(first: 50, query: "status:active vendor:Acme", sortKey: TITLE) { edges { node { id title handle status vendor productType tags totalInventory variantsCount { count } priceRangeV2 { minVariantPrice { amount currencyCode } maxVariantPrice { amount } } featuredMedia { preview { image { url } } } } } pageInfo { hasNextPage endCursor } }`. Filters: `title:`, `vendor:`, `product_type:`, `tag:`, `status:active|draft|archived`, `sku:`, `barcode:`, `created_at:`, `inventory_total:>0`, `published_status:published`.
- One product: `product(id:)`, `productByIdentifier(identifier: { handle: "…" })`. Statuses: `ACTIVE DRAFT ARCHIVED`. Sort keys: `TITLE CREATED_AT UPDATED_AT PUBLISHED_AT VENDOR PRODUCT_TYPE INVENTORY_TOTAL ID`.
- Variants: `product { options { name values } variants(first: 100) { edges { node { id title sku barcode price compareAtPrice selectedOptions { name value } inventoryQuantity inventoryPolicy availableForSale inventoryItem { id tracked unitCost { amount } } } } } }` or across the store with `productVariants(first:, query: "sku:ABC-1")`.
- `productsCount(query:) { count }` before listing a large catalog; use a bulk operation to export everything.

## Creating and updating products

- Create: `productCreate(product: { title: "…", descriptionHtml: "<p>…</p>", vendor: "…", productType: "…", tags: [], status: DRAFT, productOptions: [{ name: "Size", values: [{ name: "S" }, { name: "M" }] }], collectionsToJoin: [$collectionId] }) { product { id handle variants(first: 10) { edges { node { id title } } } } userErrors { field message } }`. Shopify creates one variant per option combination you then price with `productVariantsBulkUpdate`, or add variants with `productVariantsBulkCreate(productId:, variants: [{ optionValues: [{ optionName: "Size", name: "L" }], price: "29.00", sku: "…", inventoryItem: { tracked: true }, inventoryQuantities: [{ locationId:, availableQuantity: 10 }] }])`.
- Update product fields: `productUpdate(product: { id: $id, title:, descriptionHtml:, vendor:, productType:, tags:, status:, collectionsToJoin:, collectionsToLeave: }) { product { id } userErrors { field message } }`. `tags` replaces the whole list; use `tagsAdd` / `tagsRemove` to change one tag. `productChangeStatus(productId:, status: ARCHIVED)` for status alone.
- `productSet(input: { … }, synchronous: true)` creates or updates a whole product with its options and variants in one call (an upsert by `id` or `handle`); use it for imports, `productUpdate` for a few fields.
- Prices and variant fields: `productVariantsBulkUpdate(productId: $productId, variants: [{ id: $variantId, price: "24.00", compareAtPrice: "29.00", sku:, barcodes: [{ barcode: "…" }], inventoryPolicy: CONTINUE, taxable: true }]) { productVariants { id price } userErrors { field message } }`. Prices are decimal strings in the store currency. Delete variants with `productVariantsBulkDelete(productId:, variantsIds:)`.
- Images and files: `fileCreate` with an external URL (`files: [{ originalSource: "https://…", contentType: IMAGE }]`) or `productUpdate(…, media: [{ originalSource: "https://…", mediaContentType: IMAGE, alt: "…" }])`; uploading local files needs `stagedUploadsCreate`, which this agent cannot complete without a file host.

## Inventory

Inventory lives on inventory items (one per variant) at locations.

- Locations: `locations(first: 20) { edges { node { id name isActive shipsInventory fulfillsOnlineOrders } } }`.
- Levels: `productVariant(id:) { inventoryItem { id tracked inventoryLevels(first: 20) { edges { node { location { id name } quantities(names: ["available", "on_hand", "committed", "reserved", "incoming"]) { name quantity } } } } } }` or `inventoryItem(id:) { inventoryLevel(locationId:) { … } }`. `inventoryQuantity` on the variant is the total across locations.
- Adjust by a delta: `inventoryAdjustQuantities(input: { reason: "correction", name: "available", changes: [{ inventoryItemId: $itemId, locationId: $locationId, delta: -3 }] }) { inventoryAdjustmentGroup { changes { name delta } } userErrors { field message } }`.
- Set an absolute value: `inventorySetQuantities(input: { reason: "correction", name: "available", quantities: [{ inventoryItemId:, locationId:, quantity: 25 }] }) { inventoryAdjustmentGroup { reason } userErrors { field message } }`. `name` is `available` or `on_hand`. Reasons: `correction`, `cycle_count_available`, `damaged`, `movement_created`, `movement_updated`, `movement_received`, `movement_canceled`, `other`, `promotion`, `quality_control`, `received`, `reservation_created`, `reservation_deleted`, `reservation_updated`, `restock`, `safety_stock`, `shrinkage`.
- An item must be `tracked` (`inventoryItemUpdate(id:, input: { tracked: true })`) and stocked at the location (`inventoryActivate(inventoryItemId:, locationId:)`) before quantities can be set there. Negative available stock is only allowed with `inventoryPolicy: CONTINUE` on the variant.
- Low-stock reports: `productVariants(first: 250, query: "inventory_quantity:<5 product_status:active") { edges { node { id sku title inventoryQuantity product { title } } } }`.

## Collections

- Find: `collections(first: 50, query: "title:Summer") { edges { node { id title handle productsCount { count } ruleSet { appliedDisjunctively rules { column relation condition } } } } }`; `collectionByHandle(handle:)`; products in one: `collection(id:) { products(first: 50) { edges { node { id title } } } }`.
- Manual collection: `collectionCreate(input: { title: "…", descriptionHtml:, products: [$productId, …], sortOrder: MANUAL }) { collection { id } userErrors { field message } }`. Add or remove products later with `productUpdate(product: { id:, collectionsToJoin: [$collectionId] })` / `collectionsToLeave`, or `collectionRemoveProducts(id:, productIds:)`. `collectionAddProducts` is deprecated.
- Smart collection: `collectionCreate(input: { title:, ruleSet: { appliedDisjunctively: false, rules: [{ column: TAG, relation: EQUALS, condition: "sale" }] } })`; products matching the rules join automatically.
- Update title, description, SEO or image with `collectionUpdate(collection: { id:, title:, descriptionHtml:, seo: { title description } })`.

## Publishing

Products and collections are visible per sales channel (publication). `publications(first: 20) { edges { node { id name } } }` lists them (Online Store, POS, Shop, …); `publishablePublish(id: $productId, input: [{ publicationId: $publicationId }]) { userErrors { field message } }` publishes, `publishableUnpublish` hides. A product must be `ACTIVE` to be visible; `publishedAt` on the product refers to the Online Store.

## Metafields on products and variants

Read: `product { metafields(first: 20, namespace: "custom") { edges { node { namespace key type value jsonValue } } } }` or `metafield(namespace: "custom", key: "material") { value }`. Write: `metafieldsSet(metafields: [{ ownerId: $productId, namespace: "custom", key: "material", type: "single_line_text_field", value: "Cotton" }]) { metafields { id } userErrors { field message } }`. Definitions: `metafieldDefinitions(first: 50, ownerType: PRODUCT) { edges { node { namespace key name type { name } } } }`; create one with `metafieldDefinitionCreate` when the store wants the field in the admin UI.
