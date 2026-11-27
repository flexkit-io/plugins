# Setting up the publish announcer

## Products, articles or both

The template announces one entity. Ask which: products, articles or blog posts, or another content type the team launches. Map the fields on that entity (for an article, `title` is the headline and `summarySource` the body). To announce both, install it a second time for the other entity.

## Map the data

- `published` is required: the run must tell a draft from a live record. Map the status field (and say which values count as live), a published flag, or a published date. If the entity has no publishing state at all, every created record is live; tell the user that every new record will be announced.
- `pageUrl`: map the URL or the slug, and ask for the storefront URL so links work.

## Trigger

Entity trigger on the chosen entity with both create and update. Create alone misses the common case of a record saved as a draft and published later; the instructions skip every update that does not publish, so the extra runs post nothing.

## Parameters

The channel has no default: list the Slack channels and ask. Ask for the storefront URL, the social networks and the language in the same question.

## Mutation policy and notifications

The run never writes data; keep `require_approval` so any later extension still needs approval. The Slack post is the notification, so the notify rule is "never" to avoid notifying the owner of every launch twice.
