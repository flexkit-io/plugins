# Setting up customer win-back

## Which email plugin

Neither plugin is required, because stores send marketing email in different places:
- **Resend** sends each approved email on its own. Choose it when the team wants personal, one-to-one emails. Its domain must be verified in Resend.
- **Klaviyo** is for stores that already run their marketing there; it checks consent and adds the unsubscribe link itself. Its tools cannot send email or add profiles to a list, so the run sets the win-back details on each approved customer's profile: `win_back_date`, `win_back_products`, `win_back_product_urls` and `win_back_offer`. The team builds one flow in Klaviyo, triggered by the date property `win_back_date` (on the day), whose email uses those properties. Klaviyo's tools cannot create flows, so walk the user through it and tell them the first emails only go out once the flow is live. The personalised drafts in the run summary then serve as a starting point for the flow's email, not as the emails that go out.
- **Neither**: the run still finds the customers and drafts the emails, so the team can try it before connecting anything. Say that nothing will be sent.

Ask which the team uses. Offer Resend when they have neither and want the emails sent.

## Map the data

- `marketingConsent` is required. If the customer entity has no consent field, do not set up the template: explain that emailing people without consent breaks email law in most countries (GDPR, CAN-SPAM, CASL) and offer to add the field. Customers who bought through Shopify usually have "accepts marketing" synced.
- `orderDate` and `orderCustomer` find the lapsed customers. `orderLines` makes the email personal; without it, the email can only talk about the store in general, so say the drafts will be less specific.
- `lastWinBackAt`: offer to add this date field. Without it, the cooldown relies on automation memory alone, which works but is invisible to the team.

## Parameters

Ask for the inactivity window, the cooldown, the weekly limit, the offer and the language in one question. Suggest a weekly limit the team can actually review: 25 approvals a week is a lot for a small team. With Klaviyo, check that the flow exists or walk the user through building it.

## Mutation policy

Keep `require_approval`. Every email goes to a real customer, and a mistake cannot be unsent.
