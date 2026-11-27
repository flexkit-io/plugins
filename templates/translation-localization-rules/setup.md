# Setting up translation and localization rules

## Read first

- The project's locales: the source locale and every target locale the schema or content uses.
- How translations are stored: per-locale fields, a translations entity, or separate records. Name the real structure in the skill's Process section.
- Existing translations: for 10 products or pages that are translated, compare source and target text. Collect terms translated the same way every time (glossary candidates), terms left in the original (never-translate candidates), and inconsistent ones.
- Any status or review field on translations (such as "needs review").
- Project knowledge documents about translation, glossaries or markets.

Show the user the candidates you found ("'Waxed canvas' is 'gewachstes Canvas' in 9 of 10 German texts; 'Commuter Line' is never translated").

## Interview

Ask in one or two rounds:
1. Confirm the locales, and for each the formality (du/Sie, tu/vous) and anything the market expects.
2. Which names are never translated?
3. Confirm the glossary candidates and settle the inconsistent ones.
4. Units, sizes and price and date formats per market.
5. Who reviews translations, and must machine translations be marked for review?

## Fill the scaffold

- Replace every [[placeholder]]. Add a glossary column per target locale; keep the glossary to the terms that matter (product types, materials, recurring phrases), at most about 40 rows.
- Remove the Example blocks.
- Name the skill "Translation and localization rules" and propose it with load mode **on demand**: it is needed only when content is translated.
