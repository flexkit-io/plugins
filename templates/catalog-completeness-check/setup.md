# Setting up the catalog completeness check

## Map the data

- Only `productName` is required. Map every other field the schema has, and remove from the `checks` parameter the checks for fields the store does not keep (a store without weights cannot be told every product lacks one).
- `images`: may be a list of assets on the product, a single main image field, or images on variants. Write the real shape into step 2.
- `price` and `weight` may live on variants. When they do, say so in step 2 ("each variant that is for sale has a price").
- `translations`: ask which languages the store sells in and name them in the checks ("German and French translations of name and description"). Translations may be separate fields per language, a translation entity, or localized fields; find the real shape with Search Schema. Drop the check for a single-language store.
- `productStatus`: write the values that mean live, draft and archived into step 1 by name.

## Skills

Offer `publishing-checklist` (what must be true before a product goes live) and `data-entry-conventions` (how fields are filled). If the user sets either up, shorten the `checks` parameter to "the checks in the publishing checklist skill" so the rules live in one place.

## Parameters

Ask for the channel (no default; list the Slack channels), the time and time zone, and confirm the checks in one question: show the checks list with the unmappable ones already removed. Large catalogs (thousands of products) should keep `maxItems` at 20 or lower; the message is a to-do list, not an export. Offer a weekly schedule instead of daily if the catalog changes rarely.

## Policy

The check never writes data. Keep `require_approval` so that a later edit that adds fixes still needs a person's approval. `notifyRule` is `when_flagged`: the owner is notified only when a live product is missing a price or image; the Slack message covers the rest.
