import { mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(scriptDir, '..', 'dist');

try {
  rmSync(distDir, {
    recursive: true,
    force: true,
    maxRetries: 10,
    retryDelay: 200,
  });
} catch (error) {
  console.error(`[prepare-dist] failed to remove ${distDir}`);
  throw error;
}

mkdirSync(distDir, { recursive: true });
