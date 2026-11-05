# Google Analytics

Report on traffic, engagement, key events and revenue with Google Analytics 4.

This plugin uses an MCP server hosted by Flexkit at `https://flexkit.io/api/mcp/google-analytics`. The server is stateless: the plugin runtime sends it the connected Google account's access token with each request, and it calls the [Google Analytics Admin API](https://developers.google.com/analytics/devguides/config/admin/v1) and [Data API](https://developers.google.com/analytics/devguides/reporting/data/v1) with read-only access (`analytics.readonly`).

Tools:

- `list_properties`: the accounts and GA4 properties the account can read, with their property IDs.
- `run_report`: metrics by dimensions over one or more date ranges, with filters, sorting and paging.
- `run_realtime_report`: activity in the last 30 minutes.
- `get_metadata`: the dimensions and metrics a property offers, including its custom definitions.
- `check_compatibility`: which dimensions and metrics can be combined in one report.

Connect through Flexkit Studio → AI → Plugins. Auth is OAuth 2.0 against Google; credentials are stored by the platform, never in this repository. The agent sees only the properties the connected account was granted in Google Analytics.

Logo is the official Google Analytics product icon on a white tile, based on:
https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg
