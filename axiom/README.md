# Axiom

Query your Axiom logs, traces and metrics, and manage dashboards, monitors and notifiers, through [Axiom's hosted MCP server](https://axiom.co/docs/console/intelligence/mcp-server).

Connect through Flexkit Studio → AI → Plugins, or from a connect card in chat, and sign in to Axiom:

- Flexkit connects with OAuth through Axiom's authorization server (`https://authorization.axiom.co`) and calls only `https://mcp.axiom.co/mcp`. The agent never sees the credential.
- The agent acts as your Axiom user, within the query cost limits of your Axiom role. Use a role with read access only if the agent should not change dashboards, monitors or notifiers.
- Creating, changing or deleting dashboards, monitors, notifiers or datasets follows your project's approval rules.
- Revoke access any time with Disconnect, or in Axiom under Settings → Profile → Sessions.

The `axiom-observability` skill teaches the agent to read a dataset's fields before writing APL, keep every query bounded by time, avoid APL's common pitfalls, and report the dataset and time range with every answer.

Credentials are stored by the platform, never in this repository.
