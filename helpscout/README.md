# Help Scout

Search and summarize conversations, look up customers, check inboxes, saved replies, users, teams and workflows, read Docs articles, and pull company, conversation, productivity and happiness reports in a Help Scout account, through [Help Scout's hosted MCP server](https://docs.helpscout.com/article/1779-connect-your-ai-agent-with-help-scout-to-search-conversations-and-pull-reports).

When you connect Help Scout:

- You sign in to Help Scout and approve Flexkit. Help Scout allows this on the Standard, Plus and Pro plans, for Users and Administrators with API access; Light Users can't connect. Reports need Plus or Pro, and Docs articles are available only when a Help Scout Docs API key is added to the connection on Help Scout's side.
- Flexkit connects with OAuth through Help Scout's authorization server (`https://mcp.helpscout.net`) and calls only `https://mcp.helpscout.net/mcp`. The agent never sees the credential.
- The agent acts as the Help Scout user who connected and sees only the inboxes that user can see. A personal connection is used only by your own chats and automations; a project connection is shared by everyone's agent in the project, so connect at project level only with a user whose inboxes the whole project may read.
- Help Scout's connector is read-only for most accounts: the agent can find and summarize conversations and draft replies for you to send, but it can't reply to customers, add notes, change tags or edit Docs articles. It also can't open attachment files. A few accounts from Help Scout's MCP beta kept write tools; for those, replies and changes follow your project's approval rules.
- Disconnect removes the connection from Flexkit. Help Scout doesn't list these connections, so to cut off access on Help Scout's side too, an administrator can turn off the user's API access.

The `helpscout-support` skill teaches the agent to find the right conversation and customer, link them to the Flexkit orders and records they concern, summarize threads without exposing more customer data than needed, draft replies in your tone, and report on support volume, response times and happiness.
