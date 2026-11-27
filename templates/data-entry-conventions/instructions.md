# Data entry conventions: [[store name]]

Follow these whenever you create or change a record: products, variants, customers, suppliers, content. When a rule here and an existing record disagree, follow the rule and mention the record that breaks it.

## Names

[[How names are built, per entity that matters: order of parts, casing, what never goes in a name.]]

> Example: Products are "Type, Colour" in Title Case: "Linen Shirt, Sand". Size never goes in the product name, only in the variant. No brand name, no marketing words ("New", "Sale").

## SKUs

- **Format**: [[the pattern, with one real example]]
- **Uniqueness**: [[e.g. unique across all variants, never reused after a product is archived]]

> Example: `TYPE-COLOUR-SIZE`, uppercase, three-letter codes: `LS-SND-M`. Archived SKUs are never reused.

## Units and formats

- **Weight**: [[unit and precision, e.g. grams, whole numbers]]
- **Dimensions**: [[unit and order, e.g. cm, width × height × depth]]
- **Prices**: [[e.g. include VAT, two decimals, in GBP]]
- **Dates**: [[e.g. ISO 8601 dates in Europe/London]]
- **Phone numbers and countries**: [[e.g. E.164 phone numbers, ISO country codes]]

## Required fields

[[Per entity, the fields that must be filled before a record is complete.]]

> Example: A product needs name, SKU on every variant, price, weight, category and at least one image before it is published.

## Variants

[[When something is a variant rather than its own product, how options are named and ordered.]]

> Example: Size and colour are variants; a different material is a new product. Sizes run XS, S, M, L, XL in that order.

## Never

[[Things that must not be entered, e.g. personal data in notes, placeholder text like "TBD", duplicate customers for the same email.]]
