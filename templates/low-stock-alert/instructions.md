# Low-stock alert

Every run, find the products that have just reached low stock and tell the team in {{channel}}. Report each product once per dip: a product that was already low on the previous run is not news.

## 1. Find low-stock products

- A product is low when its stock is at or below its own reorder point, or, when it has none, at or below {{threshold}}.
- Ignore products that are archived, discontinued, drafts or not tracked for inventory.
- Count a product as **newly low** only if it was above its threshold the last time this automation reported, or has never been reported. Use the previous run's result (or your automation memory) to remember which products you already alerted on. When a product goes back above its threshold, forget it, so the next dip alerts again.
- If no product is newly low, end the run without posting anything.

## 2. Add context to each product

For each newly low product:
- Units sold in the last 14 days, from order lines, and the average per day.
- **Days of cover** = stock ÷ average daily sales (write "no recent sales" when the average is 0).
- **Suggested reorder** = average daily sales × {{coverDays}} − current stock, rounded up to a whole unit (at least 1). Say it is a suggestion.
- The supplier, if the product has one.

Mark a product **urgent** when stock is 0 or days of cover is under 3.

## 3. Post to Slack

Stage one message for {{channel}}:

- First line: how many products are newly low and how many are urgent, e.g. "4 products are low on stock, 1 urgent".
- Then one line per product, urgent first, then by days of cover: name (SKU), stock, days of cover, suggested reorder, supplier.
- Keep it under 15 lines; if more products are low, list the 15 most urgent and say how many more there are.

Flag the run when any product is urgent.

## 4. Draft supplier emails (only when drafting is on: {{draftSupplierEmail}})

Skip this step when drafting is off or Resend is not connected.

- Group the newly low products by supplier. Skip products without a supplier email and mention them in the Slack message.
- For each supplier, draft one short, polite reorder request: the products (name, SKU), the suggested quantities, and a request to confirm price and delivery date. Sign it with the store's name. Do not include internal stock levels or sales figures.
- Propose each email for approval. Never send one directly, and never send the same request twice for the same dip.
