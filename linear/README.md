# Linear

Find, create and update issues, projects, cycles, documents and comments in a Linear workspace, through [Linear's hosted MCP server](https://linear.app/docs/mcp).

When you connect Linear:

- Flexkit connects with OAuth through Linear's authorization server (`https://mcp.linear.app`) and calls only `https://mcp.linear.app/mcp`. The agent never sees the credential.
- Flexkit asks for read and write access, plus your email so Studio can label the connection. The agent acts as you, with your Linear permissions, and what it creates or changes appears under your name.
- Each connection reaches one Linear workspace. To use another workspace, connect again and pick it on Linear's approval screen.
- Creating or changing anything in Linear follows your project's approval rules.
- Revoke access any time with Disconnect, or from your Linear account's authorized applications.

The `linear-issues` skill teaches the agent to look up teams, states, labels and people instead of guessing them, avoid duplicate issues, write issues with enough context to act on, and link the Linear issue back to the Flexkit records it concerns.
