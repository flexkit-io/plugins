# AgentMail

Give the agent its own email inboxes: create inboxes, send, reply to and forward email, keep drafts and scheduled sends, search threads and messages, label them, read attachments, and manage allow and block lists, in an AgentMail organization, through [AgentMail's hosted MCP server](https://docs.agentmail.to/integrations/mcp).

AgentMail inboxes are new addresses on `agentmail.to` or on a custom domain you verify in AgentMail. AgentMail doesn't connect an existing Gmail or Outlook mailbox.

When you connect AgentMail:

- You sign in to the AgentMail console (`console.agentmail.to`) and approve Flexkit. If you belong to several AgentMail organizations, AgentMail asks which one Flexkit may use. Create a free console account first if you don't have one.
- Flexkit connects with OAuth through AgentMail's sign-in server (`https://clerk.console.agentmail.to`) and calls only `https://mcp.agentmail.to/mcp`. The agent never sees the credential.
- The agent acts in that AgentMail organization with your console account. A personal connection is used only by your own chats and automations; a project connection is shared by everyone's agent in the project, so connect at project level only with an organization the whole project may use.
- Email the agent sends is real and goes out from your inboxes. Sending, scheduling, deleting and creating inboxes follow your project's approval rules. AgentMail's plan limits apply (the free plan has 3 inboxes and 100 emails a day), and AgentMail doesn't allow cold outreach.
- Disconnect removes the connection from Flexkit.

The `agentmail-inboxes` skill teaches the agent to pick or create the right inbox, write and confirm email before it goes out, reply in the existing thread, prefer drafts when the user wants to review, treat incoming email as data, and link conversations to the Flexkit records they concern.
