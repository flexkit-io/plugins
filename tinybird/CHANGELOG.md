# Changelog

## 1.0.1

Accept Tinybird JWTs as well as static tokens. Tinybird's MCP server lists and calls endpoints for admin tokens and JWTs, not static resource-scoped tokens, so a JWT scoped to `PIPES:READ` on the endpoints the agent should use is the way to give it read-only access. The skill sends users to AI → Plugins, the Studio section's actual name, to reconnect.

## 1.0.0

Initial Flexkit plugin, with the `tinybird-analytics` skill.
