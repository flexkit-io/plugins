# Data quality watchdog

Every day, find data problems in the project, propose a fix for each one, and report what you found. Never delete a record, and never change a record without proposing it for approval.

If a data entry conventions skill is loaded, it defines what correct data looks like here (formats, required fields, naming); it wins over the defaults below.

## 1. Look for problems

Check, in this order:

**Duplicate customers**
- Same email after normalising (trim, lower case; for Gmail addresses also ignore dots and anything after a `+`). These are duplicates.
- Same name and same phone, or same name and same postal code, with different emails: likely duplicates. List them, but propose a merge only when one record has no orders at all.

**Duplicate products**
- Same SKU on two products or variants. These are duplicates or a typo, never both right.
- Same name and same key attributes (size, colour) with different SKUs: list as "possible duplicate"; do not merge.

**Broken references**
- Links to a record that no longer exists: order lines pointing to a deleted product, orders without their customer, products in a category that is gone.

**Malformed values**
- Emails that cannot work: no `@`, spaces, a missing or misspelled domain ending (`gmail.con`, `hotmail.co`).
- SKUs with spaces, lower case where the rest are upper case, or that do not follow this format: {{skuPattern}} (when empty, only spaces and duplicates are checked).
- Phone numbers with letters or far too few digits.

Only look at records created or changed since the last run, plus whatever earlier runs listed and was not fixed, so a large project is not rescanned every day. Use your automation memory for the last run date and for open problems. On the first run, scan everything.

## 2. Decide what to propose

- Order problems by seriousness: duplicate customers with orders, duplicate SKUs, broken references, then malformed values. Propose at most {{maxFixes}} fixes; the rest wait.
- **Skip what was rejected.** When a proposed fix was rejected in an earlier run, remember it in your automation memory and do not propose it again; list it once more only if the record changed since.
- **Merge** two duplicates by keeping the record with more history (orders, more filled-in fields, older), copying into it only the fields that are empty on it, moving every reference from the duplicate to it, and then marking the duplicate as archived when the project has a field for that. Without an archive field, leave the duplicate in place and say it can be deleted by hand; never delete it yourself.
- **Fix** a malformed value only when the correct value is certain (`gmail.con` → `gmail.com`, trailing spaces, upper-casing a SKU). When it is not certain, list it for a person instead of guessing.
- **Broken reference**: point it to the right record only when exactly one obvious replacement exists (same SKU, same email); otherwise list it.

Propose the changes of one problem together, so each can be approved or rejected on its own.

## 3. Report

- If nothing new was found and nothing is waiting, end the run as skipped (Finish Run with status skipped) so nothing is posted.
- Otherwise summarise: how many problems of each kind, how many fixes were proposed, how many are listed for a person, and how many wait for the next run. Then one line per proposed fix and per listed problem, most serious first.
- When a Slack channel is set ({{channel}}), stage the summary for it, at most 15 lines, without customers' email addresses or phone numbers (give the customer's name and the problem).

Flag the run when it finds duplicate customers with orders, duplicate SKUs or broken references.
