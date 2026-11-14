# Stripe

Pinned copy of Stripe's agent plugin. It installs Stripe's integration skills and connects agents to the Stripe MCP server at `https://mcp.stripe.com`.

Upstream `allowed-tools` grants are removed before publication. Stripe CLI commands, the Stripe CLI install script (`curl -fsSL https://cli.stripe.com/install.sh | sh`), and additional skill installs stay behind the host approval prompt.

Stripe opens its OAuth consent page so you can grant access to live or sandbox accounts.

Upstream: https://github.com/stripe/ai/tree/main/providers/agent-plugins/plugin

Docs: https://docs.stripe.com/agents/plugin
