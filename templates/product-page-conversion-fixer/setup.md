# Setting up the product page conversion fixer

## Check the Google Analytics data first

Call list_properties and ask which property is the store's. Then run a report over the last 28 days with dimension itemName and metrics itemsViewed and itemsAddedToCart.

- **Rows come back with views and add-to-carts**: the store sends GA4 ecommerce events (view_item, add_to_cart). Continue.
- **No rows, or views but no add-to-carts**: the store does not send those ecommerce events, and this template cannot work. Say so plainly, and that the store's developer or its Shopify/GA4 integration can turn them on. Do not try to work it out from page views alone: page views and add-to-cart events on product URLs can be used instead only if the user confirms add_to_cart is sent (check with a report of eventName = add_to_cart by pagePath), and then change step 1 to use pagePath, screenPageViews and addToCarts, matching pages to records by slug.

Run with the user's own numbers: show the store's add-to-cart rate and the three products that would be picked today. That is usually the moment the template makes sense to them.

## Match items to records

Check whether the item ids in Google Analytics are the store's SKUs or product ids. If they are, map that field; matching by id survives renamed products. Otherwise matching is by exact name; mention that renamed products will not match until their new name has data.

## Map the data

- `variantStock` lets the template spot a sold-out size, which is often the whole explanation. Map it when stock is kept per variant.
- `price` and `category` are needed for the price comparison. Without a category, leave the price check out of step 2.
- `images`: map the image relation and its alt text field when there is one.

## Parameters

Ask in one question: the schedule and time zone, minimum views (200 suits most small stores; raise it for large catalogues so only products with real traffic are judged), products per week (5) and the language.

## Mutation policy

Keep `require_approval`: the template rewrites product copy that customers see. It never changes prices, stock or publishing, and should not; if the team asks for that, explain it is deliberate, since a price change based on one month of analytics can easily do harm.
