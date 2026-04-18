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
  first_visit_at: string | null;
  last_visit_at: string | null;
  visits_count: number | null;
  first_referrer: string | null;
  last_referrer: string | null;
  first_utm_source: string | null;
  first_utm_medium: string | null;
  first_utm_campaign: string | null;
  last_utm_source: string | null;
  last_utm_medium: string | null;
  last_utm_campaign: string | null;
  spam_check_result: LeadRecord['spamCheckResult'];
  spam_reason: string | null;
  smartcaptcha_verified: 0 | 1;
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
    firstVisitAt: row.first_visit_at,
    lastVisitAt: row.last_visit_at,
    visitsCount: row.visits_count,
    firstReferrer: row.first_referrer,
    lastReferrer: row.last_referrer,
    firstUtmSource: row.first_utm_source,
    firstUtmMedium: row.first_utm_medium,
    firstUtmCampaign: row.first_utm_campaign,
    lastUtmSource: row.last_utm_source,
    lastUtmMedium: row.last_utm_medium,
    lastUtmCampaign: row.last_utm_campaign,
    spamCheckResult: row.spam_check_result,
    spamReason: row.spam_reason,
    smartCaptchaVerified: row.smartcaptcha_verified === 1,
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
      first_visit_at,
      last_visit_at,
      visits_count,
      first_referrer,
      last_referrer,
      first_utm_source,
      first_utm_medium,
      first_utm_campaign,
      last_utm_source,
      last_utm_medium,
      last_utm_campaign,
      spam_check_result,
      spam_reason,
      smartcaptcha_verified,
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
      @firstVisitAt,
      @lastVisitAt,
      @visitsCount,
      @firstReferrer,
      @lastReferrer,
      @firstUtmSource,
      @firstUtmMedium,
      @firstUtmCampaign,
      @lastUtmSource,
      @lastUtmMedium,
      @lastUtmCampaign,
      @spamCheckResult,
      @spamReason,
      @smartCaptchaVerified,
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
      first_visit_at,
      last_visit_at,
      visits_count,
      first_referrer,
      last_referrer,
      first_utm_source,
      first_utm_medium,
      first_utm_campaign,
      last_utm_source,
      last_utm_medium,
      last_utm_campaign,
      spam_check_result,
      spam_reason,
      smartcaptcha_verified,
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

  const findRecentLeadByPhoneStatement = db.prepare(`
    SELECT
      id,
      name,
      phone,
      created_at,
      ip,
      user_agent,
      first_traffic_source,
      last_traffic_source,
      first_visit_at,
      last_visit_at,
      visits_count,
      first_referrer,
      last_referrer,
      first_utm_source,
      first_utm_medium,
      first_utm_campaign,
      last_utm_source,
      last_utm_medium,
      last_utm_campaign,
      spam_check_result,
      spam_reason,
      smartcaptcha_verified,
      vk_peer_id,
      vk_send_status,
      vk_send_error
    FROM leads
    WHERE phone = @phone
      AND created_at >= @createdAtFrom
    ORDER BY created_at DESC
    LIMIT 1
  `);

  return {
    insertLead(input: InsertLeadInput) {
      const leadInput = {
        firstVisitAt: null,
        lastVisitAt: null,
        visitsCount: null,
        firstReferrer: null,
        lastReferrer: null,
        firstUtmSource: null,
        firstUtmMedium: null,
        firstUtmCampaign: null,
        lastUtmSource: null,
        lastUtmMedium: null,
        lastUtmCampaign: null,
        spamCheckResult: 'passed',
        spamReason: null,
        smartCaptchaVerified: false,
        ...input,
      };
      const result = insertStatement.run({
        ...leadInput,
        smartCaptchaVerified: leadInput.smartCaptchaVerified ? 1 : 0,
      });
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
    findRecentLeadByPhone(input: { phone: string; createdAtFrom: string }) {
      const row = findRecentLeadByPhoneStatement.get(input) as LeadRow | undefined;
      return row ? mapLeadRow(row) : null;
    },
  };
}
