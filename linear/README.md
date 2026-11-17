# Linear

Find, create and update issues, projects, cycles, documents and comments in a Linear workspace, through [Linear's hosted MCP server](https://linear.app/docs/mcp).

When you connect Linear:

- Flexkit connects with OAuth through Linear's authorization server (`https://mcp.linear.app`) and calls only `https://mcp.linear.app/mcp`. The agent never sees the credential.
- Flexkit asks for read and write access, plus your email to label the connection. The agent acts as the person who connected Linear, with their Linear permissions, and what it creates or changes appears under their name. A personal connection is used only by your own chats and automations; a project connection is shared by everyone's agent in the project, so connect at project level only with an account the whole project may act as.
- Each connection reaches the one Linear workspace you pick on Linear's approval screen.
- Creating or changing anything in Linear follows your project's approval rules.
- Revoke access any time with Disconnect, or from your Linear account's authorized applications.

The `linear-issues` skill teaches the agent to look up teams, states, labels and people instead of guessing them, avoid duplicate issues, write issues with enough context to act on, and link the Linear issue back to the Flexkit records it concerns.
