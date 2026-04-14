import type Database from 'better-sqlite3';

const createLeadsTableSql = `
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip TEXT,
    user_agent TEXT,
    first_traffic_source TEXT,
    last_traffic_source TEXT,
    vk_peer_id TEXT,
    vk_send_status TEXT NOT NULL,
    vk_send_error TEXT
  );
`;

type TableInfoRow = {
  name: string;
};

function ensureColumn(db: Database.Database, columnName: string, alterSql: string) {
  const columns = db.prepare('PRAGMA table_info(leads)').all() as TableInfoRow[];

  if (!columns.some((column) => column.name === columnName)) {
    db.exec(alterSql);
  }
}

export function runMigrations(db: Database.Database) {
  db.exec(createLeadsTableSql);
  ensureColumn(db, 'first_traffic_source', 'ALTER TABLE leads ADD COLUMN first_traffic_source TEXT');
  ensureColumn(db, 'last_traffic_source', 'ALTER TABLE leads ADD COLUMN last_traffic_source TEXT');
}
