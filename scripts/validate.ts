import { createHash } from 'node:crypto';
import { readFile, readdir, lstat } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Ajv2020 } from 'ajv/dist/2020.js';
import { parseDocument } from 'yaml';

export function containedPath(root: string, path: string): string {
  const full = resolve(root, path);
  const rel = relative(root, full);

  if (!rel || rel.startsWith(`..${sep}`) || rel === '..' || rel.startsWith(sep)) {
    throw new Error(`Path escapes package: ${path}`);
  }

  return full;
}

export function isPublishedSkill(path: string): boolean {
  return /^skills\/[^/]+\/SKILL\.md$/.test(path);
}

export function upstreamSkillSnapshot(path: string): string {
  return `io.flexkit/upstream/${path}.upstream`;
}

export function stripSkillToolGrants(text: string): string {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);

  if (!match) {
    return text;
  }

  const document = parseDocument(match[1], { uniqueKeys: true });

  if (document.errors.length || !document.has('allowed-tools')) {
    return text;
  }

  document.delete('allowed-tools');
  const newline = text.includes('\r\n') ? '\r\n' : '\n';
  const frontmatter = document.toString().replace(/\r?\n$/, '').replace(/\n/g, newline);
  const body = text.slice(match[0].length);

  return `---${newline}${frontmatter}${newline}---${body}`;
}

/** What a maintainer approved for a vendored plugin, kept in third_party/approved.json, which the pin updater never writes. */
export interface ThirdPartyApproval {
  upstream: string;
  mcpHosts: string[];
}

const remoteServerTypes = new Set(['http', 'streamable-http', 'sse']);

function isApproval(value: unknown): value is ThirdPartyApproval {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const { upstream, mcpHosts } = value as { upstream?: unknown; mcpHosts?: unknown };

  return (
    typeof upstream === 'string' &&
    /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(upstream) &&
    !upstream.includes('/..') &&
    Array.isArray(mcpHosts) &&
    mcpHosts.every((host) => typeof host === 'string' && /^[a-z0-9-]+(?:\.[a-z0-9-]+)+(?::\d{1,5})?$/.test(host))
  );
}

/**
 * Fails unless a vendored plugin comes from its approved upstream and every MCP server it declares, in any
 * package file with `mcpServers`, is a remote server at an https URL on an approved host. A local (stdio)
 * server would run upstream code on the user's machine, so it is never accepted from a vendored plugin.
 */
export function checkThirdPartyApproval(
  name: string,
  approval: unknown,
  repository: string,
  mcpConfigs: Array<{ file: string; config: unknown }>
): void {
  if (!isApproval(approval)) {
    throw new Error(`${name}: missing or invalid entry in third_party/approved.json`);
  }

  if (repository !== approval.upstream) {
    throw new Error(`${name}: upstream ${repository} is not the approved ${approval.upstream}`);
  }

  for (const { file, config } of mcpConfigs) {
    const servers = (config as { mcpServers?: unknown } | null)?.mcpServers;

    if (!servers || typeof servers !== 'object') {
      throw new Error(`${name}: ${file} has no mcpServers`);
    }

    for (const [server, definition] of Object.entries(servers)) {
      const fields = (definition && typeof definition === 'object' ? definition : {}) as { [key: string]: unknown };

      if (!remoteServerTypes.has(fields.type as string) || ['command', 'args', 'env', 'cwd'].some((key) => key in fields)) {
        throw new Error(`${name}: MCP server "${server}" in ${file} is not a remote server`);
      }

      const raw = fields.url;
      let url: URL | undefined;

      try {
        url = typeof raw === 'string' ? new URL(raw) : undefined;
      } catch {
        url = undefined;
      }

      if (!url || url.protocol !== 'https:' || url.username || url.password || !approval.mcpHosts.includes(url.host)) {
        throw new Error(`${name}: MCP server "${server}" in ${file} is not an https URL on an approved host`);
      }
    }
  }
}

/** Where a vendored package keeps the upstream bytes of a file the pin updater adapts. */
function pinnedUpstreamPath(path: string): string {
  if (path === 'mcp.json') {
    return 'io.flexkit/upstream-mcp.json';
  }

  if (path === 'plugin.json') {
    return 'io.flexkit/upstream-plugin.json';
  }

  return path;
}

