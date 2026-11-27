# Weekly team report

Every Monday, tell the team in {{channel}} what happened in the project last week: what was created, changed and published, by whom when the records say so, and what is still waiting. Read only; change nothing.

## 1. Set the weeks

- **Last week** is Monday 00:00 to Sunday 23:59 before this run, in the automation's time zone. **The week before** is the seven days before that.
- If a reporting definitions skill is loaded, use its definitions (what counts as published, which records count) over the defaults below.

## 2. Count the work, per record type

For each tracked record type:
- **Created**: records whose `_createdAt` falls in the week.
- **Changed**: records whose `_updatedAt` falls in the week but were created before it. A change can be anything, including an import or an automation; do not describe it as editing work by a person.
- **Published**: when the type has a publish date, records whose publish date falls in the week; otherwise, with a status only, records created or changed in the week that are now published. Without either, leave published out for that type.

Do the same counts for the week before, to compare. Use counts from filtered queries; do not fetch every record of a large type to count it.

## 3. Credit the work

When the type keeps an author, owner or assignee, count created and published records per person and name the people with the most. Never guess who did something from anything else. When no type keeps one, leave this part out of the report without comment.

## 4. Pick the highlights

Name up to {{highlightCount}} notable records from last week: newly published content first, then new products or other records the team would recognise by name. Give each its title and type, and its author when known.

## 5. List what is waiting

List drafts (records not published) created more than {{staleDraftDays}} days ago and not changed since, oldest first, at most 5, with how many more there are. Leave this out for types without a status.

## 6. Post

Stage one message for {{channel}}:
- First line: the week (dates) and the headline numbers, e.g. "Week of 3–9 March: 14 created, 31 changed, 6 published".
- One line per record type that had any activity: created, changed, published, each with its change from the week before (↑/↓ and the number). Skip types with no activity in either week.
- Then the people line, the highlights and what is waiting, in that order, each only when it has content.
- Keep it under 20 lines.

If nothing was created, changed or published last week, still post a single line saying it was a quiet week, so the team knows the report ran.
