import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { test } from 'node:test';
import { validateTemplates } from '../scripts/validate.ts';

const repository = resolve(import.meta.dirname, '..');
const plugins = new Set(['slack', 'resend']);

function automation(overrides: { [key: string]: unknown } = {}): { [key: string]: unknown } {
  return {
    schemaVersion: 1,
    name: 'stock-check',
    kind: 'automation',
    displayName: 'Stock check',
    description: 'Checks stock.',
    category: 'catalog',
    version: '1.0.0',
    howItWorks: [{ label: 'Trigger', text: 'Every 30 minutes' }],
    plugins: [{ id: 'slack', required: true, reason: 'Posts the alert' }],
    data: [],
    parameters: [
      { key: 'threshold', label: 'Threshold', type: 'number', default: 5 },
      { key: 'channel', label: 'Channel', type: 'channel' },
    ],
    automation: {
      trigger: { type: 'poll', intervalMinutes: 30 },
      mutationPolicy: 'require_approval',
      notifyRule: 'when_flagged',
      recommendedSkills: ['voice'],
    },
    ...overrides,
  };
}

const skill = {
  schemaVersion: 1,
  name: 'voice',
  kind: 'skill',
  displayName: 'Voice',
  description: 'How we sound.',
  category: 'marketing',
  version: '1.0.0',
  howItWorks: [{ label: 'Result', text: 'A skill' }],
  plugins: [],
  data: [],
  parameters: [],
  skill: { loadMode: 'always' },
};

interface Fixture {
  index?: unknown;
  templates?: { [name: string]: { [file: string]: string | object } };
}

async function catalog(fixture: Fixture): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), 'flexkit-templates-'));
  const templates = fixture.templates ?? {
    'stock-check': { 'template.json': automation(), 'instructions.md': 'Alert when stock is at or below {{threshold}} in {{channel}}.' },
    voice: { 'template.json': skill, 'instructions.md': '# Voice\n\n[[three traits]]' },
  };

  await cp(resolve(repository, 'schemas'), join(root, 'schemas'), { recursive: true });
  await mkdir(join(root, '.flexkit-plugin'));
  await writeFile(
    join(root, '.flexkit-plugin/templates.json'),
    JSON.stringify(fixture.index ?? {
      name: 'flexkit',
      templates: Object.keys(templates).map((name) => ({ name, source: `./templates/${name}` })),
    })
  );

  for (const [name, files] of Object.entries(templates)) {
    await mkdir(join(root, 'templates', name), { recursive: true });

    for (const [file, content] of Object.entries(files)) {
      await writeFile(join(root, 'templates', name, file), typeof content === 'string' ? content : JSON.stringify(content));
    }
  }

  return root;
}

