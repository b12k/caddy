import { writeFile } from 'node:fs/promises';
import { rsort } from 'semver';

import packageJson from '../package.json' with { type: 'json' };

const CADDY_LATEST_RELEASE_URL = 'https://api.github.com/repos/caddyserver/caddy/releases/latest';
const PACKAGE_JSON_URL = new URL('../package.json', import.meta.url);

const response: Omit<Response, 'json'> & { json: () => Promise<{ tag_name: string }> } =
  await fetch(CADDY_LATEST_RELEASE_URL);
if (!response.ok) throw new Error(`Failed to fetch the latest Caddy release: ${response.status}.`);
const { tag_name: latestCaddyTag } = await response.json();

const { version } = packageJson;
const latestCaddyVersion = latestCaddyTag.replace(/^v/u, '');
const [libraryCaddyVersion = ''] = version.split('-', 1);
const [updateToVersion = ''] = rsort([latestCaddyVersion, libraryCaddyVersion]);

if (updateToVersion === libraryCaddyVersion || latestCaddyTag.includes('-')) {
  // oxlint-disable-next-line unicorn/no-process-exit
  process.exit(0);
}

await writeFile(
  PACKAGE_JSON_URL,
  `${JSON.stringify({ ...packageJson, version: `${updateToVersion}-v.0` }, undefined, 2)}\n`,
  'utf8',
);
