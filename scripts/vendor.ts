import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, unlink } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { containedPath, isPublishedSkill, stripSkillToolGrants, upstreamSkillSnapshot, validateSkill } from './validate.ts';

/** A vendored upstream plugin: where it comes from, which files are taken, and the Flexkit metadata added to its manifest. */
interface Upstream {
  /** GitHub `owner/repo`. */
  repo: string;
  /** Package directory in the upstream repository; '' is the repository root. */
  upstreamPath: string;
  localPath: string;
  /** Which upstream files (relative to `upstreamPath`) are vendored. The repository LICENSE is always added. */
  include: (file: string) => boolean;
  extension: (repository: string, upstreamPath: string, sha: string) => { [key: string]: unknown };
}

/**
 * Atlassian skills that work on their own in Flexkit. The others need the
 * `teamwork-graph-context` skill (longer than Flexkit admits), a bundled
 * script, or a local code workspace.
 */
const atlassianSkills = [
  'capture-tasks-from-meeting-notes',
  'jira-sprint-dashboard',
  'search-company-knowledge',
  'spec-to-backlog',
  'triage-issue',
];

const upstreams: { [name: string]: Upstream } = {
  stripe: {
    repo: 'stripe/ai',
    upstreamPath: 'providers/agent-plugins/plugin',
    localPath: 'third_party/stripe',
    include: () => true,
    extension: (repository, path, sha) => ({
      schemaVersion: 1,
      displayName: 'Stripe',
      logo: './assets/logo.svg',
      category: 'payments',
      supportedScopes: ['project', 'personal'],
      requiredInputs: [],
      capabilities: { agentTools: true, automationDelivery: false },
      auth: {
        type: 'mcp-oauth',
        provider: 'stripe',
        credentialGroup: 'stripe',
        requiredScopes: [],
        mcpServers: ['stripe'],
      },
      availability: 'preview',
      upstream: { repository, path, sha },
    }),
  },
  atlassian: {
    repo: 'atlassian/atlassian-mcp-server',
    upstreamPath: '',
    localPath: 'third_party/atlassian',
    // The logo (assets/logo.svg) is Flexkit's own catalog tile, not the upstream file.
    include: (file) =>
      file === 'plugin.json' ||
      file === 'mcp.json' ||
      atlassianSkills.some((skill) => file.startsWith(`skills/${skill}/`)),
    extension: (repository, path, sha) => ({
      schemaVersion: 1,
      displayName: 'Atlassian',
      logo: './assets/logo.svg',
      category: 'productivity',
      supportedScopes: ['project', 'personal'],
      requiredInputs: [],
      capabilities: { agentTools: true, automationDelivery: false },
      auth: {
        type: 'mcp-oauth',
        provider: 'mcp',
        credentialGroup: 'atlassian',
        // Jira, Confluence and Rovo search, with offline_access for a refresh token. Deleting,
        // project management and the other Atlassian products stay out until they are needed.
        requiredScopes: [
          'read:me',
          'read:account',
          'offline_access',
          'read:jira:agent-interface',
          'write:jira:agent-interface',
          'search:jira:agent-interface',
          'read:confluence:agent-interface',
          'write:confluence:agent-interface',
          'search:confluence:agent-interface',
          'search:rovo:agent-interface',
        ],
        mcpServers: ['atlassian'],
      },
      availability: 'preview',
      // Atlassian's consent screen only says the account has no supported site when Flexkit is not allowed.
      setupNotice: {
        title: 'An Atlassian admin must allow Flexkit first',
        message:
          'Atlassian only accepts connections from apps your organization allows. Before you connect, an organization admin adds {oauthCallbackUrl} under Atlassian Administration → Connectors → Atlassian MCP server.',
        link: {
          label: "Read Atlassian's guide",
          url: 'https://support.atlassian.com/security-and-access-policies/docs/understand-atlassian-mcp-server/',
        },
      },
      upstream: { repository, path, sha },
    }),
  },
};

