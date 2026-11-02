import type { Options } from 'boxen';

import boxen from 'boxen';

import { libraryName } from './config';
import { ERRORS_BY_KEY } from './errors';

export function log(message: string, options: Options) {
  // oxlint-disable-next-line no-console
  console.log(boxen(message, options));
}

const errorPrefix = `[${libraryName}]`;
export function logError(errorName: keyof typeof ERRORS_BY_KEY, metaInfo?: string): never {
  const error = ERRORS_BY_KEY[errorName];
  let logMessage = error.message;
  if (error.instruction) {
    logMessage += `\n\n${error.instruction}`;
  }
  if (metaInfo) {
    logMessage += `\n\n${metaInfo}`;
  }
  log(logMessage, { borderColor: 'red', title: errorPrefix });

  throw new Error(`${errorPrefix} ${error.message}`);
}
