# Setting up the failed automation responder

## Trigger

Job trigger: job `automation_run`, outcome `failed`, `automationId` null so it watches every automation in the project. If the user only cares about a few, offer to pick one automation instead, or fill the "ignore" parameter with the noisy ones.

The instructions already tell the automation to ignore its own failures. Keep that sentence; without it, a failure of this automation could trigger itself.

## Visibility

Who can see what matters here: the responder reads other automations' runs. Create it with project visibility only if the user can manage the project's automations; a personal responder only sees and reports on runs the user can see. Mention this if the user is not a project admin.

## Data and plugins

No schema mapping is needed. Slack is optional; without it the owner is still notified through the automation's own notification (notify rule "when flagged"). If the team uses Linear and wants a ticket per new failure cause, offer to add a step that proposes a Linear issue (it stays behind approval).

## Parameters

Ask for the channel (optional; list the Slack channels), the quiet period (6 hours by default; shorter for automations that run every few minutes and matter, longer for overnight batch jobs) and any automations to ignore, in one question.

## Policy

The responder never writes data, and should not: keep `require_approval` so that, if someone later extends it to fix things itself, every fix still needs a person's approval.
