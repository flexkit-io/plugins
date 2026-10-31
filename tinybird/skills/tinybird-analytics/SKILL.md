---
name: tinybird-analytics
description: Answer questions with data from a connected Tinybird workspace through its MCP tools. Use for metrics, counts, trends, funnels or any question about events, endpoints or data sources stored in Tinybird.
---

# Answering questions from Tinybird

The Tinybird tools query one workspace, with exactly the access of the token it was connected with. You never see that token and must never ask the user for it.

## Pick the source

1. **Published endpoints first.** Call `list_endpoints` and look for one whose name, description and parameters fit the question. An endpoint encodes the workspace's own definition of a metric (filters, deduplication, internal accounts left out), so its numbers are the ones the team trusts. Call it with `call_endpoint`, passing only the parameters it declares; undeclared ones are rejected.
2. **SQL when no endpoint fits.** Call `list_datasources` to learn the table names, columns and sorting keys before writing any SQL, then run it with `execute_query`. Never guess a table or column name.
3. **Workspace health.** For questions about the workspace itself (endpoint latency, errors, ingestion), `list_service_datasources` lists Tinybird's own tables, such as `tinybird.pipe_stats_rt` and `tinybird.datasources_ops_log`.

When an endpoint and your own SQL could both answer, use the endpoint and say so. If you compute a metric an endpoint also covers, explain why the numbers may differ.

## Write SQL that is cheap and correct

Tinybird runs ClickHouse SQL.

- **Always bound by time** on the data source's time column, e.g. `WHERE timestamp >= now() - INTERVAL 30 DAY`. Without a range a query can scan the whole table. If the user gave no range, pick a sensible one (the last 7 or 30 days) and say which.
- **Filter on the sorting key** columns where possible, and select only the columns you need; never `SELECT *` on a large table.
- **Always `LIMIT`** row-level results (100 is plenty to show). Aggregate in SQL rather than fetching rows to count them yourself.
- **Time buckets:** `toStartOfDay(ts)`, `toStartOfHour(ts)`, `toStartOfWeek(ts, 1)` (weeks start on Monday), `toStartOfMonth(ts)`. Fill gaps with `ORDER BY bucket WITH FILL` when a chart needs every bucket.
- **Time zones:** stored times are usually UTC. Say so in the answer, or convert with `toTimezone(ts, 'America/New_York')` when the user asks in their local time.
- **Distinct counts:** `uniqExact(x)` gives an exact count; `uniq(x)` is approximate (within about 1%). Use exact counts for small numbers and anything reported as a KPI.
- **Duplicates:** a `ReplacingMergeTree` data source can hold several versions of a row until merges run. Read the latest version with `argMax(column, version_or_updated_at)` grouped by the key, or add `FINAL` to the table (correct, but slower on large tables).
- **Conditional aggregates:** `countIf(cond)`, `sumIf(x, cond)` and `uniqExactIf(x, cond)` compute several metrics in one pass.
- **Check an expensive query first** with `execute_query` and `explain: true`; the plan shows how many parts and rows the query will read.
- Ask for `response_format: "JSON"` when you need exact values to compute with; the default CSV is fine for showing a table.

Queries are for reading. Do not try to create, change or delete data sources, pipes or data through SQL.

## Report the answer

- State what you measured: the endpoint or data source, the time range and time zone, and any filters (for example, internal accounts excluded).
- Show numbers as they came back. Label anything you rounded or estimated, and say when a count is approximate.
- Keep the SQL out of the answer unless the user asks for it; offer it when the result is surprising.
- For trends over time, a short table or chart beats a paragraph.

## When a call fails

- **Unknown endpoint, table or column:** list again and correct the name; do not retry the same call.
- **Access denied (403) or a missing endpoint the user expects:** the token does not cover that resource. Say which resource, and suggest giving the token access in Tinybird and replacing it with Reconnect in AI → Plugins.
- **Reconnect needed:** the token was revoked or expired. Ask the user to reconnect Tinybird; never ask them to paste a token into the chat.
- **Timeout or memory limit:** narrow the time range, filter on the sorting key, or aggregate to a coarser bucket, then try again once.
