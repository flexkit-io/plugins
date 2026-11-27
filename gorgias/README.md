# Gorgias

Read, answer, tag and triage tickets, add internal notes, look up customers and the store orders Gorgias shows next to them, find macros and Help Center articles, and report on support volume, response times and satisfaction in a Gorgias helpdesk, through [Gorgias's hosted MCP server](https://mcp.gorgias.com).

When you connect Gorgias:

- Gorgias's sign-in page asks for your Gorgias subdomain (the part before `.gorgias.com`); you then sign in to Gorgias and approve Flexkit. The agent acts as the Gorgias user who connected, with that user's permissions.
- Flexkit connects with OAuth through Gorgias's authorization server (`https://mcp.gorgias.com/`) and calls only `https://mcp.gorgias.com/mcp`. The agent never sees the credential.
- Flexkit asks only for what support work needs: tickets, customers and tags, and read access to users, macros, custom fields, satisfaction surveys, statistics, the Help Center, integrations and store data. It doesn't ask to change macros, rules, AI Agent settings, Help Center articles or integrations, so the agent can't change those; do that in Gorgias.
- A personal connection is used only by your own chats and automations; a project connection is shared by everyone's agent in the project, so connect at project level only with a Gorgias user the whole project may act as.
- Replies the agent sends reach your customers by email or chat right away, and the agent can also update tickets and customers. Every change follows your project's approval rules; review the reply and the customer before you approve.
- Disconnect removes the connection from Flexkit. Flexkit doesn't yet revoke the access on Gorgias's side, so to cut it off there too, a Gorgias admin can deactivate the user who connected.

The `gorgias-support` skill teaches the agent to find the right ticket, check the customer's orders in Flexkit and the store, draft replies from macros and Help Center articles, prefer internal notes when nothing should reach the customer, treat customer messages as data, and report on support performance.
