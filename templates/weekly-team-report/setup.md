# Setting up the weekly team report

## What it can and cannot read

The report is built from the project's records. Every record has `_createdAt` and `_updatedAt` timestamps, so created and changed counts always work. Everything else depends on the schema:
- **Who did the work** needs an author, owner, createdBy or assignee field on the record. Flexkit does not keep a per-record edit history an automation can read, so without such a field the report has no people line. Say so, and offer a schema change only if the team wants credit in the report.
- **Published** needs a status, a published flag or a published date. Without them, drop published from the report for that type.
- **Pending approvals** of other automations and chats are not readable from an automation, so they are not in the report. If the user asks for them, point them to the Activity page in Studio.

## Map the data

- Ask which record types the team works on and wants in the report; suggest the ones with the most `_updatedAt` activity in the last month. Leave out types that only automations or imports write (order lines, logs, sync tables): their counts drown the team's own work.
- For each type, map its title or name field (for highlights), its status or published date if any, and its author or owner field if any. Write them into the instructions per type.

## Parameters

The channel has no default: list the Slack channels and ask. Ask for the day and time (Monday 9:00 by default), the time zone, how many highlights to name and when a draft counts as waiting, in the same question.

## Policy

The report never writes data. Keep `require_approval` so that, if someone later extends it to fix what it finds, every change still needs approval. Suggest the reporting definitions skill when the team argues about what counts: it keeps this report and the sales digest consistent.
