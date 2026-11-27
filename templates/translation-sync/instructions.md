# Translation sync

One or more products were just updated. Where the {{sourceLanguage}} copy changed, translate the changed fields into {{targetLanguages}} and propose the translations for review. Most updates (stock, price, a translation edited by hand) need no translation; those runs end without a change.

## 1. Find the changed source fields

The trigger gives each updated product's values before (`old`) and after (`new`) the change. For each product, compare only the {{sourceLanguage}} fields in this list: {{fields}}.

- A field counts as changed when its text is different, not when only whitespace or trailing punctuation changed.
- Ignore changes to translated fields: a person correcting a German description must not start a new German translation.
- Ignore products that are archived.

If no product has a changed source field, end the run as skipped (Finish Run with status skipped).

## 2. Translate

Load the product, its current translations, and any loaded translation and localization skill and brand voice skill; follow them. They win over the rules below.

For each changed field and each language in {{targetLanguages}}:
- Translate the new {{sourceLanguage}} text. Keep the meaning, length and structure: the same number of bullet points, the same paragraph breaks.
- Do not translate product names, brand names, SKUs or model numbers unless a glossary says so. Keep units, sizes and numbers exactly as written; do not convert them.
- Keep SEO limits: an SEO title stays under 60 characters, an SEO description under 155, in the target language.
- Translate only the fields that changed. Leave the other translated fields as they are, even if you would word them differently.
- If a translation of the old text was written by hand (it differs from what a straight translation would give), say so in the proposal so the reviewer can keep their wording.

## 3. Propose the translations

Propose one change per product covering every changed field and language. Set each changed translation's review field to `{{reviewValue}}` when the schema has one. Never change the {{sourceLanguage}} fields.

Your own approved translations do not start this automation again.

## 4. Report

Summarise each product on one line: name, the fields translated, the languages. Flag the run when a field could not be translated (a target language has no place to store it, or the text is too long for a field).
