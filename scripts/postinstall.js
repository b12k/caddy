import path from 'node:path';
import { pathToFileURL } from 'node:url';

const directory = import.meta.dirname;
// oxlint-disable-next-line unicorn/no-process-exit
if (!directory.includes('node_modules')) process.exit(0);
await import(pathToFileURL(path.join(directory, '../dist/postinstall.js')).href);
