# Setting up the SEO metadata filler

## Map the data

- `seoTitle` and `seoDescription` are required. If the product entity has no SEO fields, offer to add them with a schema change, or explain that the template needs a place to put the metadata.
- `slug`: map it when the project stores URL slugs. Many stores create the slug on publish, or in Shopify; then leave it unmapped and the run skips slugs.
- `imageAlt`: images may be a list on the product or their own entity. Map the alt text field where it actually lives. If images carry no alt text field, turn `fillAltText` off.
- `published`: map the status or visibility field so the run never changes the slug of a live product.

## Other entities

The template targets products. To cover collections, pages or articles too, install it again for each entity and adjust the wording (an article's title starts with its headline, not a product name).

## Loops and noise

The run writes to the same entity that triggers it. Flexkit does not start an automation from its own changes, so saving the metadata does not start another run. Later edits by people do start runs, which is why the instructions only write empty fields and end most runs as skipped. Mention this when the team edits products in bulk: an import of 2,000 products starts 2,000 short runs, nearly all of them skipped.

## Parameters

Ask for the language, the title suffix (suggest " | " plus the store name) and alt text in one question.

## Mutation policy

Keep `require_approval` to start with, so the team sees a few runs. Once they trust the output, suggest switching to auto-approve: the run only fills empty fields and never changes a live URL, so an approval for every product edit adds work without adding safety.
