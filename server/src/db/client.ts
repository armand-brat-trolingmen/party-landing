import Database from 'better-sqlite3';

export function createDatabase(path: string) {
  return new Database(path);
}