const [name, sha] = process.argv.slice(2);
const upstream = name === undefined ? undefined : upstreams[name];

if (!name || !upstream || !sha || !/^[a-f0-9]{40}$/.test(sha)) {
  throw new Error(`Usage: pnpm vendor <${Object.keys(upstreams).join('|')}> <full-upstream-sha>`);
}

const { repo, upstreamPath, localPath } = upstream;
const repository = `https://github.com/${repo}`;
const rawBase = `https://raw.githubusercontent.com/${repo}/${sha}`;
const packageBase = upstreamPath ? `${rawBase}/${upstreamPath}` : rawBase;
const prefix = upstreamPath ? `${upstreamPath}/` : '';

interface UpstreamManifest {
  homepage?: string;
  repository?: string;
  keywords?: string[];
  extensions?: { [namespace: string]: unknown };
}

interface McpConfig {
  $schema?: string;
  mcpServers: { [name: string]: { type: string; url: string } };
}

function isEnoent(error: unknown): boolean {
  return Boolean(error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT');
}

async function unlinkIfPresent(path: string): Promise<void> {
  try {
    await unlink(path);
  } catch (error) {
    if (!isEnoent(error)) {
      throw error;
    }
  }
}

async function publishVendoredSkill(packageRoot: string, file: string, content: string): Promise<void> {
  const published = stripSkillToolGrants(content);
  const directory = /^skills\/([^/]+)\/SKILL\.md$/.exec(file)?.[1];

  if (!directory) {
    throw new Error(`Invalid skill path: ${file}`);
  }

  validateSkill(published, directory);
  await writeFile(resolve(packageRoot, file), published);
  const snapshot = containedPath(packageRoot, upstreamSkillSnapshot(file));

  if (published === content) {
    await unlinkIfPresent(snapshot);

    return;
  }

  await mkdir(dirname(snapshot), { recursive: true });
  await writeFile(snapshot, content);
}

/** Decodes a text file without changing a byte: invalid UTF-8 is rejected and a BOM is kept, so the lock hash still matches. */
function decodeText(bytes: Buffer, file: string): string {
  try {
    return new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);
  } catch {
    throw new Error(`Upstream file is not valid UTF-8: ${file}`);
  }
}

function flexkitManifest(content: string, pin: string, plugin: Upstream): string {
  const manifest = JSON.parse(content) as UpstreamManifest;

  if (manifest.keywords !== undefined && !Array.isArray(manifest.keywords)) {
    throw new Error('Upstream manifest keywords changed');
  }

  manifest.homepage = `https://github.com/flexkit-io/plugins/tree/main/${plugin.localPath}`;
  manifest.repository = 'https://github.com/flexkit-io/plugins';
  manifest.keywords = [...new Set([...(manifest.keywords ?? []), 'flexkit'])];
  manifest.extensions = { 'io.flexkit': plugin.extension(repository, upstreamPath, pin) };

  return `${JSON.stringify(manifest, null, 2)}\n`;
}

const root = resolve(import.meta.dirname, '..', localPath);
const treeResponse = await fetch(`https://api.github.com/repos/${repo}/git/trees/${sha}?recursive=1`, {
  redirect: 'error',
  signal: AbortSignal.timeout(30_000),
});

if (!treeResponse.ok) {
  throw new Error(`Unable to read the pinned ${name} tree`);
}

const tree = (await treeResponse.json()) as {
  truncated: boolean;
  tree: Array<{ path: string; type: string; mode: string; sha: string; size?: number }>;
};

if (tree.truncated || !Array.isArray(tree.tree)) {
  throw new Error(`Incomplete ${name} tree`);
}

const selected = tree.tree.filter((entry) => {
  const file = entry.path.slice(prefix.length);

  // The repository LICENSE is fetched separately below, even when the package is the repository root.
  return entry.path.startsWith(prefix) && entry.type !== 'tree' && file !== 'LICENSE' && upstream.include(file);
});

