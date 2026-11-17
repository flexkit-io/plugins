# Atlassian

Pinned copy of Atlassian's agent plugin. It connects agents to Jira and Confluence through the Atlassian MCP server at `https://mcp.atlassian.com/v2/mcp`, and installs five of Atlassian's skills:

- `capture-tasks-from-meeting-notes` turns action items in meeting notes into Jira tasks.
- `jira-sprint-dashboard` summarizes a sprint, board or filter.
- `search-company-knowledge` finds and explains answers across Confluence and Jira.
- `spec-to-backlog` turns a Confluence spec into epics and tickets.
- `triage-issue` checks a bug report for duplicates before filing it.

The other upstream skills are not included. They depend on a skill that is longer than Flexkit accepts, on a bundled script, or on a local code workspace.

## Connecting

Flexkit connects with OAuth through Atlassian's authorization server. It asks for read, write and search access to Jira and Confluence, Rovo search, and `offline_access` so the connection stays signed in. It does not ask to delete content or manage projects, workflows and screens; those tools are also off by default in Atlassian. The agent acts as the person who connected Atlassian, with their permissions. A project connection is shared by everyone's agent in the project. Creating or changing anything follows your project's approval rules.

**An organization admin must allow Flexkit first.** Atlassian only accepts OAuth connections from domains on its supported list, and Flexkit is not on it yet. In Atlassian Administration, open your organization, go to **Connectors → Atlassian MCP server**, choose **Add domain** and add `https://flexkit.io/plugins/oauth/mcp/callback`. Until then, connecting fails on Atlassian's side.

If your organization uses an IP allowlist for Atlassian Cloud, calls from Flexkit are blocked: Flexkit does not send requests from fixed IP addresses.

Jira Service Management tools need an Atlassian API token, so this plugin does not include them. Rovo search uses your organization's Rovo credits.

Upstream: https://github.com/atlassian/atlassian-mcp-server

Docs: https://support.atlassian.com/atlassian-rovo-mcp-server/docs/getting-started-with-the-atlassian-remote-mcp-server/
