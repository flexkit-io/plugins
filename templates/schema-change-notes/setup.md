# Setting up schema change notes

## How it knows what changed

A schema deployment tells the automation only that it succeeded, with counts of entities, properties, scopes and spaces; it does not send the list of changes. The automation reads the schema after each deployment and keeps a short outline of it in its own memory, then compares the next deployment with that outline. So:
- Right after creating it, offer a test run (Run now). That first run only saves the outline, so the next real deployment already gets notes. Without it, the first deployment after setup saves the outline and posts nothing.
- Renames are inferred from a removed and an added field of the same type, and the notes say so.
- Very large schemas make a long outline; that is fine, but mention that the memory of this automation is used for it and should not be edited by hand.

## Skills and documents

It can read the project's skills and knowledge documents but not change them: it lists the ones that mention removed or renamed fields. Skills are updated from the chat or the skill editor. If the user wants a ticket for each out-of-date document and Linear is connected, offer to add a step that proposes a Linear issue (it stays behind approval).

## Parameters

Ask who reads the notes (team: plain language; developers: with field names and types), whether to check skills and documents, and the Slack channel (optional; list the channels; a #dev or #product channel is usual) in one question. No schema mapping is needed.

## Policy

It never writes data. Keep `require_approval`, so that if someone extends it to fix documents itself, each change still needs approval. Deployments that fail start nothing; the trigger is for succeeded deployments only.
