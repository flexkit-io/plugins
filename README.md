# Flexkit Plugins

MIT-licensed, reviewed catalog of Agent Plugins 1.0.0 packages. Install and connect in Flexkit Studio → AI → Plugins. Google Calendar, Docs, Sheets and Slides use Google's Workspace MCP servers, which are in Developer Preview; Google Search Console and Google Analytics use MCP servers hosted by Flexkit. The Gmail, Google Drive and Google Chat packages stay in this repository but are not listed in the catalog, because they need restricted Google scopes. Slack and Teams currently provide automation delivery, not MCP messaging tools. Stripe is a pinned copy of the official agent plugin, including its skills and the remote MCP server. Shopify connects with credentials of an app the merchant creates for the store and uses an MCP server hosted by Flexkit.

## Development

Use Node 22 and pnpm 10.33.0. Run `pnpm install --frozen-lockfile`, `pnpm validate`, `pnpm typecheck`, and `pnpm test`.

Vendor copies are pinned to a full upstream commit, never loaded live. `third_party/approved.json` records, for each vendored plugin, the upstream repository and the MCP hosts a maintainer approved; validation fails if a pin update brings in another upstream, a non-https or unapproved MCP host, or a local (stdio) server. The pin updater never writes that file, so approving a new host is a reviewed, hand-made change. Portable schemas are unmodified copies from agent-plugins.org; provenance is in `schemas/SOURCE.json`. Vendor MIT notices remain in each package. Flexkit metadata is under `extensions["io.flexkit"]`.