function isEnoent(error: unknown): boolean {
  return Boolean(error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT');
}

async function readIfPresent(path: string): Promise<Buffer | undefined> {
  try {
    return await readFile(path);
  } catch (error) {
    if (!isEnoent(error)) {
      throw error;
    }
  }

  return undefined;
}

async function pinnedFileBytes(packageRoot: string, path: string): Promise<Buffer> {
  const snapshotPath = isPublishedSkill(path) ? upstreamSkillSnapshot(path) : '';
  const snapshot = snapshotPath ? await readIfPresent(containedPath(packageRoot, snapshotPath)) : undefined;

  if (!snapshot) {
    return readFile(containedPath(packageRoot, pinnedUpstreamPath(path)));
  }

  const published = await readFile(containedPath(packageRoot, path), 'utf8');

  if (published !== stripSkillToolGrants(snapshot.toString('utf8'))) {
    throw new Error(`Vendored skill transform drifted: ${path}`);
  }

  return snapshot;
}

export function validateSkill(text: string, directory: string): void {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);

  if (!match) {
    throw new Error('Skill needs YAML frontmatter');
  }

  const document = parseDocument(match[1], { uniqueKeys: true });

  if (document.errors.length) {
    throw new Error('Invalid skill YAML');
  }

  if (document.has('allowed-tools')) {
    throw new Error('Skill cannot auto-approve host tools');
  }

  const fields: unknown = document.toJS();

  if (!fields || typeof fields !== 'object' || !('name' in fields) || !('description' in fields)) {
    throw new Error('Skill name and description are required');
  }

  if (fields.name !== directory || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(directory) || directory.length > 64) {
    throw new Error('Skill name must match its directory');
  }

  if (typeof fields.description !== 'string' || !fields.description.trim() || fields.description.length > 1024) {
    throw new Error('Invalid skill description');
  }
}

/** Fails when a catalog file looks like it contains a private key or a Slack token. */
export function checkNoCredential(text: string, file: string): void {
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[A-Za-z0-9-]{15,}/.test(text)) {
    throw new Error(`Possible credential in ${file}`);
  }
}

async function json(path: string): Promise<unknown> {
  return JSON.parse(await readFile(path, 'utf8')) as unknown;
}

async function walk(root: string, prefix = ''): Promise<string[]> {
  const files: string[] = [];

  for (const entry of await readdir(resolve(root, prefix))) {
    const path = prefix ? `${prefix}/${entry}` : entry;
    const stat = await lstat(resolve(root, path));

    if (stat.isSymbolicLink()) {
      throw new Error(`Catalog symlink rejected: ${path}`);
    }

    if (stat.isDirectory()) {
      files.push(...await walk(root, path));
      continue;
    }

    if (!stat.isFile() || stat.size > 1_000_000) {
      throw new Error(`Invalid package file: ${path}`);
    }

    files.push(path);
  }

  return files;
}

