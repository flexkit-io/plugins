import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolve } from 'node:path';
import { containedPath, validateCatalog, validateSkill } from '../scripts/validate.ts';

test('all vendored and first-party plugins conform', async () => {
  assert.equal(await validateCatalog(resolve(import.meta.dirname, '..')), 6);
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
});
