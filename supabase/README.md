# Supabase

Explore and query one Supabase project: list tables and extensions, run SQL, read logs, check the security and performance advisors, look at Edge Functions, storage and branches, and, with full access, write data, apply migrations, create branches and deploy functions, through [Supabase's hosted MCP server](https://supabase.com/docs/guides/getting-started/mcp).

When you connect Supabase:

- You choose **Read-only** or **Full access** in Flexkit first.
  - Read-only asks Supabase only for read permissions and runs Supabase's server in read-only mode, so SQL runs as a read-only database user and the tools that change things are not offered.
  - Full access adds the write permissions.
  - To change the level later, reconnect.
- You sign in to Supabase and approve Flexkit for one of your Supabase organizations.
- Back in Flexkit, you pick the project this connection works in; with a single project, Flexkit picks it for you. The agent only reaches that project. Change it later from the account's menu, or connect again to use two projects side by side. Flexkit never asks Supabase for your API keys, and the agent can't create, pause or delete projects.
- Flexkit connects with OAuth through Supabase's authorization server (`https://api.supabase.com`) and calls only `https://mcp.supabase.com/mcp` for the chosen project. The agent never sees the credential.
- The agent acts with your Supabase account in that project. A personal connection is used only by your own chats and automations; a project connection is shared by everyone's agent in the project, so connect at project level only with a project the whole Flexkit project may use, and prefer Read-only.
- Writing data, migrations, Edge Function deployments and other changes follow your project's approval rules. Supabase recommends read-only access for databases with real data, and a development project for changes.
- Disconnect removes the connection from Flexkit.

Supabase's MCP server is in beta.

The `supabase-database` skill teaches the agent to learn the schema before it queries, keep queries small and read-only unless asked, show every change before it runs, treat data in tables as data and not instructions, keep secrets out of the conversation, and link results to Flexkit records.