export async function validateCatalog(root: string): Promise<number> {
  const ajv = new Ajv2020({ allErrors: true, strict: false, validateFormats: false });
  const validateManifest = ajv.compile(await json(resolve(root, 'schemas/1.0.0/plugin.schema.json')) as object);
  const validateExtension = ajv.compile(await json(resolve(root, 'schemas/io.flexkit.schema.json')) as object);
  const validateMcp = ajv.compile(await json(resolve(root, 'schemas/1.0.0/mcp.schema.json')) as object);
  const index = await json(resolve(root, '.flexkit-plugin/marketplace.json')) as {
    name: string; plugins: Array<{ name: string; source: string; description: string }>;
  };
  const approvals = await json(resolve(root, 'third_party/approved.json'));

  if (!approvals || typeof approvals !== 'object' || Array.isArray(approvals)) {
    throw new Error('third_party/approved.json must be an object keyed by plugin name');
  }

  const vendored = new Set<string>();
  const seen = new Set<string>();

  if (index.name !== 'flexkit' || !Array.isArray(index.plugins)) {
    throw new Error('Invalid marketplace index');
  }

  for (const item of index.plugins) {
    if (seen.has(item.name) || !item.source.startsWith('./')) {
      throw new Error('Duplicate plugin or non-local source');
    }

    seen.add(item.name);
    const packageRoot = containedPath(root, item.source);
    const manifest = await json(resolve(packageRoot, 'plugin.json'));

    if (!validateManifest(manifest)) {
      throw new Error(`${item.name}: ${ajv.errorsText(validateManifest.errors)}`);
    }

    const typed = manifest as { name: string; extensions?: { [key: string]: unknown } };
    const ext = typed.extensions?.['io.flexkit'];

    if (typed.name !== item.name || !validateExtension(ext)) {
      throw new Error(`Invalid Flexkit extension or name: ${ajv.errorsText(validateExtension.errors)}`);
    }

    const files = await walk(packageRoot);

    for (const file of files) {
      const text = await readFile(containedPath(packageRoot, file), 'utf8');

      checkNoCredential(text, file);

      if (file.endsWith('.svg') && /<script|<foreignObject|\bon\w+\s*=|(?:href|src)\s*=\s*["'](?:https?:|data:|javascript:)/i.test(text)) {
        throw new Error(`Unsafe SVG: ${file}`);
      }

      const skill = /^skills\/([^/]+)\/SKILL\.md$/.exec(file);

      if (skill) {
        validateSkill(text, skill[1]);
      }
    }

    const provenance = ext as { upstream?: { sha?: string; repository?: string } };

    // Vendored by location or by provenance, so a vendored copy listed elsewhere still needs an approval.
    if (item.source.startsWith('./third_party/') || provenance.upstream !== undefined) {
      vendored.add(item.name);
      const lock = await json(resolve(packageRoot, 'io.flexkit/upstream.lock.json')) as { sha: string; repository: string; files: { [path: string]: string } };
      if (
        !/^[a-f0-9]{40}$/.test(lock.sha) ||
        provenance.upstream?.sha !== lock.sha ||
        provenance.upstream?.repository !== lock.repository
      ) {
        throw new Error('Invalid upstream pin');
      }

      // Every JSON file that declares MCP servers, wherever upstream put it (mcp.json, .mcp.json, plugin.json…).
      const mcpConfigs: Array<{ file: string; config: unknown }> = [];

      for (const file of files.filter((path) => path.endsWith('.json'))) {
        const config = await json(resolve(packageRoot, file));

        if (config && typeof config === 'object' && 'mcpServers' in config) {
          mcpConfigs.push({ file, config });
        }
      }

      checkThirdPartyApproval(
        item.name,
        Object.hasOwn(approvals, item.name) ? (approvals as { [name: string]: unknown })[item.name] : undefined,
        lock.repository,
        mcpConfigs
      );

      for (const [path, expected] of Object.entries(lock.files)) {
        const bytes = await pinnedFileBytes(packageRoot, path);

        if (createHash('sha256').update(bytes).digest('hex') !== expected) {
          throw new Error(`Vendored file changed outside the pin updater: ${path}`);
        }
      }
    }

    if (!files.includes('LICENSE') || !files.includes('CHANGELOG.md')) {
      throw new Error('License and changelog required');
    }

    if (files.includes('mcp.json') && !validateMcp(await json(resolve(packageRoot, 'mcp.json')))) {
      throw new Error(`${item.name}: ${ajv.errorsText(validateMcp.errors)}`);
    }
  }

  const stale = Object.keys(approvals).filter((name) => !vendored.has(name));

  if (stale.length) {
    throw new Error(`third_party/approved.json lists plugins that are not vendored: ${stale.join(', ')}`);
  }

  const sources = await json(resolve(root, 'schemas/SOURCE.json')) as { [name: string]: { sha256: string } };

  for (const [name, source] of Object.entries(sources)) {
    const bytes = await readFile(resolve(root, `schemas/1.0.0/${name}.schema.json`));

    if (createHash('sha256').update(bytes).digest('hex') !== source.sha256) {
      throw new Error('Portable schema was modified');
    }
  }

  await validateTemplates(root, seen);

  return seen.size;
}

const templateFiles = new Map([
  ['template.json', 100_000],
  ['instructions.md', 50_000],
  ['setup.md', 20_000],
  ['example.md', 20_000],
]);

interface TemplateManifest {
  name: string;
  kind: 'automation' | 'skill';
  plugins: Array<{ id: string }>;
  parameters: Array<{ key: string; type: string; default?: unknown; options?: string[] }>;
  automation?: { recommendedSkills: string[] };
}

function checkParameters(name: string, parameters: TemplateManifest['parameters']): void {
  const keys = new Set<string>();

  for (const parameter of parameters) {
    if (keys.has(parameter.key)) {
      throw new Error(`template ${name}: duplicate parameter "${parameter.key}"`);
    }

    keys.add(parameter.key);

    // The schema already requires a default (except for "channel") and options for "select".
    if (parameter.default === undefined) {
      continue;
    }

    const expected = parameter.type === 'number' ? 'number' : parameter.type === 'boolean' ? 'boolean' : 'string';

    if (typeof parameter.default !== expected) {
      throw new Error(`template ${name}: parameter "${parameter.key}" default must be a ${expected}`);
    }

    if (parameter.type === 'select' && !parameter.options?.includes(parameter.default as string)) {
      throw new Error(`template ${name}: parameter "${parameter.key}" default is not one of its options`);
    }
  }
}

/**
 * Validates the template catalog: `.flexkit-plugin/templates.json` and every `templates/<name>/` it lists.
 * The index is a separate file from marketplace.json so backends that predate templates never read it; a
 * repository without one has no templates. Returns the number of templates.
 */
export async function validateTemplates(root: string, pluginIds: ReadonlySet<string>): Promise<number> {
  const indexPath = resolve(root, '.flexkit-plugin/templates.json');
  const raw = await readIfPresent(indexPath);

  if (!raw) {
    return 0;
  }

  const ajv = new Ajv2020({ allErrors: true, strict: false, validateFormats: false });
  const validateIndex = ajv.compile(await json(resolve(root, 'schemas/templates.schema.json')) as object);
  const validateManifest = ajv.compile(await json(resolve(root, 'schemas/template.schema.json')) as object);
  let index: unknown;

  try {
    index = JSON.parse(raw.toString('utf8'));
  } catch {
    throw new Error('.flexkit-plugin/templates.json is not valid JSON');
  }

  if (!validateIndex(index)) {
    throw new Error(`Invalid template index: ${ajv.errorsText(validateIndex.errors)}`);
  }

  const items = (index as { templates: Array<{ name: string; source: string }> }).templates;
  const manifests = new Map<string, TemplateManifest>();

  for (const item of items) {
    if (manifests.has(item.name)) {
      throw new Error(`Duplicate template in index: ${item.name}`);
    }

    if (item.source !== `./templates/${item.name}`) {
      throw new Error(`template ${item.name}: source must be ./templates/${item.name}`);
    }

    const templateRoot = containedPath(root, item.source);
    const stat = await lstat(templateRoot).catch((error: unknown) => {
      if (isEnoent(error)) {
        throw new Error(`template ${item.name}: ${item.source} does not exist`);
      }

      throw error;
    });

    if (stat.isSymbolicLink() || !stat.isDirectory()) {
      throw new Error(`template ${item.name}: ${item.source} must be a directory, not a symlink`);
    }

    const files = await walk(templateRoot);
    const texts = new Map<string, string>();

    for (const file of files) {
      const limit = templateFiles.get(file);

      if (limit === undefined) {
        throw new Error(`template ${item.name}: unexpected file ${file} (allowed: ${[...templateFiles.keys()].join(', ')})`);
      }

      const text = await readFile(resolve(templateRoot, file), 'utf8');

      if (text.length > limit) {
        throw new Error(`template ${item.name}: ${file} is longer than ${String(limit)} characters`);
      }

      checkNoCredential(text, `templates/${item.name}/${file}`);
      texts.set(file, text);
    }

    for (const required of ['template.json', 'instructions.md']) {
      if (!texts.get(required)?.trim()) {
        throw new Error(`template ${item.name}: ${required} is required`);
      }
    }

    let manifest: unknown;

    try {
      manifest = JSON.parse(texts.get('template.json') as string);
    } catch {
      throw new Error(`template ${item.name}: template.json is not valid JSON`);
    }

    if (!validateManifest(manifest)) {
      throw new Error(`template ${item.name}: ${ajv.errorsText(validateManifest.errors)}`);
    }

    const typed = manifest as TemplateManifest;

    if (typed.name !== item.name) {
      throw new Error(`template ${item.name}: name "${typed.name}" must equal its directory name`);
    }

    for (const plugin of typed.plugins) {
      if (!pluginIds.has(plugin.id)) {
        throw new Error(`template ${item.name}: plugin "${plugin.id}" is not in marketplace.json`);
      }
    }

    checkParameters(item.name, typed.parameters);

    if (typed.kind === 'automation') {
      const keys = new Set(typed.parameters.map((parameter) => parameter.key));

      for (const [, placeholder] of (texts.get('instructions.md') as string).matchAll(/\{\{\s*([^}\s]+)\s*\}\}/g)) {
        if (!keys.has(placeholder)) {
          throw new Error(`template ${item.name}: instructions.md uses {{${placeholder}}}, which is not a parameter`);
        }
      }
    }

    manifests.set(item.name, typed);
  }

  for (const [name, manifest] of manifests) {
    for (const skill of manifest.automation?.recommendedSkills ?? []) {
      if (manifests.get(skill)?.kind !== 'skill') {
        throw new Error(`template ${name}: recommended skill "${skill}" is not a skill template in the index`);
      }
    }
  }

  const directories = await readdir(resolve(root, 'templates')).catch((error: unknown) => {
    if (isEnoent(error)) {
      return [];
    }

    throw error;
  });
  const unlisted = directories.filter((entry) => !manifests.has(entry));

  if (unlisted.length) {
    throw new Error(`templates/ has entries that are not in .flexkit-plugin/templates.json: ${unlisted.join(', ')}`);
  }

  return manifests.size;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = resolve(import.meta.dirname, '..');
  const plugins = await validateCatalog(root);
  const index = await json(resolve(root, '.flexkit-plugin/marketplace.json')) as { plugins: Array<{ name: string }> };
  const templates = await validateTemplates(root, new Set(index.plugins.map((plugin) => plugin.name)));
  process.stdout.write(`Validated ${String(plugins)} plugins and ${String(templates)} templates.\n`);
}
