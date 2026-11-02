#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { readFile, rm } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';

import {
  architecture,
  archiveFileName,
  archiveGithubUrl,
  archivePath,
  binaryPath,
  checksumsGithubUrl,
  currentDirectory,
  libraryName,
  platform,
  supportedArchitectures,
  supportedPlatforms,
} from './config';
import { extractArchive } from './extract-archive';
import { log, logError } from './log';

const DOWNLOAD_TIMEOUT_MS = 1000 * 60 * 5;

if (!supportedPlatforms.includes(platform)) {
  logError('unsupportedPlatform');
}
if (!supportedArchitectures.includes(architecture)) {
  logError('unsupportedArchitecture');
}

async function createFetchResponse(url: string) {
  const response = await fetch(url, { signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS) });
  if (!response.ok) throw new Error(String(response.status));

  return response;
}

async function downloadArchive() {
  log(archiveGithubUrl, { borderColor: 'green', title: `${libraryName}:download` });
  const response = await createFetchResponse(archiveGithubUrl);
  if (!response.body) throw new Error('Archive download returned no body.');

  log(archivePath, { borderColor: 'green', title: `${libraryName}:save` });
  await pipeline(response.body, createWriteStream(archivePath));
}

async function ensureArchiveChecksum() {
  log(checksumsGithubUrl, { borderColor: 'green', title: `${libraryName}:verify` });
  const response = await createFetchResponse(checksumsGithubUrl);
  const checksums = await response.text();
  const checksum = checksums
    .split('\n')
    .find((line) => line.endsWith(` ${archiveFileName}`))
    ?.split(/\s+/u, 1)[0];
  if (!checksum) throw new Error(`Checksum not found for ${archiveFileName}.`);

  const archive = await readFile(archivePath);
  const actualChecksum = createHash('sha512').update(archive).digest('hex');
  if (actualChecksum !== checksum) throw new Error(`Checksum mismatch for ${archiveFileName}.`);
}

async function install() {
  await downloadArchive();
  await ensureArchiveChecksum();

  log(currentDirectory, { borderColor: 'green', title: `${libraryName}:extract` });
  await extractArchive(archivePath, currentDirectory);

  log(binaryPath, { borderColor: 'green', title: `${libraryName}:installed` });
}

async function installWithCleanup() {
  try {
    await install();
  } finally {
    await rm(archivePath, { force: true });
  }
}

try {
  await installWithCleanup();
} catch (error: unknown) {
  let message = 'Unknown error.';
  if (Error.isError(error)) {
    message = error.message;
  }
  logError('installationFailed', message);
}
