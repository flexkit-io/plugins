# Setting up the pricing and discount policy

## Read first

- The product schema: find the price, cost, compare-at (original) price and currency fields, and whether prices include tax. If there is no cost field, margins cannot be checked; say so and build the skill around price changes and discounts only.
- Margins across the catalogue: for products with a cost, the median margin and the lowest five, per category if there are categories. These are the evidence for the floor.
- Current sale prices: products with a compare-at price above the price, and the largest discount among them.
- Price endings in use (how many prices end in .00, .95, .99, 5 or 9).
- Project knowledge documents about pricing, margins or promotions.

Report what you found ("Median margin 61%; the lowest is Waxed Tote at 38%; 84% of prices end in 5 or 9") before asking.

## Interview

Ask in one or two rounds, offering what you found as defaults:
1. What is the margin floor, at full price and on sale? Does it differ by category?
2. How big a price change can be made without approval?
3. How should prices end?
4. The largest discount allowed, and products that are never discounted.
5. Who approves each kind of exception, and where do you ask them?

## Fill the scaffold

- Replace every [[placeholder]] with the answers and the real field names. Remove the Example blocks.
- Write rules as numbers, not adjectives ("at least 55%", not "a healthy margin"), so an automation such as the price change guard can check them.
- Name the skill "Pricing and discount policy" and propose it with load mode **on demand**: it is only needed when prices are involved.
