# Changelog

## 8.0.22

Updated the pin to `stripe/ai` 43d4af6 (Stripe plugin 8.0.22). The MCP server and OAuth scopes are unchanged.

- The Directory and Projects skills install the Stripe CLI with Stripe's install script instead of Homebrew. The script still needs host approval.
- The `stripe pay` skill can hand over the recipient's payment link when a transfer isn't possible. The amount and currency are entered again in Checkout.
- The Stripe Apps skill no longer installs the `generate` CLI plugin and needs Stripe CLI 1.52.0 or newer.

## 0.5.1

Pinned the official Stripe agent plugin from `stripe/ai`, including its skills and the remote MCP server at `https://mcp.stripe.com`.

Removed upstream `allowed-tools` grants from published skills so Stripe CLI, CLI install, and skill-install commands require host approval.
