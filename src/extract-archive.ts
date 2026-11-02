import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { extract as extractTar } from 'tar';

import { logError } from './log';

// oxlint-disable-next-line typescript/strict-void-return
const execFileAsync = promisify(execFile);

export async function extractArchive(archivePath: string, targetDirectoryPath: string) {
  if (archivePath.endsWith('.zip')) {
    const quotedArchivePath = `'${archivePath.replaceAll("'", "''")}'`;
    const quotedTargetDirectoryPath = `'${targetDirectoryPath.replaceAll("'", "''")}'`;

    await execFileAsync('powershell.exe', [
      '-NoProfile',
      '-Command',
      `Expand-Archive -LiteralPath ${quotedArchivePath} -DestinationPath ${quotedTargetDirectoryPath} -Force`,
    ]);
    return;
  }
  if (archivePath.endsWith('.tar.gz')) {
    await extractTar({ cwd: targetDirectoryPath, file: archivePath });
    return;
  }
  logError('unsupportedArchiveFormat', archivePath);
}
