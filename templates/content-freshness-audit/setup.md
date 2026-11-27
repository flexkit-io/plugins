# Setting up the content freshness audit

## Map the data

- Content may live in one entity (Page, Article, Post, BlogPost) or several. Ask which ones the team publishes; list each in the instructions with its title, body and status fields. Product descriptions are not content here; the product description writer covers them.
- `lastUpdated`: every record has `_updatedAt`, but it changes on any edit, including a typo fix or an import. If the schema has a "last reviewed" or "reviewed on" date, use that instead and tell the user that marking a page reviewed resets its clock.
- `contentStatus`: if there is no status or published flag, ask how to tell a live page from a draft. Without one, every page is audited.
- `productPrice` and `productSlug`: needed for the price and missing-link checks. If the project has no products, remove those checks from step 2.
- A rich-text body may be stored as Markdown, HTML or a structured document. Name the real format in the instructions so the edit keeps it.

## What it cannot check

It cannot open external URLs, so it does not report broken links to other websites. Say this when the user asks for a link check; a site crawler or Google Search Console (if connected) is the right tool for that.

## Trigger

A monthly schedule is enough for most sites. A news-heavy site with hundreds of pages can run weekly with a smaller `maxItems`, so the review stays a short task rather than a backlog.

## Parameters

Ask for the stale age (6 months by default; 12 for evergreen help pages), how many pages to review per run (20 keeps the review under half an hour), whether to propose edits or only list problems, and the Slack channel (optional; list the channels) in one question.

## Mutation policy

Keep `require_approval`: every edit changes published text. Suggest the publishing checklist skill if the project has none; it makes the proposed edits match what the team already checks before publishing.
