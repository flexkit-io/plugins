# PayPal

Create and send invoices, refund payments, add shipment tracking, manage subscriptions and products, and review disputes, transactions and sales in a PayPal business account, through [PayPal's hosted MCP server](https://developer.paypal.com/tools/mcp-server/).

When you connect PayPal:

- You sign in with PayPal and approve Flexkit. Most tools are merchant features, so use a PayPal business account.
- Flexkit connects with OAuth through PayPal's authorization server (`https://mcp.paypal.com`) and calls only `https://mcp.paypal.com/mcp`, in the live PayPal environment. The agent never sees the credential.
- The agent acts as your account. Invoices it sends, refunds it issues and disputes it accepts are real and come from your business.
- Refunds, payment captures, accepted dispute claims, subscription changes and anything sent to a customer follow your project's approval rules. Review the amount and the customer before you approve.
- Revoke access any time with Disconnect, or from your PayPal account's connected apps.

The `paypal-payments` skill teaches the agent to confirm amounts, currencies and customers before money moves, avoid duplicate invoices and refunds, explain what a dispute decision means before acting on it, and link PayPal records back to the Flexkit records they concern.
