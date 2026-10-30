# Tinybird

Query your Tinybird workspace: list endpoints and data sources, call endpoints and run SQL, through [Tinybird's hosted MCP server](https://www.tinybird.co/docs/forward/query-data/mcp).

Connect through Flexkit Studio → AI → Marketplace and paste a Tinybird token. Tinybird's MCP server does not support OAuth, so the plugin uses a token instead of a sign-in:

- Flexkit checks the token with Tinybird before saving it, stores it encrypted and sends it only to `https://mcp.tinybird.co`. The agent can use the tools but never sees the token; Studio shows only its last four characters.
- The agent gets exactly the access the token has. Create a token with read access to the data sources and pipes the agent should query (see [Tinybird tokens](https://www.tinybird.co/docs/forward/administration/tokens)); an admin token also exposes the workspace's other tools.
- Replace the token with Reconnect, or remove it with Disconnect. A token Tinybird rejects marks the connection as needing a reconnect.

The `tinybird-analytics` skill teaches the agent to prefer published endpoints, read the schema before writing SQL, keep queries time-bounded and cheap, and report the time range and source with every answer.

Credentials are stored by the platform, never in this repository.
