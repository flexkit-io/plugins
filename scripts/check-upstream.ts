const response = await fetch('https://api.github.com/repos/cursor/plugins/commits/main', {
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
