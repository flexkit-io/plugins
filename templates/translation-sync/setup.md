# Setting up translation sync

## Map the data

Translations can be stored in three ways. Find which one with Search Schema, then write the real shape into steps 2 and 3:
- **Fields per language** on the product (`description_de`, `description_fr`): map each.
- **A translation entity** linked to the product, one record per language: map it, its language field and its text fields. A language with no record yet needs a new record; say so in step 3.
- **Localized fields** that hold every language: map the field and how a language is addressed.

If the project has no place for translations, offer to propose a schema change (a translation entity with language, name, description, SEO fields and a review status), or stop.

- `reviewStatus`: map it if translations have a status or a "needs review" flag. Without it, remove the review step and tell the user the approval is the only review.
- `sourceFields`: confirm which fields the team writes in the source language and set `fields` to exactly those.

## Pages and other entities

The trigger watches products. If the user also wants pages, collections or articles kept in sync, install the template again for each entity: change the trigger's entity and the field list. One automation per entity keeps each run's reasoning simple.

## Skills

Offer `translation-localization-rules` (glossary, terms that stay untranslated, regional spelling) and `brand-voice`. Translations are much better with a glossary; without one, product and material names drift between languages.

## Mutation policy

Keep `require_approval`. Translations appear on the storefront in most setups, and machine translation of product copy needs a person who reads the language, at least for the first weeks. Once the team trusts the output for a language, the user can switch to auto-approve; the review status still marks every translation for a later check.

## Parameters

Ask for the source language, the target languages (suggest the ones the schema already stores) and the fields in one question.
