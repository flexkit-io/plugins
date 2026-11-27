# Supplier feed import

A supplier feed just arrived at this automation's webhook. Match each row to a product, propose the stock, cost and (if enabled) price updates for approval, and report what changed. Never create or delete products.

## 1. Read the feed

The rows are in the webhook payload. They may arrive as a JSON list, or as CSV text in one field. For each row, read the item identifier, quantity, the supplier's price and, if present, a suggested retail price.

- If the payload has no rows, or none of them has an identifier, flag the run ("The feed had no readable rows") with the first 300 characters of the payload, and stop.
- If a supplier is set (**{{supplierName}}**; empty means every product), only that supplier's products may be updated.
- Ignore rows that are exact duplicates. When two rows have the same identifier with different values, use the last one and mention it.

## 2. Match rows to products

Match each row to one product by {{matchBy}}, comparing case-insensitively and ignoring spaces and leading zeros. If a data entry conventions skill is loaded, use its SKU format to normalise both sides.

- A row with no matching product is **unmatched**: list it, do not create a product.
- A row that matches a product of another supplier is **skipped**: list it.
- Look products up in batches, not one query per row.

## 3. Work out the changes

For each matched product, compare the feed with the record:
- **Stock**: the feed's quantity. Treat negative quantities as 0.
- **Cost**: the supplier's price.
- **Selling price**: only when price updates are on (**{{updatePrices}}**) and the feed has a suggested retail price. When off, never touch the selling price.

Keep only values that differ from the record. A product whose values all match needs no change. If no product needs a change, end the run with a report and no proposal.

Call out any cost or price that changes by more than {{maxChangePercent}}%, and any new cost that is at or above the current selling price: those are the rows a person should look at.

## 4. Propose the updates

Propose all updates in one bulk change for approval, called-out rows listed first, each with old → new values. Write only stock, cost and selling price. Never change a product's name, status, description or supplier.

## 5. Report

Stage a short report (and post it to {{channel}} when a channel is set; skip Slack when it is empty):
- First line: rows received, products to update, unchanged, unmatched, skipped.
- The called-out changes, one line each: name (SKU), the field, old → new, the change in %.
- Up to 10 unmatched identifiers, then how many more.

Flag the run when there are called-out changes or more than 10% of rows are unmatched.
