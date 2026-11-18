# Klaviyo

Draft email campaigns and templates, look up and update profiles, manage email and SMS consent, and report on campaigns, flows, lists, segments and events in a Klaviyo account, through [Klaviyo's hosted MCP server](https://developers.klaviyo.com/en/docs/klaviyo_mcp_server).

When you connect Klaviyo:

- You sign in to Klaviyo and approve Flexkit. Klaviyo only allows this for users with the Owner, Admin or Manager role. Klaviyo's approval screen also asks whether it may collect an anonymized summary of the kind of task you ask for; that choice is yours and does not affect Flexkit.
- Flexkit connects with OAuth through Klaviyo's authorization server (`https://mcp.klaviyo.com`) and calls only `https://mcp.klaviyo.com/mcp`, with Klaviyo's core set of about 30 tools. The agent never sees the credential.
- The agent acts as the Klaviyo user who connected, in that Klaviyo account. A personal connection is used only by your own chats and automations; a project connection is shared by everyone's agent in the project, so connect at project level only with an account the whole project may act as.
- Campaigns are created as drafts. The core tools cannot send or schedule a campaign; you review and send it in Klaviyo.
- Creating or changing anything in Klaviyo, including subscribing or unsubscribing a profile, follows your project's approval rules.
- Revoke access any time with Disconnect.

The `klaviyo-marketing` skill teaches the agent to respect consent, build campaigns from Flexkit products and content, check the audience before it drafts, and report on campaign and flow performance with the right conversion metric.
