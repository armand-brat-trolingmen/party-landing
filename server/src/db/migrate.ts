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
    first_visit_at TEXT,
    last_visit_at TEXT,
    visits_count INTEGER,
    first_referrer TEXT,
    last_referrer TEXT,
    first_utm_source TEXT,
    first_utm_medium TEXT,
    first_utm_campaign TEXT,
    last_utm_source TEXT,
    last_utm_medium TEXT,
    last_utm_campaign TEXT,
    spam_check_result TEXT NOT NULL DEFAULT 'passed',
    spam_reason TEXT,
    smartcaptcha_verified INTEGER NOT NULL DEFAULT 0,
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
  ensureColumn(db, 'first_visit_at', 'ALTER TABLE leads ADD COLUMN first_visit_at TEXT');
  ensureColumn(db, 'last_visit_at', 'ALTER TABLE leads ADD COLUMN last_visit_at TEXT');
  ensureColumn(db, 'visits_count', 'ALTER TABLE leads ADD COLUMN visits_count INTEGER');
  ensureColumn(db, 'first_referrer', 'ALTER TABLE leads ADD COLUMN first_referrer TEXT');
  ensureColumn(db, 'last_referrer', 'ALTER TABLE leads ADD COLUMN last_referrer TEXT');
  ensureColumn(db, 'first_utm_source', 'ALTER TABLE leads ADD COLUMN first_utm_source TEXT');
  ensureColumn(db, 'first_utm_medium', 'ALTER TABLE leads ADD COLUMN first_utm_medium TEXT');
  ensureColumn(db, 'first_utm_campaign', 'ALTER TABLE leads ADD COLUMN first_utm_campaign TEXT');
  ensureColumn(db, 'last_utm_source', 'ALTER TABLE leads ADD COLUMN last_utm_source TEXT');
  ensureColumn(db, 'last_utm_medium', 'ALTER TABLE leads ADD COLUMN last_utm_medium TEXT');
  ensureColumn(db, 'last_utm_campaign', 'ALTER TABLE leads ADD COLUMN last_utm_campaign TEXT');
  ensureColumn(db, 'spam_check_result', "ALTER TABLE leads ADD COLUMN spam_check_result TEXT NOT NULL DEFAULT 'passed'");
  ensureColumn(db, 'spam_reason', 'ALTER TABLE leads ADD COLUMN spam_reason TEXT');
  ensureColumn(db, 'smartcaptcha_verified', 'ALTER TABLE leads ADD COLUMN smartcaptcha_verified INTEGER NOT NULL DEFAULT 0');
}
