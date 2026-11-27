# Month-end accounting pack

On the 1st, prepare last month's accounting pack for {{storeName}}: CSV files of orders and refunds, a one-page PDF summary, and an email with the links to the accountant once a person approves it. "Last month" is the previous calendar month in {{timezone}}, from the 1st at 00:00 to the last day at 23:59:59. You read data and create files; you never change a record.

If a reporting-definitions skill is loaded, its definitions of revenue, refunds and exclusions win over the defaults below. Load the files and artifacts capabilities: you need record exports, a sandbox for the summary and a PDF.

## 1. Export the records

Export CSV files with Export Records, sorted by date then order number:

1. **orders-<YYYY-MM>.csv**: every order placed last month, test and cancelled orders excluded. Columns: order number, date, country, currency, net amount (total − tax − shipping), tax, shipping, total, payment method, status.
2. **refunds-<YYYY-MM>.csv**: every refund issued last month, whatever month its order is from. Columns: refund date, order number, order date, country, currency, amount, tax refunded when known, reason when known.

If an export is cut short, say so in the summary and in the email; never send a partial file as if it were complete.

## 2. Payouts (when connected)

- **Shopify**: query Shopify Payments payouts with a date in last month: date, amount, fees, status. When the query is refused for missing access, say "Shopify payouts not available: the Shopify connection lacks payout access" and continue.
- **PayPal**: list last month's sales, refunds and fees.

Compare payouts with sales paid by that method: payouts lag sales by a few days, so a difference at the start and end of the month is normal. Flag a difference larger than 2% of the month's sales by that method, with both numbers.

## 3. Check before summarising

Look for, and list, anything the accountant would ask about:
- Orders with no country or no tax amount, when the others have one.
- Orders whose total ≠ net + tax + shipping (beyond rounding).
- Refunds larger than their order, or for an order that is not in the data.
- Duplicate order numbers.
- More than one currency: report each separately, never add them up.

Flag the run when anything is listed.

## 4. The one-page summary

In a sandbox, write one self-contained HTML page and render it with Generate PDF Artifact as **summary-<YYYY-MM>.pdf**:
- Title: "{{storeName}}: sales summary for <Month YYYY>", and the date it was made.
- **Totals**: orders, gross sales (totals), net sales, tax, shipping, refunds, and sales after refunds, per currency.
- **Tax by country**: country, orders, net sales, tax; sorted by tax, largest first.
- **Payouts**: per provider, payouts and fees, with the difference to sales and whether it was flagged.
- **Points to check**: the list from step 3, or "Nothing to check."
- A footer naming the CSV files.

One page, plain tables, no charts. Numbers with two decimals and the currency code.

## 5. Email the accountant

When {{accountantEmail}} is empty or Resend is not connected, skip this step: the files stay in the run for the team to download.

Otherwise, propose one email with Resend to {{accountantEmail}}, reply-to {{replyTo}}:
- Subject: "{{storeName}}: accounts for <Month YYYY>".
- Body: three lines of totals (sales after refunds, tax, refunds), the points to check (or "No points to check this month"), and the links to the summary PDF and the two CSV files. End with: "Reply to this email with any questions."
- Never send it without approval, and never send it twice for the same month.

## 6. Report

End with the totals, the points to check, the file links and whether the email is waiting for approval.
