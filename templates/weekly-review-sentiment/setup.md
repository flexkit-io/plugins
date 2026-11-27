# Setting up the weekly review sentiment report

## Where the reviews are

Find the review entity with Search Schema. If there is none, say plainly that the report needs reviews in Flexkit: most stores collect them in a reviews app (Judge.me, Yotpo, Trustpilot), which has to send them into the project by webhook or sync. Without reviews in the project, this template cannot report on them.

## Map the data

- `rating`, `reviewText` and `reviewDate` are required. Use the date the customer wrote the review when the entity keeps one; otherwise the record's creation date.
- `sentiment` and `topic`: map them when the project has them. The report is faster and more consistent from week to week when Review moderation (or Review triage) saves the tags on every new review; offer to set up Review moderation when neither is installed. Without the fields, each run classifies the week's reviews itself.
- `reviewStatus`: map it so spam and rejected reviews are left out.
- `reviewProduct`: needed for "Products that slipped" and to name products under Criticised. Without it, those parts are left out.

## Parameters

The channel has no default: list the Slack channels and ask. Ask for the schedule, time zone, the fewest reviews for comparisons and the Linear option in the same question. A store with a handful of reviews a week can lower the minimum or move the report to monthly (for example "0 9 1 * *", changing "last week" to "last month" in the instructions).

## Linear

Optional. Offer it when the team tracks product problems in Linear. Issues are only proposed, never created without approval, and only for complaints that are new this week.

## Policy

The report only reads reviews. Keep `require_approval` so that the Linear issues, the only thing it can create, wait for a person.
