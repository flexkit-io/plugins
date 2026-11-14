# Resend

Send and track email, read inbound mail, and manage contacts, segments, broadcasts, templates, domains and webhooks, through [Resend's hosted MCP server](https://resend.com/docs/mcp-server).

When you connect Resend:

- Flexkit connects with OAuth through Resend's authorization server (`https://api.resend.com`) and calls only `https://mcp.resend.com/mcp`. The agent never sees the credential.
- The agent gets full access to the Resend team you approve, so it can send email from your verified domains. Sending email, sending or scheduling broadcasts, and creating, changing or removing anything in Resend follow your project's approval rules.
- Revoke access any time with Disconnect, or by revoking the Flexkit grant from your Resend team's authorized apps.

The `resend-email` skill teaches the agent to send only from a verified domain, confirm recipients and content before anything goes out, prefer templates and broadcasts for bulk mail, and check delivery after sending.
