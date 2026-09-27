import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolve } from 'node:path';
import { containedPath, stripSkillToolGrants, validateCatalog, validateSkill } from '../scripts/validate.ts';

test('all vendored and first-party plugins conform', async () => {
  assert.equal(await validateCatalog(resolve(import.meta.dirname, '..')), 7);
});
test('package containment rejects traversal and root aliases', () => {
  assert.throws(() => containedPath('/catalog/slack', '../gmail/plugin.json'));
  assert.throws(() => containedPath('/catalog/slack', '.'));
  assert.equal(containedPath('/catalog/slack', './skills/update/SKILL.md'), '/catalog/slack/skills/update/SKILL.md');
});
test('skills enforce directory identity and safe frontmatter', () => {
  validateSkill('---\nname: update\ndescription: Write an update.\n---\nContent', 'update');
  assert.throws(() => validateSkill('---\nname: different\ndescription: Text\n---\n', 'update'));
  assert.throws(() => validateSkill('---\nname: update\nname: update\ndescription: Text\n---\n', 'update'));
  assert.throws(() => validateSkill('No frontmatter', 'update'));
  assert.throws(() => validateSkill('---\nname: update\ndescription: Write an update.\nallowed-tools:\n  - Bash(stripe *)\n  - Bash(npx skills add https://docs.stripe.com *)\n---\n', 'update'), /auto-approve/);
});
test('skill publication strips host tool grants without changing the body', () => {
  const source = '---\nname: update\ndescription: Write an update.\nallowed-tools:\n  - Bash(stripe *)\n  - Bash(brew install stripe/stripe-cli/stripe)\n  - Bash(npx skills add https://docs.stripe.com *)\n---\n\nRun stripe directory search.\n';
  const published = stripSkillToolGrants(source);
  validateSkill(published, 'update');
  assert.equal(published.includes('allowed-tools'), false);
  assert.equal(published.includes('docs.stripe.com'), false);
  assert.equal(published.endsWith('\n\nRun stripe directory search.\n'), true);
  const plain = '---\nname: update\ndescription: Write an update.\n---\nContent\n';
  assert.equal(stripSkillToolGrants(plain), plain);
});
