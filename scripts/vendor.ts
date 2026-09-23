import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, unlink } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { containedPath } from './validate.ts';

const sha = process.argv[2];

if (!sha || !/^[a-f0-9]{40}$/.test(sha)) {
  throw new Error('Usage: pnpm vendor <full-upstream-sha>');
}

const treeResponse = await fetch(`https://api.github.com/repos/cursor/plugins/git/trees/${sha}?recursive=1`, { redirect: 'error', signal: AbortSignal.timeout(30_000) });

if (!treeResponse.ok) {
  throw new Error('Unable to read pinned upstream tree');
}

const tree = await treeResponse.json() as { truncated: boolean; tree: Array<{ path: string; type: string; mode: string; size?: number }> };

if (tree.truncated || !Array.isArray(tree.tree)) {
  throw new Error('Incomplete upstream tree');
}

for (const name of ['gmail', 'google-drive', 'google-calendar']) {
  const path = `third_party/${name}`;
  const root = resolve(import.meta.dirname, '..', path);
  const files: { [path: string]: string } = {};

  const selected = tree.tree.filter((entry) => entry.path.startsWith(`${path}/`) && entry.type !== 'tree');

  if (selected.length > 300 || selected.some((entry) => entry.mode === '120000' || entry.type !== 'blob' || (entry.size ?? 0) > 1_000_000)) {
    throw new Error('Unsafe upstream package tree');
  }

  const previous = JSON.parse(await readFile(resolve(root, 'io.flexkit/upstream.lock.json'), 'utf8')) as { files: { [path: string]: string } };

  for (const entry of selected) {
    const file = entry.path.slice(path.length + 1);
    containedPath(root, file);
    const response = await fetch(`https://raw.githubusercontent.com/cursor/plugins/${sha}/${path}/${file}`, { signal: AbortSignal.timeout(30_000), redirect: 'error' });

    if (!response.ok) {
      throw new Error(`Upstream returned ${String(response.status)}`);
    }

    const content = await response.text();
    files[file] = createHash('sha256').update(content).digest('hex');
    await mkdir(dirname(resolve(root, file)), { recursive: true });
    await writeFile(resolve(root, file), content);

    if (file === 'mcp.json') {
      await writeFile(resolve(root, 'io.flexkit/upstream-mcp.json'), content);
    }
  }

  for (const file of Object.keys(previous.files)) {
    if (!(file in files)) {
      await unlink(containedPath(root, file));
    }
  }

  const mcp = JSON.parse(await readFile(resolve(root, 'mcp.json'), 'utf8')) as { $schema?: string; mcpServers: { [key: string]: { type: string; url: string } } };
  mcp.$schema = 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json';

  for (const server of Object.values(mcp.mcpServers)) {
    if (server.type !== 'http' && server.type !== 'streamable-http') {
      throw new Error('Upstream transport changed; manual adaptation required');
    }

    server.type = 'streamable-http';
  }

  const manifest = JSON.parse(await readFile(resolve(root, 'plugin.json'), 'utf8')) as { extensions: { 'io.flexkit': { upstream: { sha: string } } } };
  manifest.extensions['io.flexkit'].upstream.sha = sha;
  await writeFile(resolve(root, 'plugin.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  await writeFile(resolve(root, 'mcp.json'), `${JSON.stringify(mcp, null, 2)}\n`);
  await writeFile(resolve(root, 'io.flexkit/upstream.lock.json'), `${JSON.stringify({ repository: 'https://github.com/cursor/plugins', sha, path, files, transformVersion: 1 }, null, 2)}\n`);
}
