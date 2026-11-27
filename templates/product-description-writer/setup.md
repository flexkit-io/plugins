# Setting up the product description writer

## Map the data

- `productName` and `productDescription` are required. Search the schema for the product entity (it may be called Product, Item, Article or Listing) and its title and long-text description fields. A rich-text field is fine; note in the instructions that the copy is written as plain paragraphs.
- `productFacts`: list the actual descriptive fields you found (material, dimensions, colour, care, attributes, variant options) in step 1 of the instructions, by their real names, so the automation reads them every run.
- `bulletPoints`, `seoTitle`, `seoDescription` are optional. If the project has no field for one of them, remove that section from the instructions and say so to the user. Offer a schema change only if they ask for it: most stores already keep SEO fields, sometimes in a nested "seo" object or a separate entity linked to the product.
- Replace generic words like "the description field" in the instructions with the real field names.

## Trigger

Entity trigger on the mapped product entity, event `create`. If the store imports products in bulk (a Shopify sync, a CSV import), mention that each new product starts a run, so an import of 500 products queues 500 proposals; offer to add a condition such as "only when the description is empty" in step 2, which the instructions already handle.

## Skills

The copy is far better with the `brand-voice` and `product-copy-guidelines` skills. Offer both. If the project already has a skill about tone, product writing or SEO, offer that one instead of a new one.

## Parameters

Ask for language, length, bullet count and whether to rewrite existing copy in one question. If the store sells in several languages, suggest one automation per language only if each language has its own fields; otherwise write the primary language.

## Mutation policy

Keep `require_approval`. Copy goes straight onto a customer-facing page, and the most common failure is an invented claim (a material, a certification). Suggest switching to auto-approve only after the user has approved a few weeks of drafts unchanged, and even then only for stores whose product pages are not published automatically.
