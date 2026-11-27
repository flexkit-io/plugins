# Setting up the data quality watchdog

## Map the data

- Ask which entities matter most. Customers and products are the usual pair; a B2B project may care about companies and contacts instead. Map the fields each check needs; leave out a check whose fields the project does not have, and remove it from step 1.
- `references`: list the links worth checking, with both ends, e.g. order → customer, order line → product, product → category. Write them into step 1.
- `archiveFlag`: merges leave the duplicate behind. If no entity has an archived, hidden or status field, merges still move references and fill gaps, and the duplicate is listed for deletion by hand. Offer a schema change for an archive flag if the user wants merges to finish on their own.
- Read a sample of SKUs before asking about the SKU format, and offer the pattern you see ("three letters, a dash, a colour code, a dash, a size").

## Why a daily schedule, not a poll

A poll trigger starts a run when one GraphQL query's result changes. Duplicates and broken references are found by comparing records with each other (normalised emails, the same SKU on two records, links whose target is gone), which no single query returns. A daily sweep also gathers the day's fixes into one review instead of one approval card per changed record. A large catalogue that changes a lot can run twice a day; a quiet one weekly.

## Parameters

Ask for the time (6:00 by default, before the team starts), the time zone, the SKU format, how many fixes to propose per run (25 keeps the review short; lower it for the first run, which scans everything) and the Slack channel (optional; list the channels) in one question.

## Mutation policy

Keep `require_approval`. Merges move orders between customers and cannot be undone with one click. Suggest the data entry conventions skill if the project has none: with it, the watchdog checks the team's own rules instead of generic ones, and new data is entered right in the first place.
