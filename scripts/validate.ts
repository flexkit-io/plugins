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

export function validateSkill(text: string, directory: string): void {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);

  if (!match) {
    throw new Error('Skill needs YAML frontmatter');
  }

  const document = parseDocument(match[1], { uniqueKeys: true });

  if (document.errors.length) {
    throw new Error('Invalid skill YAML');
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

      if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[A-Za-z0-9-]{15,}/.test(text)) {
        throw new Error(`Possible credential in ${file}`);
      }

      if (file.endsWith('.svg') && /<script|<foreignObject|\bon\w+\s*=|(?:href|src)\s*=\s*["'](?:https?:|data:|javascript:)/i.test(text)) {
        throw new Error(`Unsafe SVG: ${file}`);
      }

      const skill = /^skills\/([^/]+)\/SKILL\.md$/.exec(file);

      if (skill) {
        validateSkill(text, skill[1]);
      }
    }

    if (item.source.startsWith('./third_party/')) {
      const lock = await json(resolve(packageRoot, 'io.flexkit/upstream.lock.json')) as { sha: string; repository: string; files: { [path: string]: string } };
      const provenance = ext as { upstream?: { sha?: string } };

      if (!/^[a-f0-9]{40}$/.test(lock.sha) || provenance.upstream?.sha !== lock.sha || lock.repository !== 'https://github.com/cursor/plugins') {
        throw new Error('Invalid upstream pin');
      }

      for (const [path, expected] of Object.entries(lock.files)) {
        const original = path === 'mcp.json' ? 'io.flexkit/upstream-mcp.json' : path;
        const bytes = await readFile(containedPath(packageRoot, original));

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

  const sources = await json(resolve(root, 'schemas/SOURCE.json')) as { [name: string]: { sha256: string } };

  for (const [name, source] of Object.entries(sources)) {
    const bytes = await readFile(resolve(root, `schemas/1.0.0/${name}.schema.json`));

    if (createHash('sha256').update(bytes).digest('hex') !== source.sha256) {
      throw new Error('Portable schema was modified');
    }
  }

  return seen.size;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.stdout.write(`Validated ${String(await validateCatalog(resolve(import.meta.dirname, '..')))} plugins.\n`);
}
