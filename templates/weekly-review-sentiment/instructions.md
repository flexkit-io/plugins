# Weekly review sentiment report

Every week, tell the team what customers said in their reviews: how it compares with the weeks before, what they loved and complained about most, and what is new. Read reviews only; never change them.

## 1. Collect the reviews

- **Last week**: reviews written from Monday 00:00 to Sunday 23:59 in {{timezone}} before this run.
- **The four weeks before** it, for comparison.
- Leave out reviews whose status is spam or rejected. Keep held and pending ones: they are real customer feedback even when they are not public.
- When there are no reviews last week, post one line ("No new reviews last week.") and stop.

## 2. Sentiment and topic for each review

Use the saved sentiment and topic when a review has them (review moderation and review triage save them). For reviews without them, decide yourself, the same way:
- **Sentiment**: positive, mixed or negative, from the text first and the stars second.
- **Topic**: product quality, sizing and fit, delivery, customer service, price and value, description accuracy, other.

Do not save the tags you work out here: this report only reads.

## 3. Work out the numbers

- Number of reviews, average rating (one decimal), and the share of positive, mixed and negative reviews, for last week and for the four-week average before it. Show the change ("4.3★, down from 4.6").
- With fewer than {{minimumReviews}} reviews last week, skip the percentages and the comparison, which mean little at that size, and list each review in one line instead.

## 4. Find what matters

- **Most praised**: up to 3 topics with the most positive reviews. For each, one specific thing customers said (not "quality is good" but "the canvas survives rain") and one short quote, under 20 words.
- **Most criticised**: up to 3 topics with the most negative or mixed reviews, the same way. Name the products involved.
- **Products that slipped**: products with at least 3 reviews last week whose average rating is at least 1 star lower than in the previous four weeks, or whose share of negative reviews rose by 25 points or more.
- **New**: a specific complaint that appears in 2 or more reviews last week and did not come up in the previous four weeks ("zip pull snaps off", "colour runs in the wash"). Keep a short list of last week's specific complaints in your automation memory, to compare against next week.

Quote customers exactly, cut long quotes with "…", and never include a reviewer's surname, email, phone or order number.

## 5. Post to Slack

Stage one message for {{channel}}:
- First line: the week, the number of reviews and the average rating with its change, e.g. "Reviews, 3–9 March: 42 reviews, 4.4★ (4.6 the four weeks before)".
- One line with the sentiment split and its change.
- **Praised**, **Criticised**, **Slipped** and **New** as short sections. Leave out a section with nothing in it.
- At most 20 lines in all.

## 6. New complaints in Linear (only when proposing issues is on: {{proposeIssues}})

Skip this step when it is off or Linear is not connected. For each item under **New**, propose one Linear issue: the complaint as the title, the products, the number of reviews, and two or three quotes. Before proposing, search Linear for an open issue about the same complaint, and skip it when one exists. Every issue waits for approval.
