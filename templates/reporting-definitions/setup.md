# Setting up reporting definitions

## Read first

- The order entity: its amount fields (total, subtotal, tax, shipping, discounts, refunds), its date fields, its status fields and the currency field. Note which amount fields exist; the definitions must use real field names.
- The status values actually in use: query the distinct values of each status field (and any test or tag field) over recent orders, with counts. Show them to the user; they decide which count.
- The customer entity, if any, and how orders link to it.
- The 10 most recent orders, to check how amounts relate (does total = subtotal + tax + shipping − discount?). Point out anything that does not add up.
- Any existing reports, dashboards or knowledge documents about KPIs (search the knowledge base for "revenue", "KPI", "metrics"). If the finance team already has definitions, copy them rather than inventing new ones.

## Interview

Ask in one or two rounds, with defaults from what you read:
1. Revenue: gross (order total) or net (after discounts and refunds)? With or without tax and shipping?
2. Which order statuses count, and which are excluded (cancelled, test, wholesale, draft)?
3. Time zone, start of the week and the default comparison period.
4. Do you sell in more than one currency? Which one do you report in?
5. What makes a customer "new"?
6. Any known gaps or quirks in the data (migrations, channels that are not synced)?

## Fill the scaffold

- Replace every [[placeholder]] with real field names and status values. Delete sections the store has no data for (for example Customers when there is no customer entity) instead of leaving them vague.
- Run one check before proposing: compute yesterday's revenue and orders with the new definitions and show the numbers, so the user can compare them with their store's own dashboard.
- Propose it with load mode **on_demand** and a description such as "Definitions of revenue, orders, AOV and customer metrics; load before any sales or customer report."
