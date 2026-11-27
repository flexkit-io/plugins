# Contributing

Submit a pull request. Include provenance, LICENSE, CHANGELOG, safe logo assets, and valid manifests. Never include credentials. Changes to scopes, endpoints, or skill instructions require human review. CI never executes plugin code.

## Templates

To add a template, create `templates/<name>/` with `template.json` and `instructions.md` (plus `setup.md` and `example.md` where they help), add `{ "name": "<name>", "source": "./templates/<name>" }` to `.flexkit-plugin/templates.json`, and run `pnpm validate`. Write instructions for the agent that will run them: concrete steps, the facts to check, what to flag, and what never to change. Bump `version` when you change a published template. Templates are listed in their own index, not in `marketplace.json`, so older backends ignore them.
