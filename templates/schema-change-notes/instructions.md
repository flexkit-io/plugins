# Schema change notes

A schema deployment of this project just succeeded. Write release notes that tell the team what changed in the data model and what it means for their work. Read only; change nothing.

## 1. Read what you have

- The trigger payload carries the deployment as `job`: its id and a short `summary` with counts (entities, properties, scopes, spaces). It does not carry the list of changes.
- Read the schema as it is now with Search Schema: every entity with its fields (name, type, whether it is required, what it links to).
- Your automation memory holds the **schema outline** you saved after the previous deployment: one line per entity with its fields and types.

When the run has no `job` in its payload (someone pressed Run now), or the memory has no outline yet, there is nothing to compare with: save the current outline (step 4), end the run as skipped (Finish Run with status skipped) with "Saved the schema outline; the next deployment gets release notes", and stop.

## 2. Work out the changes

Compare the current schema with the saved outline:
- **Added**: entities and fields that are new.
- **Removed**: entities and fields that are gone. When a removed field and an added field on the same entity have the same type and a similar name (`colour` → `color`, `price` → `basePrice`), call it a **likely rename** and say it is inferred.
- **Changed**: a field whose type changed, that became required or optional, or whose link points to a different entity.

If nothing differs (a deployment that changed only scopes, spaces or Studio settings), say so in one line, using the counts from the payload, save the outline, and post that line only.

## 3. Write the notes ({{audience}})

- Open with one sentence that says what the deployment was about, when the changes have an obvious theme ("Adds product reviews").
- Then **New**, **Changed** and **Removed** sections, each only when it has entries. One line per change.
- For the team: describe each change in terms of the work ("Products now have a Care instructions field", "Orders can no longer be saved without a shipping method"). For developers: also give the entity and field names and the type (`Product.careInstructions: String`).
- Call out anything that can break work: removed or renamed fields, fields that became required (existing records without a value may fail to save), changed types. Put those first, under **Heads up**.

## 4. Save the outline

Update your automation memory with the current schema outline, replacing the previous one: one line per entity, `Entity: field (Type, required), field (Type → LinkedEntity)…`. Keep nothing else about the schema in memory. Without this step the next deployment cannot be compared.

## 5. Check skills and documents (when checking is on: {{checkKnowledge}})

For each removed or renamed field and entity:
- Search the project's knowledge documents for its name, and read the project's skills that are about the affected entity.
- List each skill or document that still mentions it, with the line that does. Do not edit them: a person updates skills and documents. Say which change makes each one out of date.

## 6. Post

When a Slack channel is set ({{channel}}), stage the notes for it, under 25 lines; a long deployment lists the first entries of each section and says how many more there are. The full notes are the run's summary.
