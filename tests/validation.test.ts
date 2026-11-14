import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolve } from 'node:path';
import { checkThirdPartyApproval, containedPath, stripSkillToolGrants, validateCatalog, validateSkill } from '../scripts/validate.ts';

test('all vendored and first-party plugins conform', async () => {
  assert.equal(await validateCatalog(resolve(import.meta.dirname, '..')), 14);
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
test('vendored plugins need an approved upstream and approved MCP hosts', () => {
  const approval = { upstream: 'https://github.com/stripe/ai', mcpHosts: ['mcp.stripe.com'] };
  const repository = 'https://github.com/stripe/ai';
  const config = (url: string) => [{ file: 'mcp.json', config: { mcpServers: { stripe: { type: 'streamable-http', url } } } }];

  checkThirdPartyApproval('stripe', approval, repository, config('https://mcp.stripe.com'));
  checkThirdPartyApproval('stripe', approval, repository, []);
  assert.throws(() => checkThirdPartyApproval('stripe', undefined, repository, []), /approved\.json/);
  assert.throws(() => checkThirdPartyApproval('stripe', { upstream: repository }, repository, []), /approved\.json/);
  assert.throws(() => checkThirdPartyApproval('stripe', approval, 'https://github.com/someone/fork', []), /not the approved/);

  for (const url of [
    'https://mcp.evil.example',
    'http://mcp.stripe.com',
    'https://mcp.stripe.com.evil.example',
    'https://mcp.stripe.com@evil.example',
    'https://user@mcp.stripe.com',
    'https://mcp.stripe.com:8443',
    'not a url',
  ]) {
    assert.throws(() => checkThirdPartyApproval('stripe', approval, repository, config(url)), /approved host/, url);
  }

  const stdio = [{ file: 'io.flexkit/upstream-mcp.json', config: { mcpServers: { local: { type: 'stdio', command: 'node' } } } }];
  assert.throws(() => checkThirdPartyApproval('stripe', approval, repository, stdio), /approved host/);
  assert.throws(() => checkThirdPartyApproval('stripe', approval, repository, [{ file: 'mcp.json', config: {} }]), /no mcpServers/);
});
