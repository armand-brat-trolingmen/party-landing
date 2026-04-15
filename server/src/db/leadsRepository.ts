import type Database from 'better-sqlite3';
import type { InsertLeadInput, LeadRecord, VkSendStatus } from '../types';

type LeadRow = {
  id: number;
  name: string;
  phone: string;
  created_at: string;
  ip: string | null;
  user_agent: string | null;
  first_traffic_source: string | null;
  last_traffic_source: string | null;
  vk_peer_id: string | null;
  vk_send_status: VkSendStatus;
  vk_send_error: string | null;
};

function mapLeadRow(row: LeadRow): LeadRecord {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    createdAt: row.created_at,
    ip: row.ip,
    userAgent: row.user_agent,
    firstTrafficSource: row.first_traffic_source,
    lastTrafficSource: row.last_traffic_source,
    vkPeerId: row.vk_peer_id,
    vkSendStatus: row.vk_send_status,
    vkSendError: row.vk_send_error,
  };
}

export function createLeadsRepository(db: Database.Database) {
  const insertStatement = db.prepare(`
    INSERT INTO leads (
      name,
      phone,
      ip,
      user_agent,
      first_traffic_source,
      last_traffic_source,
      vk_peer_id,
      vk_send_status,
      vk_send_error
    ) VALUES (
      @name,
      @phone,
      @ip,
      @userAgent,
      @firstTrafficSource,
      @lastTrafficSource,
      @vkPeerId,
      @vkSendStatus,
      @vkSendError
    )
  `);

  const updateVkStatement = db.prepare(`
    UPDATE leads
    SET vk_send_status = @vkSendStatus,
        vk_send_error = @vkSendError
    WHERE id = @id
  `);

  const findByIdStatement = db.prepare(`
    SELECT
      id,
      name,
      phone,
      created_at,
      ip,
      user_agent,
      first_traffic_source,
      last_traffic_source,
      vk_peer_id,
      vk_send_status,
      vk_send_error
    FROM leads
    WHERE id = ?
  `);

  const countLeadsByIpBetweenStatement = db.prepare(`
    SELECT COUNT(*) AS total
    FROM leads
    WHERE ip = @ip
      AND created_at >= @createdAtFrom
      AND created_at < @createdAtTo
  `);

  return {
    insertLead(input: InsertLeadInput) {
      const result = insertStatement.run(input);
      return Number(result.lastInsertRowid);
    },
    updateVkStatus(input: { id: number; vkSendStatus: VkSendStatus; vkSendError: string | null }) {
      updateVkStatement.run(input);
    },
    findById(id: number) {
      const row = findByIdStatement.get(id) as LeadRow | undefined;
      return row ? mapLeadRow(row) : null;
    },
    countLeadsByIpBetween(input: { ip: string; createdAtFrom: string; createdAtTo: string }) {
      const row = countLeadsByIpBetweenStatement.get(input) as { total: number } | undefined;
      return row?.total ?? 0;
    },
  };
}
