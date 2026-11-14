# Google Chat

Read spaces and messages, send messages, and manage read state and notification settings in Google Chat.

Connects agents to [Google Chat](https://chat.google.com) through Google's remote [Model Context Protocol](https://modelcontextprotocol.io/) server at `https://chatmcp.googleapis.com/mcp/v1`. Requires an eligible Google Developer Preview account.

Google requires a Chat app configured in the Google Cloud project that owns the OAuth client (Google Chat API → Configuration) before the server accepts calls; see the setup guide below.

Auth is OAuth 2.0 against Google.

## Docs

- Google MCP setup: https://developers.google.com/workspace/chat/api/guides/configure-mcp-server
- Workspace MCP overview: https://developers.google.com/workspace/guides/configure-mcp-servers

Logo is the official Google Chat product icon on a white tile, based on:
https://www.gstatic.com/images/branding/productlogos/chat_2026/v1/192px.svg