if (
  selected.length > 300 ||
  selected.some((entry) => entry.mode === '120000' || entry.type !== 'blob' || (entry.size ?? 0) > 1_000_000)
) {
  throw new Error('Unsafe upstream package tree');
}

const files: { [path: string]: string } = {};
let previousFiles: { [path: string]: string } = {};

try {
  const previous = JSON.parse(await readFile(resolve(root, 'io.flexkit/upstream.lock.json'), 'utf8')) as {
    files: { [path: string]: string };
  };
  previousFiles = previous.files;
} catch (error) {
  if (!isEnoent(error)) {
    throw error;
  }
}

for (const entry of selected) {
  const file = entry.path.slice(prefix.length);
  containedPath(root, file);
  const response = await fetch(`${packageBase}/${file}`, {
    redirect: 'error',
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(`Upstream returned ${String(response.status)} for ${file}`);
  }

  // Hash and write the raw bytes: decoding as text corrupts binary files such as PNG assets.
  const bytes = Buffer.from(await response.arrayBuffer());

  // Check the download against the tree's git blob id, independently of the lock hash written below.
  if (createHash('sha1').update(`blob ${String(bytes.length)}\0`).update(bytes).digest('hex') !== entry.sha) {
    throw new Error(`Upstream bytes do not match the pinned tree for ${file}`);
  }

  files[file] = createHash('sha256').update(bytes).digest('hex');
  await mkdir(dirname(resolve(root, file)), { recursive: true });

  if (file === 'plugin.json') {
    const content = decodeText(bytes, file);
    await mkdir(resolve(root, 'io.flexkit'), { recursive: true });
    await writeFile(resolve(root, 'io.flexkit/upstream-plugin.json'), content);
    await writeFile(resolve(root, file), flexkitManifest(content, sha, upstream));
    continue;
  }

  if (file === 'mcp.json') {
    const content = decodeText(bytes, file);
    const mcp = JSON.parse(content) as McpConfig;
    let adapted = content;

    for (const server of Object.values(mcp.mcpServers)) {
      if (server.type !== 'http' && server.type !== 'streamable-http') {
        throw new Error('Upstream transport changed; manual adaptation required');
      }

      if (server.type !== 'streamable-http') {
        server.type = 'streamable-http';
        adapted = `${JSON.stringify(mcp, null, 2)}\n`;
      }
    }

    await mkdir(dirname(resolve(root, 'io.flexkit/upstream-mcp.json')), { recursive: true });
    await writeFile(resolve(root, 'io.flexkit/upstream-mcp.json'), content);
    await writeFile(resolve(root, file), adapted);
    continue;
  }

  if (isPublishedSkill(file)) {
    await publishVendoredSkill(root, file, decodeText(bytes, file));
    continue;
  }

  await writeFile(resolve(root, file), bytes);
}

const licenseResponse = await fetch(`${rawBase}/LICENSE`, {
  redirect: 'error',
  signal: AbortSignal.timeout(30_000),
});

if (!licenseResponse.ok) {
  throw new Error(`Unable to read the ${name} license`);
}

const license = Buffer.from(await licenseResponse.arrayBuffer());
files.LICENSE = createHash('sha256').update(license).digest('hex');
await writeFile(resolve(root, 'LICENSE'), license);

for (const file of Object.keys(previousFiles)) {
  if (file in files) {
    continue;
  }

  await unlink(containedPath(root, file));

  if (isPublishedSkill(file)) {
    await unlinkIfPresent(containedPath(root, upstreamSkillSnapshot(file)));
  }
}

await mkdir(resolve(root, 'io.flexkit'), { recursive: true });
await writeFile(
  resolve(root, 'io.flexkit/upstream.lock.json'),
  `${JSON.stringify({ repository, sha, path: upstreamPath, files, transformVersion: 2 }, null, 2)}\n`
);
