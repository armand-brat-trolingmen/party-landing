import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import Database from 'better-sqlite3';
import { config as loadDotEnv } from 'dotenv';

const serverRoot = resolve(__dirname, '../..');

loadDotEnv({
  path: resolve(serverRoot, '.env'),
});

function parsePositiveInteger(value: string | undefined) {
  if (!value?.trim()) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function createTimestamp() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');

  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    '-',
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join('');
}

function pruneOldBackups(directoryPath: string, filePrefix: string, retentionDays: number) {
  const cutoffTime = Date.now() - retentionDays * 24 * 60 * 60 * 1000;

  for (const entry of readdirSync(directoryPath, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.startsWith(filePrefix) || extname(entry.name) !== '.sqlite') {
      continue;
    }

    const entryPath = join(directoryPath, entry.name);
    const entryStat = statSync(entryPath);

    if (entryStat.mtimeMs < cutoffTime) {
      rmSync(entryPath);
    }
  }
}

async function main() {
  const dbPath = resolve(serverRoot, process.env.DB_PATH ?? './data/leads.sqlite');
  const dbFileName = basename(dbPath, extname(dbPath));
  const configuredBackupDirectory = process.env.SQLITE_BACKUP_DIR?.trim();
  const backupDirectory =
    configuredBackupDirectory
      ? resolve(serverRoot, configuredBackupDirectory)
      : resolve(dirname(dbPath), 'backups');
  const retentionDays = parsePositiveInteger(process.env.SQLITE_BACKUP_RETENTION_DAYS);

  if (!existsSync(dbPath)) {
    throw new Error(`SQLite database not found: ${dbPath}`);
  }

  mkdirSync(backupDirectory, { recursive: true });

  const backupPath = join(backupDirectory, `${dbFileName}-${createTimestamp()}.sqlite`);
  const db = new Database(dbPath, { readonly: true });

  try {
    await db.backup(backupPath);
  } finally {
    db.close();
  }

  if (retentionDays) {
    pruneOldBackups(backupDirectory, `${dbFileName}-`, retentionDays);
  }

  console.log(`SQLite backup created: ${backupPath}`);
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`SQLite backup failed: ${message}`);
  process.exitCode = 1;
});
