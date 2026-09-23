# Flexkit Plugins

MIT-licensed, reviewed catalog of Agent Plugins 1.0.0 packages. Install and connect in Flexkit Studio → AI → Marketplace. Google providers require eligible Developer Preview accounts. Slack and Teams currently provide automation delivery, not MCP messaging tools.

## Development

Use Node 22 and pnpm 10.33.0. Run `pnpm install --frozen-lockfile`, `pnpm validate`, `pnpm typecheck`, and `pnpm test`.

Vendor copies are pinned to a full upstream commit, never loaded live. Portable schemas are unmodified copies from agent-plugins.org; provenance is in `schemas/SOURCE.json`. Vendor MIT notices remain in each package. Flexkit metadata is under `extensions["io.flexkit"]`.
