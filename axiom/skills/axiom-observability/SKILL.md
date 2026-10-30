---
name: axiom-observability
description: Investigate errors, logs, traces and metrics in a connected Axiom organization through its MCP tools, and manage its dashboards and monitors. Use for incidents, error rates, latency, slow requests, failing jobs, or any question about events stored in Axiom.
---

# Working with Axiom

The Axiom tools act as the user who connected Axiom, within their role's permissions and query cost limits. You never see their credential.

## Find the data first

1. **`listDatasets`** to see what exists. Event and trace datasets are queried with APL; metrics datasets with MPL.
2. **`getDatasetFields`** before writing APL against an events or traces dataset. Never guess a field name: fields differ per dataset, nested fields use dots (`['attributes.http.status_code']`), and a field that is missing makes the whole query fail.
3. For metrics: `listMetrics`, `listMetricTags` and `getMetricTagValues`, then `queryMetrics`.
4. `getSavedQueries`, `listDashboards` and `checkMonitors` show what the team already tracks; a saved query or a monitor's query (`getMonitor`) is often the right starting point.

## Write APL that is cheap and correct

Run APL with `queryDataset`. Every query costs against the user's limits, so keep it narrow.

- **Always bound by time first:** `['dataset'] | where _time > ago(1h) | ...`. If the user gave no range, pick one (the last hour for an incident, the last 7 days for a trend) and say which.
- **Filter early, project late:** put `where` clauses right after the time filter, then `project` only the fields you show. Never return raw events without `take` (100 is plenty).
- **Aggregate in APL:** `summarize count() by bin(_time, 5m), service` instead of fetching events to count them. `bin_auto(_time)` picks a bucket for the range.
- **Percentiles:** `percentile(duration, 95)`; averages hide slow outliers.
- **Field names with dots or dashes** must be quoted: `['service.name']`.
- **Text search:** `where message contains "timeout"` (case-insensitive) or `has` for whole terms, which is cheaper; `search "timeout"` scans every field and is the most expensive.

Known pitfalls:

- `min(_time)` and `max(_time)` return epoch **nanoseconds**, not timestamps. Use `bin(_time, 1d)` or `format_datetime` to show dates.
- There is no `any()` aggregation; use `arg_max(_time, *)` for the latest event per group.
- `count()` and `arg_max()` together in one `summarize` can fail. Split them into two queries or two `summarize` steps.
- A field that only some events have still has to exist in the dataset; use `column_ifexists('field', '')` when unsure.

When a query fails, read the error, fix the query (usually a field name or a missing time filter) and try once more. Do not retry the same query.

## Report the answer

- State the dataset, the time range (and that times are UTC unless you converted them) and the filters you applied.
- Lead with the finding (what is failing, since when, how often), then the evidence: a few representative error messages, counts per service or endpoint, and the trend.
- For trends over time, a short table or chart beats a paragraph.
- Keep APL out of the answer unless the user asks; offer it when they may want to save it as a query or a monitor.

## Changing dashboards, monitors and notifiers

Creating, updating or deleting a dashboard, monitor, notifier or dataset changes the team's Axiom organization and follows the project's approval rules.

- Read the current definition first (`getDashboard`, `exportDashboard`, `getMonitor`, `listNotifiers`) and change only what was asked.
- Before creating a monitor, run its query with `queryDataset` over a recent range to show how often it would have fired, and propose a threshold based on that.
- Never delete a dashboard, monitor or notifier the user did not name explicitly.
- `sendFeedback` sends text to Axiom: use it only when the user asks.

## When a call fails

- **Reconnect needed:** the session was revoked or expired. Ask the user to reconnect Axiom; never ask for a token in the chat.
- **Permission denied:** the user's Axiom role does not allow it. Say which action, and that an Axiom admin can change the role.
- **Query cost limit reached:** stop querying, tell the user, and suggest a narrower time range or dataset.
