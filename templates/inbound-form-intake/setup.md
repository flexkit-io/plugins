# Setting up inbound form intake

## Map the data

- An inquiry entity (Inquiry, Lead, Request, Ticket, Message) and a contact entity (Contact, Customer, Person) are needed, with a link from inquiry to contact and an email on the contact. If the project keeps customers in a Customer entity, reuse it rather than creating a second list of people.
- If there is no inquiry entity, offer to propose one (message, type, source, received at, contact, owner, status) before continuing.
- `inquiryOwner` and `teamMember`: if the project has no entity for team members, the owner can be a plain text field with a name or team. Then the rules must name exactly what goes in that field. Without any owner field, drop step 4's assignment and post every inquiry to the channel.
- If the team member entity has a Slack user id or handle, map it so the message mentions the owner.

## Connecting the form

The trigger is a webhook. After the automation is created, give the user its URL and secret and tell them where to paste it:
- **Webflow, Framer, Squarespace and most site builders**: a form's "webhook" or "send to URL" action.
- **Typeform, Tally, Jotform, Google Forms (with an add-on)**: the webhook integration, format JSON.
- **Shopify contact form**: it does not send webhooks; suggest a form app that does.
- A custom form: POST JSON to the URL.

Ask the user to send a test submission once the automation is enabled, and offer a test run with a sample payload first.

## Parameters

Ask for the routing rules in the user's own words (suggest the default and adjust it to the team members and teams the project has), the default owner, whether to leave out spam, and the Slack channel, in one question. Read the team member entity first so you can offer real names.

## Why changes need approval

Keep `require_approval` at first. The webhook URL can be found by anyone who reads the page source, and every submission writes contact data. Approval also shows the team whether the routing rules work. Suggest auto-approve once a couple of weeks of submissions have been approved without corrections, and only if the webhook has a secret set; flagged inquiries still go to a person either way.
