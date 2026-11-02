#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { access } from 'node:fs/promises';
import updateNotifier from 'update-notifier';

import { binaryPath, name, version } from './config';
import { logError } from './log';

type ErrorName = Parameters<typeof logError>[0];

function setErrorExitCode(errorName: ErrorName, metaInfo?: string) {
  try {
    logError(errorName, metaInfo);
  } catch {
    process.exitCode = 1;
  }
}

updateNotifier({
  pkg: { name, version },
  shouldNotifyInNpmScript: true,
  updateCheckInterval: 1000 * 60 * 60 * 24, // One day in MS
}).notify({ defer: false });

let canSpawn = true;

try {
  await access(binaryPath);
} catch {
  setErrorExitCode('binaryNotFound');
  canSpawn = false;
}

if (canSpawn) {
  const childProcess = spawn(binaryPath, process.argv.slice(2), { stdio: 'inherit' });

  childProcess.on('error', (error) => {
    setErrorExitCode('executionFailed', error.message);
  });

  childProcess.on('exit', (code, signal): void => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exitCode = code ?? 1;
  });
}
