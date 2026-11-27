# Setting up seasonal campaign prep

## One automation per occasion

Each copy of this template prepares one occasion. Ask which occasion to start with (offer Black Friday, Christmas, Valentine's Day, Mother's Day, back to school, summer sale) and suggest installing the template again for the others. Name the automation after the occasion, for example "Black Friday campaign prep".

## Schedule

Work out the cron from the occasion date and the lead time: a fixed date, once a year, at 09:00 in the team's time zone. For Black Friday (about 27 November) and 4 weeks: `0 9 30 10 *`. For Christmas (12-25) and 6 weeks: `0 9 13 11 *`. For occasions that move (Black Friday, Easter, Mother's Day), schedule on the earliest likely date minus the lead time; the run works out the real date and says when the schedule should move.

The automation starts paused. Suggest a test run now: it drafts this year's campaign straight away, which is the quickest way to judge the output.

## Map the data

- `productName` is all the template strictly needs. `productStock` and `orderLines` make the picks much better; without order data, tell the user the picks are based on category fit only.
- `campaignPage`: map it when the project has a page, landing-page or campaign entity. Without one, the drafts stay in the run summary (and in Klaviyo when connected).

## Parameters

Ask for the occasion, its date, the lead time, the number of products, the offer and the language in one question. The offer matters: tell the user the drafts never mention a discount they did not enter here.

## Plugins

Klaviyo is optional. Its tools create campaigns as drafts and cannot send them, which suits this template: the team picks the audience and sends from Klaviyo.

## Mutation policy

Keep `require_approval`: the run creates records and Klaviyo drafts, and the team should see them before they appear.
