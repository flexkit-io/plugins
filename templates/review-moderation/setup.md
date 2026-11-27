# Setting up review moderation

## Where the reviews are

Check this first, before mapping anything:
- Find the review entity with Search Schema. If the project has none, say plainly that the template needs the reviews in Flexkit, and offer a schema change for a review entity (text, rating, product, reviewer, status, moderation reason, sentiment, topic).
- Most stores collect reviews in a reviews app (Judge.me, Yotpo, Trustpilot, Okendo). Ask how reviews reach the project. If the app sends them by webhook into a Flexkit entity, or a sync creates the records, the entity trigger works. If the reviews only live in the app, say so: this template cannot moderate them there.
- **Check that the status decides what the storefront shows.** Ask the user, or check the storefront query if you can read it. If the storefront (or the reviews app) shows reviews whatever their Flexkit status, holding a review here does not hide it; say so before going on, and suggest moderating in the app instead or changing the storefront to read the status.

## Map the data

- `reviewStatus` is required: it is how the run publishes and holds. Read the values in use (query a few reviews) and fill `publishedValue` and `heldValue` from them, e.g. "approved" and "pending". New reviews must arrive in the held state, not already published; if the app publishes new reviews immediately, moderation comes too late, so tell the user.
- `moderationReason`, `sentiment`, `topic`: offer to add the fields with one schema change when missing. Without `moderationReason`, the reason goes only in the Slack message and the run summary. Without `sentiment` and `topic`, the weekly sentiment report classifies reviews itself, which is slower and can drift from week to week.
- `reviewer` and `verifiedPurchase`: map them when present; they help spot repeat and non-genuine reviews.

## Policy skill

Recommend Review moderation policy and offer to set it up from its template first: it holds the store's own rules (what counts as spam, which claims are not allowed, how incentivised reviews are treated). Brand voice is optional; it only helps the wording of the Slack message.

## Parameters

Ask in one question: the Slack channel (optional; list the channels), the status values (pre-filled from what you read), whether to publish clean reviews automatically, and whether to hold every review with a link.

## Mutation policy

Use `auto_approve`. The run only changes a status between held and published and writes tags and a reason; it never rejects, edits or deletes a review. Publishing a clean review a few minutes after it arrives is low risk, and making customers wait for a person to approve every five-star "Love it!" is what makes moderation a chore. Held reviews still wait for a person.

Offer `require_approval` instead for a cautious start, for example for the first week, or for a store in a regulated category (supplements, cosmetics, children's products). Then every decision, including publishing, waits for someone.

Whatever the policy, the instructions never let a review be held for being negative. If the user asks to hold low-rated or critical reviews, explain that this is review suppression, which is unlawful in the EU and the US, and do not add it.

## Working with review triage

Both templates start on a new review. They split the work:
- **Review moderation** decides publish or hold, and tags sentiment and topic.
- **Review triage** drafts replies and escalates low ratings. From version 1.1.0 it reuses the tags moderation saved and waits for the decision: with moderation installed, set triage's trigger to review **update** so it runs once moderation has published the review (setup of triage explains this).

If triage is already installed at version 1.0.0, offer to set it up again from the template.
