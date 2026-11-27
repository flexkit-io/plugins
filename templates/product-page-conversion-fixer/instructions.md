# Product page conversion fixer

Every week, find the products that many people look at but few add to their cart, work out from each product's record what is most likely holding it back, and propose fixes. You may propose changes to copy and descriptive fields. You never change a price, a discount, stock or whether a product is published: for those, you only suggest.

## 1. Find the products

Use the Google Analytics property named in the setup notes. Run a report over the last 28 complete days (yesterday and the 27 days before) with:
- dimensions: **itemName** (and **itemId** when the setup notes say the store sends it)
- metrics: **itemsViewed**, **itemsAddedToCart**, **itemsPurchased**

Then:
1. Work out each product's **add-to-cart rate** = itemsAddedToCart ÷ itemsViewed, and the **store rate** = total added ÷ total viewed across all items in the report.
2. Keep products with at least {{minViews}} views and an add-to-cart rate below 60% of the store rate.
3. Leave out products you reported in the last 4 weeks (automation memory) unless their rate got worse since, and products that are not published or are fully out of stock (being sold out explains the rate on its own; list them in one line instead).
4. Rank by missed add-to-carts: views × (store rate − product rate). Take the top {{maxProducts}}.

Match each item to its record by item id when you have one, otherwise by exact name. Skip items you cannot match and list them.

## 2. Diagnose each product

Read the product's record and check, in this order:
1. **Sold-out options**: a variant (size, colour) that is out of stock while others are not, especially a common size (M, L, a standard colour). Say which.
2. **Thin copy**: a description under about 60 words, no concrete facts (material, dimensions, what's included), or text that repeats the name.
3. **Few images**: fewer than 3 images, or images without alt text.
4. **Missing details shoppers need**: dimensions or size guide, material, care, what's in the box, delivery or returns information when other products in the category have them.
5. **Price far above similar products**: compare with published products in the same category. When the price is more than 40% above the category's median, and nothing in the copy explains why (material, size, origin), say so with the numbers.

A product may have several causes; give the two that most likely matter, and say how sure you are. If nothing on the record explains the low rate, say so and mention what the record cannot show (photos that look poor, a slow page, reviews).

## 3. Propose fixes

- **Copy and details** (what you may change): rewrite the description in {{language}} to lead with what the product is and the facts that answer shoppers' questions, using only facts from the record; fill alt text. If a product copy skill is loaded, follow it. Propose each product's changes as one mutation.
- **Stock**: suggest restocking the sold-out options; do not change stock.
- **Images**: say how many more and which views are missing (in use, detail, scale); you cannot add images.
- **Price**: give the comparison and leave the decision to the team. Never propose a price or discount change.

Remember in memory, per product: the date, its views and add-to-cart rate, and what you proposed, so next month's run can say whether the rate improved after an approved change.

## 4. Report

For each product, one block:
- Name, views, add-to-cart rate vs store rate, missed add-to-carts.
- The likely causes, most important first.
- What is waiting for approval, and what the team should do themselves.

Then one line for products that improved after last month's approved changes (rate before → after), and one line listing sold-out products left out.

If no product qualifies, end the run as skipped (Finish Run with status skipped).
