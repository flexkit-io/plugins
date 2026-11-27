# Setting up the newsletter drafter

## Klaviyo

Klaviyo is required: the campaign is drafted there. Its core tools create campaigns only as drafts and cannot send or schedule them, so the team always sends from Klaviyo. Say so plainly, so nobody waits for an email that was never going to go out on its own.

The person who connects Klaviyo needs the Owner, Admin or Manager role in Klaviyo. A project connection acts as that Klaviyo user for everyone's automations.

Look up the lists and segments in Klaviyo and ask which one the newsletter goes to; use its exact name for `listName`. Show its size so the team knows the audience before the first draft.

## Map the data

- `productImage` must be a public URL (a CDN link), because the email is opened outside Flexkit. If images are stored in a way that has no public URL, say the products will appear without images, or ask where the public images are.
- `productUrl`: the product's page on the storefront. If the project only stores a handle or slug, ask for the store's base URL and put the pattern in the instructions (for example `https://northline.example/products/{handle}`).
- `productPublished`: map whatever marks a product as live (a status, a published flag or date). Without it, drafts or archived products may be featured; ask how the team tells them apart.
- `orderLines`: needed for best sellers. Without order data, remove the best sellers group from step 2 and say the newsletter will only feature new and restocked products.
- `stock`: needed for "back in stock" and to leave out sold-out products. Without it, remove the back-in-stock group and the stock check.
- If the catalog lives in Shopify and not in the project, read products, inventory and orders from the Shopify plugin instead, and say so in the instructions.

## Parameters

Ask in one question for the day and time, the frequency, the list, the number of products, the language and any standing offer. Suggest drafting a day or two before the team usually sends, so there is time to review.

## Test run

Offer a test run right after setup: it shows the team a real draft from their own catalog in Klaviyo, which is the quickest way to judge whether the product picks and the tone are right.

## Mutation policy

Keep `require_approval`. Creating the campaign and its template are the only changes, and seeing them in the approval card is how the team reviews the edition before it reaches Klaviyo. A team that reviews in Klaviyo anyway can switch to `auto_approve`; the draft still cannot be sent from here.
