# Setting up Search Console quick wins

## Pick the property

Call list_sites and ask which property is the store's (when there is more than one, prefer the domain property, "sc-domain:…"). Write it into the instructions, e.g. "Use the Search Console property sc-domain:northlinegoods.com". The connected Google account must have access to it in Search Console; if list_sites returns nothing, tell the user to add that account as a user of the property in Search Console, then reconnect.

## Map pages to records

Search Console reports full page URLs. Ask how product (and, if wanted, content) URLs are built, and check it against a few URLs from a real query, e.g. "https://northlinegoods.com/products/{slug}". Write the pattern into the instructions next to the mapped slug field.

- Products only is a fine start. If the project also has pages or articles with their own SEO fields, offer to include them with their own URL pattern.
- If records have no SEO title or meta description fields, offer a schema change that adds them, and explain that the storefront must use them for this to have any effect. Without that, the template cannot help: say so plainly.
- If the storefront ignores the Flexkit SEO fields (for example, the SEO title lives in Shopify), stop and say the rewrites would not reach Google.

## Parameters

Ask in one question: the schedule and time zone, minimum impressions (300 suits most small stores; 1000 or more for big ones, so only pages with real volume are touched), pages per week (5 by default) and the language. Keep the title suffix empty unless the brand always uses one.

## Mutation policy

Keep `require_approval`. SEO titles are visible in Google and a bad rewrite costs clicks; the point of the template is that a person approves each change.

## Other automations

If SEO metadata filler is installed, its runs start when this one saves a title and skip because the field is not empty. That is expected.

## First run

Offer a test run right after setup. The first run has nothing to follow up on, and shows the first candidates with their rewrites, which is the quickest way for the team to judge the template.
