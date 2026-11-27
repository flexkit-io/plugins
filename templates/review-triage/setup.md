# Setting up review triage

## Map the data

- Reviews may be their own entity or come in from a review app (Judge.me, Yotpo, Trustpilot) synced into the project. Map `rating` and `reviewText` to the entity the reviews actually land in; if they only live in the review app, say that the template needs them synced into Flexkit first.
- `reviewCustomer` and the order: map them when the review links a customer or order. Without them, step 5 posts the review without order context; tell the user.
- `sentiment`, `topic`, `replyDraft`: offer to add these fields with a schema change when they are missing, or keep them out and let the run summary carry the tags and reply. Never map `replyDraft` to the field the storefront shows as the published reply: approving the change would publish it.
- `reviewStatus`: map it when reviews are moderated, so rejected and spam reviews are skipped.

## Trigger

Check whether Review moderation is installed (`listAutomations`), or is being set up in this chat.
- **Without review moderation**: entity trigger on the review entity, event create. If the review app creates reviews in a pending state and publishes them later, keep create: triage should happen before a review goes public, not after.
- **With review moderation**: entity trigger on the review entity, event **update**. Moderation publishes or holds each new review and saves its sentiment and topic; triage then runs on that update, acts only when the status has just changed to published, reuses the saved tags, and drafts the reply and escalation. Held reviews are moderation's job (it posts them to Slack); triage picks them up if a person publishes them later. An update from another automation does start triage: chains between different automations are allowed.

## Parameters

Ask for the channel (optional; list the Slack channels), the escalation threshold, which reviews get a reply, and the reply language in one question. Without Slack, escalated reviews still flag the run, so the owner is notified.

## Skills

Recommend Brand voice for the replies and Customer communication playbook for what the team promises when something went wrong. Without either, the replies follow the defaults in the instructions.

## Mutation policy

Keep `require_approval`: the run writes tags and a reply that a customer may read. Once the team trusts the tags, they can switch the policy to auto-approve only if `replyDraft` is a draft field nobody publishes without reading it.
