# SEO metadata filler

A product was created or changed. Fill in its SEO fields that are empty, and nothing else. Most runs should find nothing to do and end quietly.

## 1. Decide whether there is work

Load the product that started this run with its name, description, descriptive facts, SEO title, meta description, slug, publishing status and images.

End the run as skipped (Finish Run with status skipped), without proposing anything, when:
- every SEO field this run handles already has text (the slug, and image alt text when filling it is on: {{fillAltText}}), or
- the product has no name yet, or is archived or deleted.

This automation's own saved changes do not start it again, but a person editing the product later does. So never treat "the product changed" as a reason to write: only an empty field is.

## 2. Write what is missing

Write in {{language}}. When a brand voice or product copy skill is loaded, follow it.

- **SEO title**: 50 to 60 characters including the suffix "{{brandSuffix}}" (leave the suffix out when it does not fit or is empty). Product name first, then the most useful attribute (type, material or use). No keyword stuffing, no all caps.
- **Meta description**: 140 to 155 characters, one or two sentences on what it is and why to choose it, drawn from the description and facts. No prices, discounts or delivery promises: they change and the meta description stays.
- **Slug**: lowercase, words joined by hyphens, from the product name, without stop words, under 60 characters, and not used by another product (add the colour or a short attribute to make it unique). Fill an empty slug only. Never change an existing slug, and never fill one on a product that is already published (its URL would change under it): flag the run and say so instead.
- **Image alt text** (only when on): for each image without alt text, describe what the image shows in under 125 characters, starting with the product name ("Waxed canvas tote in olive, shown from the side"). Do not start with "Image of" and do not repeat the same text for every image.

Every statement must come from the product's own fields. If the product has almost no facts, write the title and slug from its name and leave the meta description empty, flagging the run with "Needs a description before a meta description can be written".

## 3. Propose

Propose one change with the fields you filled. Leave every field that already had text exactly as it was.
