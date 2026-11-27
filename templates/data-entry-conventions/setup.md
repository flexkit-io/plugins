# Setting up data entry conventions

## Read first

Before asking anything, find out what the team already does:
- The 20 most recently created products, with their variants. Note how names are built (order of parts, casing, separators), the SKU pattern, units for weight and dimensions, and which fields are usually filled.
- A sample of other entities the team edits often (customers, suppliers, content). Note formats for phone numbers, countries, dates and addresses.
- Fields that are filled inconsistently: count how many of the sampled records follow each pattern ("17 of 20 SKUs follow TYPE-COLOUR-SIZE").
- Project knowledge documents about naming, SKUs or data standards (search the knowledge base for "SKU", "naming", "data entry").

## Interview

Ask in one round, offering the dominant pattern you found as the default for each answer:
1. Product names: is the pattern you found the rule? Anything that must never appear in a name?
2. SKU format: confirm the pattern and whether SKUs may be reused.
3. Units for weight, dimensions and prices (with or without tax).
4. Which fields must every product have before it goes live?
5. What makes something a variant rather than a new product?

When records disagree, show two examples and ask which one is right rather than guessing.

## Fill the scaffold

- Replace every [[placeholder]] with the user's answers and one real example from their data. Remove the Example blocks.
- Drop sections that do not apply (a store without variants has no Variants section).
- This skill is loaded for every task, so keep it short: under about 400 words. Rules, not explanations.
- Name the skill "Data entry conventions" and propose it with load mode **always**.
