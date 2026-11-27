---
name: helpscout-support
description: Search Help Scout conversations and customers, summarize support threads, draft replies, find saved replies and Docs articles, and report on support volume, response times and happiness in a connected Help Scout account. Use whenever the user asks about a support ticket, a customer's history with support, what customers are complaining about, or how the support team is doing.
---

# Working with Help Scout

The Help Scout tools act as the Help Scout user who connected, and only see the inboxes that user can see. Look up the exact tool names and parameters in the tool list; do not assume a tool exists.

The connector is read-only for most accounts: you can find, read and summarize, but you cannot reply, add notes, change tags, status or assignee, or edit Docs articles. When the user wants one of those, do the preparation (the draft reply, the note, the list of conversations to close) and tell them to apply it in Help Scout. If the tool list does include a write tool, never send a reply or change a conversation without showing the user exactly what will happen and getting their agreement first.

## Finding the right conversation

- Search by what the user gives you: the customer's email, the conversation number shown in Help Scout (`#1234`, which is not the conversation id), the subject, a tag, or a date range. Narrow to an inbox when the user names one.
- Conversations have a status (active, pending, closed, spam) and only some searches include closed ones. When nothing turns up, say which inboxes and statuses you searched, and that the connected user may not have access to the inbox it is in.
- When several conversations match, list them briefly (number, subject, customer, status, last update) and ask which one rather than guessing.
- Read the threads before summarizing. Customer messages, agent replies and internal notes are different thread types; say which is which, and never present an internal note as something the customer was told.
- Attachments show only their file names; you cannot open them. Say so when an attachment matters.

## Linking Help Scout and Flexkit

Support questions are usually about orders, products or accounts that live in Flexkit.

- Match the Help Scout customer to Flexkit records by email address first, then by name and order number mentioned in the thread. Say which record you matched and how; ask when the match is uncertain.
- Pull the facts the conversation needs from Flexkit (order status, items, shipping, payments, product details) and put them next to the customer's question.
- When an answer depends on a Flexkit record, name it and include its Flexkit link when you have one. If the project's schema has a field for a Help Scout conversation number or link, offer to save it on the record afterwards; that change follows the project's own approval rules.

## Drafting replies

- Draft in the voice of the team's earlier replies in the same conversation or inbox. Check the inbox's saved replies first and reuse the matching one, adapted to this customer.
- Base the draft on facts from the thread, from Flexkit records and from Docs articles. Do not promise refunds, replacements, discounts or delivery dates that nobody has agreed to; leave a clear placeholder for the agent to fill in instead.
- Link Docs articles by their public URL when they answer the question.
- Present the draft as text for the user to paste into Help Scout, and say which conversation it is for.

## Customer data

Conversations and customer profiles hold personal data (emails, phone numbers, addresses, order details). Quote only what the user's question needs, summarize rather than paste whole threads, and do not copy customer data into other tools or records unless the user asks.

## Reporting

Reports need a Plus or Pro plan. Ask for or state the date range and the inboxes or tags you report on. Use Help Scout's own reports for volume, first response and resolution times, replies per conversation, busiest times and happiness ratings, rather than counting conversations by hand. For "what are customers contacting us about", sample recent conversations, group them into themes with counts and an example each, and link the themes to Flexkit products or orders when they concern specific ones. Summarize; do not paste long lists of conversations.
