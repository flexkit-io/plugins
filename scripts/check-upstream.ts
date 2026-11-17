/** The upstream repository of each vendored plugin; prints the latest commit of its default branch. */
const repositories: { [name: string]: string } = {
  stripe: 'stripe/ai',
  atlassian: 'atlassian/atlassian-mcp-server',
};

const name = process.argv[2];
const repo = name === undefined ? undefined : repositories[name];

if (!repo) {
  throw new Error(`Usage: pnpm check-upstream <${Object.keys(repositories).join('|')}>`);
}

const response = await fetch(`https://api.github.com/repos/${repo}/commits/HEAD`, {
  headers: { Accept: 'application/vnd.github+json' }, signal: AbortSignal.timeout(30_000),
});

if (!response.ok) {
  throw new Error(`GitHub returned ${String(response.status)}`);
}

const result: unknown = await response.json();

if (!result || typeof result !== 'object' || !('sha' in result) || typeof result.sha !== 'string' || !/^[a-f0-9]{40}$/.test(result.sha)) {
  throw new Error('Invalid upstream revision');
}

process.stdout.write(`${result.sha}\n`);
export {};
