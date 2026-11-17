---
name: linear-issues
description: Find, create and update Linear issues, projects, cycles, documents and comments in a connected Linear workspace. Use whenever the user wants to file a bug or task, turn Flexkit findings into issues, check the status of work, plan a cycle or project, or comment on an issue.
---

# Working with Linear

The Linear tools act in the one workspace that was approved when Linear was connected, as the Linear user who connected it and with their permissions. That may be a teammate rather than the person you are talking to, when the connection is shared by the project. Everything you create or change appears under that Linear user's name and notifies their teammates, so be deliberate. Look up the exact tool names and parameters in the tool list; do not assume a tool exists.

## Look things up, never guess

- Issues belong to a **team**. When the user does not name one, list the teams and ask, unless there is only one.
- Workflow states (such as Todo, In Progress, Done), labels, projects, cycles and people are per workspace or per team. Find them with the matching list tools and use the exact names or ids they return. Do not invent a label or state; if the one the user wants does not exist, say so and ask before creating it.
- Refer to issues by their identifier (for example `ENG-123`) and include the issue URL the tools return, so the user can open it.
- "My issues" or "assigned to me" means the connected Linear user. If the connection may belong to someone else, check who it is before filtering by "me".

## Before creating an issue

1. **Avoid duplicates:** search for open issues with similar titles or keywords in the same team first. If one exists, show it and offer to comment on it or update it instead.
2. **Write it to be acted on:** a short, specific title; a description in Markdown with what happened or what is needed, why it matters, and the evidence (record names, values, dates, links). Do not paste long data dumps; summarize and link.
3. **Set only what the user asked for or clearly implied:** team, and when known, assignee, priority, labels, project, cycle, due date. Do not assign people or set priority on your own.
4. **Restate before the first create in a conversation:** the team, title and a one-line summary, unless the user already gave them exactly. For several issues at once, list them all and create them only after the user agrees.

## Linking Flexkit and Linear

When an issue concerns Flexkit records (a product, an order, a supplier, a document), name the records in the description, and include their Flexkit links when you have them. If the project's schema has a field for an issue link or reference, offer to save the issue URL on the record afterwards; that change follows the project's own approval rules.

## Updating and commenting

- Read the issue first, then change only the fields the user asked about. Moving an issue to a completed or canceled state, reassigning it or changing its priority notifies people; confirm with the user unless they asked for exactly that.
- Add new information as a **comment** rather than rewriting the description, unless the user asks you to edit the description.
- Never remove or archive an issue, project or document unless the user asks for that exact one by name.

## Reporting on work

For status questions ("what is open for the launch?", "what did the team finish this cycle?"), filter by team, project, cycle, state, assignee or date instead of listing everything, and summarize: counts by state, what is blocked or overdue, and the issues that need attention, each with its identifier and link.
