# Flexkit Plugins

MIT-licensed (vendored packages keep their upstream license), reviewed catalog of Agent Plugins 1.0.0 packages. Install and connect in Flexkit Studio → AI → Plugins. Google Search Console and Google Analytics use MCP servers hosted by Flexkit. The Gmail, Google Drive, Google Chat, Google Calendar, Google Docs, Google Sheets and Google Slides packages stay in this repository but are not listed in the catalog: Gmail, Drive and Chat need restricted Google scopes, and the other Google Workspace plugins are held back until their scopes pass Google's OAuth verification. Slack and Teams currently provide automation delivery, not MCP messaging tools. Stripe and Atlassian are pinned copies of the official agent plugins, including their skills (for Atlassian, the five that work on their own in Flexkit) and remote MCP servers; `pnpm vendor <stripe|atlassian> <sha>` updates a pin. Shopify connects with credentials of an app the merchant creates for the store and uses an MCP server hosted by Flexkit.

## Development

Use Node 22 and pnpm 10.33.0. Run `pnpm install --frozen-lockfile`, `pnpm validate`, `pnpm typecheck`, and `pnpm test`.

Vendor copies are pinned to a full upstream commit, never loaded live. `third_party/approved.json` records, for each vendored plugin, the upstream repository and the MCP hosts a maintainer approved; validation fails if a pin update brings in another upstream, a non-https or unapproved MCP host, or a local (stdio) server. The pin updater never writes that file, so approving a new host is a reviewed, hand-made change. Portable schemas are unmodified copies from agent-plugins.org; provenance is in `schemas/SOURCE.json`. Vendor license notices (MIT for Stripe, Apache-2.0 for Atlassian) remain in each package. Flexkit metadata is under `extensions["io.flexkit"]`. A plugin that needs a step on the provider's side before connecting (an admin allowlist, an app to create) can declare `setupNotice` (`title`, `message`, an https `link`), shown on its page in Studio until it is connected; in an OAuth plugin's message, `{oauthCallbackUrl}` stands for the Flexkit deployment's callback URL.

## Templates

Templates are ready-made automations and skills that the Flexkit agent sets up in a project: it maps the template onto the project's schema, connects the plugins it needs, asks for its parameters and proposes the automation (created paused) or the skill. They appear in Flexkit Studio → AI → Templates.

```
.flexkit-plugin/templates.json      # the template index
templates/<name>/template.json      # manifest, validated against schemas/template.schema.json
templates/<name>/instructions.md    # automation instructions with {{parameter}} placeholders, or a skill scaffold with [[placeholder]] markers
templates/<name>/setup.md           # optional: guidance for the agent while setting the template up
templates/<name>/example.md         # optional: a sample of the output, shown on the template's page
```

The index is a separate file from `marketplace.json`, so backends that predate templates never read it and are not affected by it. `pnpm validate` checks the index (`schemas/templates.schema.json`) and every template: the name equals the directory, `instructions.md` exists, files stay within their size limits (50,000 characters for instructions, 20,000 for setup and example) with no symlinks or credentials, every plugin id is in `marketplace.json`, every recommended skill is a skill template, every `{{placeholder}}` in an automation's instructions is a parameter, and every parameter except a `channel` has a default.