async function rejects(fixture: Fixture, message: RegExp): Promise<void> {
  const root = await catalog(fixture);

  try {
    await assert.rejects(validateTemplates(root, plugins), message);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

function withVoice(name: string, files: { [file: string]: string | object }): Fixture['templates'] {
  return { [name]: files, voice: { 'template.json': skill, 'instructions.md': '# Voice' } };
}

test('the published template catalog conforms', async () => {
  const index = JSON.parse(await readFile(resolve(repository, '.flexkit-plugin/marketplace.json'), 'utf8')) as {
    plugins: Array<{ name: string }>;
  };

  assert.equal(await validateTemplates(repository, new Set(index.plugins.map((plugin) => plugin.name))), 8);
});

test('a valid catalog passes, Finder metadata is ignored, and a missing index means no templates', async () => {
  const root = await catalog({});

  try {
    await writeFile(join(root, 'templates/.DS_Store'), '');
    await writeFile(join(root, 'templates/voice/.DS_Store'), '');
    assert.equal(await validateTemplates(root, plugins), 2);
    await rm(join(root, '.flexkit-plugin/templates.json'));
    await rm(join(root, 'templates'), { recursive: true });
    assert.equal(await validateTemplates(root, plugins), 0);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('the index rejects duplicates and sources outside templates/', async () => {
  const files = { 'template.json': skill, 'instructions.md': '# Voice' };

  await rejects(
    { index: { name: 'flexkit', templates: [{ name: 'voice', source: './templates/voice' }, { name: 'voice', source: './templates/voice' }] }, templates: { voice: files } },
    /Duplicate template in index: voice/
  );
  await rejects({ index: { name: 'flexkit', templates: [{ name: 'voice', source: './slack' }] }, templates: { voice: files } }, /Invalid template index/);
  await rejects({ index: { name: 'flexkit', templates: [] }, templates: { voice: files } }, /not in \.flexkit-plugin\/templates\.json: voice/);
});

test('a template needs its instructions and a name equal to its directory', async () => {
  await rejects({ templates: withVoice('stock-check', { 'template.json': automation() }) }, /stock-check: instructions\.md is required/);
  await rejects(
    { templates: withVoice('stock-check', { 'template.json': automation({ name: 'other' }), 'instructions.md': 'x' }) },
    /must equal its directory name/
  );
  await rejects(
    { templates: withVoice('stock-check', { 'template.json': automation(), 'instructions.md': 'x', 'notes.txt': 'x' }) },
    /unexpected file notes\.txt/
  );
  await rejects(
    { templates: withVoice('stock-check', { 'template.json': automation(), 'instructions.md': 'x'.repeat(50_001) }) },
    /instructions\.md is longer than 50000/
  );
});

test('manifests follow the schema and kind-specific sections', async () => {
  await rejects({ templates: withVoice('stock-check', { 'template.json': automation({ category: 'misc' }), 'instructions.md': 'x' }) }, /category/);
  await rejects({ templates: withVoice('stock-check', { 'template.json': automation({ extra: true }), 'instructions.md': 'x' }) }, /additional properties/);
  await rejects({ templates: withVoice('stock-check', { 'template.json': automation({ icon: 'rocket' }), 'instructions.md': 'x' }) }, /icon/);
  await rejects({ templates: withVoice('stock-check', { 'template.json': automation({ color: 'purple' }), 'instructions.md': 'x' }) }, /color/);
  await rejects({ templates: withVoice('stock-check', { 'template.json': automation({ skill: { loadMode: 'always' } }), 'instructions.md': 'x' }) }, /must NOT be valid/);
  await rejects({ templates: { voice: { 'template.json': { ...skill, skill: undefined }, 'instructions.md': 'x' } } }, /required property 'skill'/);
});

test('plugins, recommended skills, parameters and placeholders are cross-checked', async () => {
  await rejects(
    { templates: withVoice('stock-check', { 'template.json': automation({ plugins: [{ id: 'fax', required: true, reason: 'Faxes' }] }), 'instructions.md': 'x' }) },
    /plugin "fax" is not in marketplace\.json/
  );
  await rejects(
    { templates: { 'stock-check': { 'template.json': automation(), 'instructions.md': 'x' } } },
    /recommended skill "voice" is not a skill template/
  );
  await rejects(
    { templates: withVoice('stock-check', { 'template.json': automation({ parameters: [{ key: 'threshold', label: 'Threshold', type: 'number' }] }), 'instructions.md': 'x' }) },
    /required property 'default'/
  );
  await rejects(
    { templates: withVoice('stock-check', { 'template.json': automation({ parameters: [{ key: 'size', label: 'Size', type: 'select', default: 'm' }] }), 'instructions.md': 'x' }) },
    /required property 'options'/
  );
  await rejects(
    { templates: withVoice('stock-check', { 'template.json': automation({ parameters: [{ key: 'size', label: 'Size', type: 'select', default: 'xl', options: ['s', 'm'] }] }), 'instructions.md': 'x' }) },
    /default is not one of its options/
  );
  await rejects(
    { templates: withVoice('stock-check', { 'template.json': automation({ parameters: [{ key: 'threshold', label: 'Threshold', type: 'number', default: '5' }] }), 'instructions.md': 'x' }) },
    /default must be a number/
  );
  await rejects(
    { templates: withVoice('stock-check', { 'template.json': automation(), 'instructions.md': 'Post to {{slackChannel}}.' }) },
    /uses \{\{slackChannel\}\}, which is not a parameter/
  );
  await rejects(
    { templates: withVoice('stock-check', { 'template.json': automation(), 'instructions.md': 'Alert below {{low threshold}}.' }) },
    /uses \{\{low threshold\}\}, which is not a parameter/
  );
  await rejects(
    { templates: withVoice('stock-check', { 'template.json': automation({ parameters: [{ key: 'note', label: 'Note', type: 'string', default: 'x'.repeat(501) }] }), 'instructions.md': 'x' }) },
    /must NOT have more than 500 characters/
  );
});

test('templates are scanned for credentials and symlinks', async () => {
  await rejects(
    { templates: withVoice('stock-check', { 'template.json': automation(), 'instructions.md': `Use token xoxb-${'1'.repeat(20)}` }) },
    /Possible credential in templates\/stock-check\/instructions\.md/
  );

  const root = await catalog({});

  try {
    await symlink('/etc/hosts', join(root, 'templates/voice/setup.md'));
    await assert.rejects(validateTemplates(root, plugins), /symlink rejected: setup\.md/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
