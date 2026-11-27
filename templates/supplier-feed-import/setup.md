# Setting up the supplier feed import

## How the feed gets here

The trigger is a webhook. Flexkit cannot fetch a file or a URL on a schedule: something has to POST the feed to the automation's URL. Tell the user this plainly and help them pick a source:
- The supplier's portal or EDI system, if it can send stock or price updates to a URL.
- An integration tool they already use (Zapier, Make, n8n, a small script) that downloads the supplier's CSV or feed URL on a schedule and posts it.
- Posting by hand: anyone can send the file's contents to the URL with a single command when a new price list arrives.

After the automation is created, give the user its URL and secret. Ask for a sample of the feed (a few rows) and run a test with it before switching the automation on, so the column names are known. Write the real column names into step 1.

The payload has a size limit; very large feeds (tens of thousands of rows) should be sent in chunks of a few thousand rows, each as its own request.

## Map the data

- `sku` is required. If the supplier uses its own item codes, map `supplierSku` and set `matchBy` to "supplier item code". Without either, the feed cannot be matched: stop and say so.
- `stock`, `cost`, `price`: map the ones the store keeps. If the store keeps stock per location, ask which location the supplier's stock goes to, or whether the feed is the supplier's availability rather than the store's stock (then map it to a separate field, or leave stock out).
- `supplier`: map it when products are linked to suppliers, and set `supplierName`, so one supplier's feed cannot change another supplier's products.

## Skills

Offer `data-entry-conventions`: its SKU format and units make matching and the written values consistent with how the team enters data.

## Mutation policy

Keep `require_approval`. A feed is outside data: a wrong column, a currency change or a malformed file would rewrite stock and costs across the catalog. Once the user has approved several imports without corrections, they may switch to auto-approve for stock-only imports (`updatePrices` off); recommend keeping approval whenever selling prices are updated.

## Parameters

Ask for the supplier, how rows are matched, whether to update selling prices, the call-out threshold and the optional Slack channel in one question. `notifyRule` is `always`: every import produces a report.
