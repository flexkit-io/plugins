---
name: resend-email
description: Send, schedule and track email through a connected Resend team, read inbound mail, and manage its contacts, segments, broadcasts, templates, domains and webhooks. Use whenever the user wants to email someone, check whether an email was delivered, run a campaign, or change anything in Resend.
---

# Working with Resend

The Resend tools act on the Resend team the user approved, with full access. You never see their credential. Email you send leaves under the user's domain and cannot be recalled, so be deliberate.

## Before sending anything

1. **Sender:** `from` must be an address on a domain the team has verified. Call `list-domains` and use a domain whose status is `verified`; never invent a sender domain. If none is verified, say so and stop (or offer `create-domain`, which returns the DNS records the user must add, then `verify-domain`). Use the address the user asked for, otherwise ask which one to send from.
2. **Recipients and content:** restate who receives the message (to, cc, bcc), the subject and a short summary of the body before the first send in a conversation, unless the user already gave all three exactly. Never add recipients the user did not name.
3. **One message vs. many:** `send-email` for a single message (up to 50 recipients, all of whom see each other in `to`), `send-batch-emails` for up to 100 individually addressed messages. For a newsletter or announcement to a list, use a **broadcast** to a segment instead (see below), so unsubscribes and topics are honoured.
4. **Format:** pass both `html` and `text` when you write HTML. Keep HTML email-safe: inline styles, tables for layout, no scripts or external CSS. `send-email` takes the content itself; it cannot send a stored template. To reuse a template's wording, read it with `get-template` and send its HTML with the values filled in.
5. **Scheduling:** `send-email`'s `scheduledAt` accepts natural language such as "tomorrow at 9am ET" or ISO 8601; state the time zone you assumed. `update-email` reschedules, but only with an ISO 8601 time (for example `2026-11-15T09:00:00-05:00`), and `cancel-email` cancels a scheduled email that has not gone out.
6. **Retries:** pass an `idempotencyKey` when you might retry a send, so a retry never sends twice.

## After sending

- `list-emails` and `get-email` show status (`delivered`, `bounced`, `complained`, `delayed`…). Report the email id and status; do not claim delivery until the status says so.
- `get-email-metrics` gives sending totals and rates over a period; `get-usage` shows quota.
- A bounced or complained address belongs on the suppression list (`list-suppressions`, `add-suppression`); check it before re-sending to an address that failed.

## Inbound mail and inboxes

- `list-received-emails` / `get-received-email` read mail received on the team's receiving domains; attachments via `list-received-email-attachments` and `get-received-email-attachment`.
- Mail sent with `send-email` never appears in an inbox. To write from an inbox address so the message and its replies stay in one thread, use `send-new-inbox-email`.
- Inboxes hold conversations: `list-inboxes`, then `list-inbox-threads` (exact filters) or `search-inbox-threads` (text search), `get-inbox-thread`. Reply with `reply-to-inbox-thread-email`, so the reply stays in the thread. When the user wants to review before sending, write a draft (`create-inbox-draft`) and send it only when they say so (`send-inbox-draft`).
- To get a thread out of the way, archive it with `update-inbox-thread` (folder `archive`) rather than removing it.

## Contacts, segments and broadcasts

- Contacts are team-wide; `segments` group them and `topics` hold subscription preferences. Find ids with `list-contacts`, `list-segments` and `list-topics`; never guess them.
- For more than a handful of contacts, use `create-contact-import` with CSV `content` or a `url` (not `filePath`, which the hosted server cannot read) instead of creating contacts one by one. The import runs in the background; check it with `get-contact-import`.
- A broadcast needs `from`, `subject`, content and a `segmentId`. Create it with `create-broadcast`. To give it content the user can keep editing in the Resend editor, call `get-tiptap-json-content` and then `compose-broadcast` on that broadcast, building on the content it returned (skipping the read overwrites everything). Then call `get-broadcast` to check every field and show the user the segment name, its size if known, the subject and the send time. Only then call `send-broadcast`. A sent broadcast cannot be unsent; a scheduled one can be cancelled with `cancel-broadcast`.
- Personalise with the contact placeholders Resend supports (for example `{{{FIRST_NAME|there}}}`, with a fallback), and keep the unsubscribe link (`{{{RESEND_UNSUBSCRIBE_URL}}}`) in marketing mail.

## Templates

- Templates are reusable designs stored in Resend (the `send-email` tool here cannot send one by id); `create-template` takes HTML with `{{{VARIABLE}}}` placeholders. Declare each variable (up to 50), except the built-in `FIRST_NAME`, `LAST_NAME`, `EMAIL` and `RESEND_UNSUBSCRIBE_URL`, which are always available and fail validation if declared. A template is used only once published (`publish-template`), and edits to a published template go live only after publishing again.
- Prefer `compose-template` (after `get-tiptap-json-content`) for content changes to a template built in the Resend editor; `update-template` with `html` overwrites editor content and loses formatting, so ask first.

## Changing the account

Anything that creates, changes or removes something follows the project's approval rules, and some cannot be undone. Confirm with the user, naming the object, before you:

- remove a domain (sending from it stops at once), a contact, segment, topic, template, broadcast, inbox (with all its threads) or webhook;
- create, change or remove an API key, or rotate a webhook signing secret (whatever uses the old one breaks);
- revoke an OAuth grant (`revoke-oauth-grant`). Revoking Flexkit's own grant disconnects this plugin.

Never put an API key or webhook secret that a tool returns into a reply unless the user asked to see it, and tell them it is shown only once.

## Debugging

`list-logs` and `get-log` show the team's API requests with request and response bodies. Use them when a send or webhook fails, and quote the error message Resend returned. Webhook deliveries are in `list-webhook-events` and `list-webhook-event-attempts`; `replay-webhook-event` resends one.
