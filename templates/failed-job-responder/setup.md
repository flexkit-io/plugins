# Setting up the failed automation responder

## Pick the automation to watch

The responder watches one automation. Call `listAutomations`, show the user the project's automations (name, trigger, whether it is enabled) and ask which one to watch, in the same question as the parameters below. Put the chosen automation's id in the trigger's `automationId`; the trigger is job `automation_run`, outcome `failed`. Name the new automation after it, for example "When Daily sales digest fails".

To watch another automation, install the template again and pick that one. Suggest it for the automations that matter most (anything that writes data or that the team relies on every day) rather than for every automation.

Do not pick the responder itself or another responder: a failure would then start a responder run that reports on a responder.

## Visibility

The responder reads the watched automation's runs. A personal responder can only watch an automation the user can see; if the user is not a project admin, mention that project automations they cannot manage will not appear in the list.

## Data and plugins

No schema mapping is needed. Slack is optional; without it the owner is still notified through the automation's own notification (notify rule "when flagged"). If the team uses Linear and wants a ticket per new failure cause, offer to add a step that proposes a Linear issue (it stays behind approval).

## Parameters

Ask for the automation to watch, the channel (optional; list the Slack channels) and the quiet period (6 hours by default; shorter for an automation that runs every few minutes and matters, longer for an overnight batch job) in one question.

## Policy

The responder never writes data, and should not: keep `require_approval` so that, if someone later extends it to fix things itself, every fix still needs a person's approval.
