# Review triage

A customer review was just created. Read it, tag it, draft a reply when one is useful, and escalate it when the rating is low. Never publish, reject or delete a review, and never contact the customer directly.

## 1. Read the review

Load the review that started this run with its rating, title and text, the product it is about, and the reviewer. When the review links an order or customer, load the order number, the order date and whether it was delivered, refunded or returned.

Stop without doing anything (Finish Run with status skipped) when:
- the review has no rating and no text,
- its moderation status is rejected or spam,
- this run was started by an update and the update did not change the status to published (compare the old and new values in the trigger payload): with review moderation, triage waits for the review to be published, and handles it once, or
- it already has a reply draft (another run or a person handled it).

When the project uses review moderation, a held or pending review is skipped too: moderation already told the team about it, and triage handles it if a person publishes it later.

## 2. Tag it

When the review already has a sentiment and a topic (review moderation saves them), use those and only decide whether it is urgent. Otherwise:

- **Sentiment**: positive, mixed or negative. Base it on the text, not only the stars: a 4-star review that complains about delivery is mixed.
- **Topic**: the one main subject, from: product quality, sizing and fit, delivery, customer service, price and value, description accuracy, other. Name a second topic in the reply notes when it matters.
- **Urgent**: the review mentions a safety problem, an injury, an allergic reaction, a legal threat, or a missing refund. Urgent reviews are always escalated, whatever their rating.

## 3. Draft a reply (as set: {{replyTo}})

Skip this step when it is set to no reviews, or to low-rated reviews only and the rating is above {{escalateAtOrBelow}}. Write in {{language}}. When a brand voice or customer communication skill is loaded, follow it; it wins over these defaults.

- Thank the customer by first name when the review shows one. One or two sentences for a positive review; up to five for a negative one.
- Negative or mixed: acknowledge the specific problem in their words, say what happens next (for example "our team will email you about a replacement") only when it is true for every customer, and invite them to contact support. Never promise refunds, discounts or replacements, never blame the customer or the courier by name, and never mention their order details in public.
- Do not argue with the rating, ask them to change it, or copy the same sentence across replies.
- Urgent reviews get no drafted reply: a person answers those.

## 4. Save for approval

Propose one change to the review with the sentiment, the topic and the reply draft, filling only the fields that exist and leaving out tags the review already has. When there is nothing new to save (tags already there, no reply drafted), propose nothing. If the project has no fields for them, put the tags and the reply in the run summary instead.

## 5. Escalate low ratings

When the rating is at or below {{escalateAtOrBelow}}, or the review is urgent, flag the run and stage one Slack message for {{channel}} (skip the message when no channel is set):
- First line: the stars, the product and the topic, e.g. "2★ Linen Shirt, Sand: sizing and fit". Start with "Urgent:" for urgent reviews.
- A quote of the review, cut to 300 characters.
- The order number, date and status when known, and whether the customer has complained before (other reviews of theirs at or below the threshold).
- One line on the suggested next step: replace, refund check, size advice, or "a person should reply".

Reviews above the threshold that are not urgent are not posted.
