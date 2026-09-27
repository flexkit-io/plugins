import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, unlink } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { containedPath } from './validate.ts';

const sha = process.argv[2];
const repository = 'https://github.com/stripe/ai';
const upstreamPath = 'providers/agent-plugins/plugin';
const localPath = 'third_party/stripe';

if (!sha || !/^[a-f0-9]{40}$/.test(sha)) {
  throw new Error('Usage: pnpm vendor:stripe <full-upstream-sha>');
}

interface StripeManifest {
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

function flexkitManifest(upstream: string, pin: string): string {
  const manifest = JSON.parse(upstream) as StripeManifest;

  if (manifest.keywords !== undefined && !Array.isArray(manifest.keywords)) {
    throw new Error('Upstream manifest keywords changed');
  }

  manifest.homepage = 'https://github.com/flexkit-io/plugins/tree/main/third_party/stripe';
  manifest.repository = 'https://github.com/flexkit-io/plugins';
  manifest.keywords = [...new Set([...(manifest.keywords ?? []), 'flexkit'])];
  manifest.extensions = {
    'io.flexkit': {
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
      upstream: { repository, path: upstreamPath, sha: pin },
    },
  };

  return `${JSON.stringify(manifest, null, 2)}\n`;
}

const root = resolve(import.meta.dirname, '..', localPath);
const treeResponse = await fetch(`https://api.github.com/repos/stripe/ai/git/trees/${sha}?recursive=1`, {
  redirect: 'error',
  signal: AbortSignal.timeout(30_000),
});

if (!treeResponse.ok) {
  throw new Error('Unable to read pinned Stripe tree');
}

const tree = (await treeResponse.json()) as {
  truncated: boolean;
  tree: Array<{ path: string; type: string; mode: string; size?: number }>;
};

if (tree.truncated || !Array.isArray(tree.tree)) {
  throw new Error('Incomplete Stripe tree');
}

const selected = tree.tree.filter((entry) => entry.path.startsWith(`${upstreamPath}/`) && entry.type !== 'tree');

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
  const file = entry.path.slice(upstreamPath.length + 1);
  containedPath(root, file);
  const response = await fetch(`https://raw.githubusercontent.com/stripe/ai/${sha}/${upstreamPath}/${file}`, {
    redirect: 'error',
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(`Upstream returned ${String(response.status)} for ${file}`);
  }

  const content = await response.text();
  files[file] = createHash('sha256').update(content).digest('hex');
  await mkdir(dirname(resolve(root, file)), { recursive: true });

  if (file === 'plugin.json') {
    await mkdir(resolve(root, 'io.flexkit'), { recursive: true });
    await writeFile(resolve(root, 'io.flexkit/upstream-plugin.json'), content);
    await writeFile(resolve(root, file), flexkitManifest(content, sha));
    continue;
  }

  if (file === 'mcp.json') {
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

  await writeFile(resolve(root, file), content);
}

const licenseResponse = await fetch(`https://raw.githubusercontent.com/stripe/ai/${sha}/LICENSE`, {
  redirect: 'error',
  signal: AbortSignal.timeout(30_000),
});

if (!licenseResponse.ok) {
  throw new Error('Unable to read the Stripe license');
}

const license = await licenseResponse.text();
files.LICENSE = createHash('sha256').update(license).digest('hex');
await writeFile(resolve(root, 'LICENSE'), license);

for (const file of Object.keys(previousFiles)) {
  if (!(file in files)) {
    await unlink(containedPath(root, file));
  }
}

await mkdir(resolve(root, 'io.flexkit'), { recursive: true });
await writeFile(
  resolve(root, 'io.flexkit/upstream.lock.json'),
  `${JSON.stringify({ repository, sha, path: upstreamPath, files, transformVersion: 1 }, null, 2)}\n`
);
