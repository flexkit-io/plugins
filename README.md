# Flexkit Plugins

MIT-licensed, reviewed catalog of Agent Plugins 1.0.0 packages. Install and connect in Flexkit Studio → AI → Plugins. Google providers require eligible Developer Preview accounts. Slack and Teams currently provide automation delivery, not MCP messaging tools. Stripe is a pinned copy of the official agent plugin, including its skills and the remote MCP server. Shopify connects with credentials of an app the merchant creates for the store and uses an MCP server hosted by Flexkit.

## Development

Use Node 22 and pnpm 10.33.0. Run `pnpm install --frozen-lockfile`, `pnpm validate`, `pnpm typecheck`, and `pnpm test`.

Vendor copies are pinned to a full upstream commit, never loaded live. Portable schemas are unmodified copies from agent-plugins.org; provenance is in `schemas/SOURCE.json`. Vendor MIT notices remain in each package. Flexkit metadata is under `extensions["io.flexkit"]`.
