# Catalog completeness check

Every run, check the catalog for products that are not ready to sell and post a short to-do list to {{channel}}. Only report; never change a product.

## 1. Choose the products

- Check live products. Check drafts too only when this is on: **{{includeDrafts}}**.
- Ignore archived, discontinued and deleted products.
- If a publishing checklist or data entry conventions skill is loaded, its rules for a complete product win over the defaults below.

## 2. Check each product

A product is complete when it has: {{checks}}.

Read those checks literally. For each product, note every check it fails, using short labels: "no image", "no price", "price is 0", "no weight", "no category", "short description", "missing translation: de, fr". A product with variants fails "no price" or "no weight" only when a variant that is for sale lacks it; name the variant.

## 3. Compare with the previous run

Use the previous run's result (or your automation memory) to tell **new** problems from ones already reported. A product is new when it failed no check last time, or was not checked last time (just created or just published). Keep the list of incomplete product ids in memory for the next run; drop products that are now complete.

If no product fails a check, end the run as skipped (Finish Run with status skipped) so nothing is posted. If the products failing are exactly the same as last run, post nothing either: end the run as skipped and note "no change" in its summary.

## 4. Post the to-do list

Stage one Slack message for {{channel}}:

- First line: how many products are incomplete and how many of them are new today, e.g. "12 products are not ready to sell, 3 new since yesterday".
- Then a section per problem, most common first ("No image (5)", "Missing translation (4)"…). Under each, one line per product: name (SKU), and for new ones the word "new". List new products first.
- List at most {{maxItems}} products in total, new ones first, then live before draft; then say how many more there are.
- End with one line naming the problem that blocks the most live products, as the suggested place to start.

Flag the run when a **live** product has no price or no image: customers can see it.
