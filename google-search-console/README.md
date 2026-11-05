# Google Search Console

Query search performance, URL indexing and sitemaps with Google Search Console.

Google hosts no MCP server for Search Console, so this plugin uses one hosted by Flexkit at `https://flexkit.io/api/mcp/google-search-console`. The server is stateless: the plugin runtime sends it the connected Google account's access token with each request, and it calls the [Search Console API](https://developers.google.com/webmaster-tools/v1/api_reference_index) with read-only access (`webmasters.readonly`).

Tools:

- `list_sites`: the properties the account can access, with its permission level.
- `query_search_analytics`: clicks, impressions, CTR and position by query, page, country, device, date, search appearance or hour.
- `inspect_url`: index status, canonical, crawl, mobile usability and rich results for one URL.
- `list_sitemaps` and `get_sitemap`: submitted sitemaps and their health.

Connect through Flexkit Studio → AI → Plugins. Auth is OAuth 2.0 against Google; credentials are stored by the platform, never in this repository. The agent sees only the properties the connected account was granted in Search Console.

Logo is the official Google Search Console product icon on a white tile, based on:
https://www.gstatic.com/images/branding/productlogos/search_console/v1/192px.svg
