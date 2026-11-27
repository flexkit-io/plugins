# Setting up customer win-back

## Which email plugin

Neither plugin is required, because stores send marketing email in different places:
- **Resend** sends each approved email on its own. Choose it when the team wants personal, one-to-one emails. Its domain must be verified in Resend.
- **Klaviyo** is for stores that already run their marketing there. Its tools cannot send email, so the run adds the customers to a list and the team sends a campaign from Klaviyo. The personalised drafts then serve as a starting point, not as the emails that go out.
- **Neither**: the run still finds the customers and drafts the emails, so the team can try it before connecting anything. Say that nothing will be sent.

Ask which the team uses. Offer Resend when they have neither and want the emails sent.

## Map the data

- `marketingConsent` is required. If the customer entity has no consent field, do not set up the template: explain that emailing people without consent breaks email law in most countries (GDPR, CAN-SPAM, CASL) and offer to add the field. Customers who bought through Shopify usually have "accepts marketing" synced.
- `orderDate` and `orderCustomer` find the lapsed customers. `orderLines` makes the email personal; without it, the email can only talk about the store in general, so say the drafts will be less specific.
- `lastWinBackAt`: offer to add this date field. Without it, the cooldown relies on automation memory alone, which works but is invisible to the team.

## Parameters

Ask for the inactivity window, the cooldown, the weekly limit, the offer and the language in one question. Suggest a weekly limit the team can actually review: 25 approvals a week is a lot for a small team. With Klaviyo, also ask which list to add customers to.

## Mutation policy

Keep `require_approval`. Every email goes to a real customer, and a mistake cannot be unsent.
