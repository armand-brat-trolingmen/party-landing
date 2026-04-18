import type { SmartCaptchaVerifyResult } from '../adapters/smartCaptchaAdapter';
import type { LeadApiResponse, LeadRecord, LeadSpamCheckResult } from '../types';
import { validateLeadInput } from '../validation/leadValidation';

type Repository = {
  countLeadsByIpBetween(input: {
    ip: string;
    createdAtFrom: string;
    createdAtTo: string;
  }): number;
  findRecentLeadByPhone(input: {
    phone: string;
    createdAtFrom: string;
  }): LeadRecord | null;
  insertLead(input: {
    name: string;
    phone: string;
    ip: string | null;
    userAgent: string | null;
    firstTrafficSource: string | null;
    lastTrafficSource: string | null;
    firstVisitAt?: string | null;
    lastVisitAt?: string | null;
    visitsCount?: number | null;
    firstReferrer?: string | null;
    lastReferrer?: string | null;
    firstUtmSource?: string | null;
    firstUtmMedium?: string | null;
    firstUtmCampaign?: string | null;
    lastUtmSource?: string | null;
    lastUtmMedium?: string | null;
    lastUtmCampaign?: string | null;
    spamCheckResult?: LeadSpamCheckResult;
    spamReason?: string | null;
    smartCaptchaVerified?: boolean;
    vkPeerId: string | null;
    vkSendStatus: 'success' | 'failed' | 'skipped';
    vkSendError: string | null;
  }): number;
  updateVkStatus(input: {
    id: number;
    vkSendStatus: 'success' | 'failed' | 'skipped';
    vkSendError: string | null;
  }): void;
};

type VkAdapter = {
  sendLeadNotification(input: {
    name: string;
    phone: string;
    createdAt: string;
    firstLeadSource: string | null;
    lastLeadSource: string | null;
    firstVisitAt: string | null;
    lastVisitAt: string | null;
    visitsCount: number | null;
    firstReferrer: string | null;
    lastReferrer: string | null;
    firstUtmSource: string | null;
    firstUtmMedium: string | null;
    firstUtmCampaign: string | null;
    lastUtmSource: string | null;
    lastUtmMedium: string | null;
    lastUtmCampaign: string | null;
    spamCheckResult: LeadSpamCheckResult;
    spamReason: string | null;
    smartCaptchaVerified: boolean;
  }): Promise<{ status: 'success' | 'failed' | 'skipped'; error: string | null }>;
  getDefaultPeerIds?: () => string[];
};

type SmartCaptchaVerifier = {
  verify(input: { token: string | null; remoteIp: string | null }): Promise<SmartCaptchaVerifyResult>;
};

const submitTooFastThresholdMs = 2500;
const duplicateLeadWindowMs = 30 * 60 * 1000;
const genericSuccessMessage = '\u0417\u0430\u044f\u0432\u043a\u0430 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0430';
const invalidFormMessage = '\u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u0437\u0430\u043f\u043e\u043b\u043d\u0435\u043d\u0438\u0435 \u0444\u043e\u0440\u043c\u044b';

const noopSmartCaptchaVerifier: SmartCaptchaVerifier = {
  async verify() {
    return {
      configured: false,
      verified: false,
      reason: 'smartcaptcha_not_configured',
    };
  },
};

function formatCreatedAt(date: Date) {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Moscow',
  }).format(date);
}

function formatSqliteUtcTimestamp(value: Date) {
  return value.toISOString().slice(0, 19).replace('T', ' ');
}

function normalizeLeadSource(source: string | null | undefined) {
  if (typeof source !== 'string') {
    return null;
  }

  const normalized = source.trim().replace(/\s{2,}/g, ' ');
  return normalized ? normalized.slice(0, 160) : null;
}

function normalizeAttributionText(value: string | null | undefined, maxLength = 500) {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().replace(/\s{2,}/g, ' ');
  return normalized ? normalized.slice(0, maxLength) : null;
}

function normalizeVisitsCount(value: string | number | null | undefined) {
  const normalized = typeof value === 'number' ? value : typeof value === 'string' ? Number.parseInt(value, 10) : NaN;
  return Number.isFinite(normalized) && normalized > 0 ? Math.floor(normalized) : null;
}

function isSubmitTooFast(formStartedAt: string | undefined, now: Date) {
  if (!formStartedAt) {
    return false;
  }

  const startedAt = Number.parseInt(formStartedAt, 10);

  if (!Number.isFinite(startedAt)) {
    return false;
  }

  return now.getTime() - startedAt < submitTooFastThresholdMs;
}

function normalizeSpamReason(reasons: string[]) {
  const reason = reasons.filter(Boolean).join(';');
  return reason ? reason.slice(0, 500) : null;
}

export function createLeadService({
  repository,
  vkAdapter,
  smartCaptchaVerifier = noopSmartCaptchaVerifier,
  smartCaptchaRequired = false,
  nowFactory = () => new Date(),
}: {
  repository: Repository;
  vkAdapter: VkAdapter;
  smartCaptchaVerifier?: SmartCaptchaVerifier;
  smartCaptchaRequired?: boolean;
  nowFactory?: () => Date;
}) {
  return {
    async createLead(input: {
      name: string;
      phone: string;
      ip: string | null;
      userAgent: string | null;
      firstLeadSource?: string;
      lastLeadSource?: string;
      first_visit_at?: string;
      last_visit_at?: string;
      visits_count?: string | number;
      first_referrer?: string;
      last_referrer?: string;
      first_utm_source?: string;
      first_utm_medium?: string;
      first_utm_campaign?: string;
      last_utm_source?: string;
      last_utm_medium?: string;
      last_utm_campaign?: string;
      company?: string;
      form_started_at?: string;
      smartcaptcha_token?: string;
      softRateLimitExceeded?: boolean;
    }): Promise<LeadApiResponse> {
      const validation = validateLeadInput({
        name: input.name,
        phone: input.phone,
      });

      if (!validation.ok) {
        return {
          ok: false,
          accepted: false,
          fieldErrors: validation.fieldErrors,
          message: invalidFormMessage,
        };
      }

      const now = nowFactory();
      const firstTrafficSource = normalizeLeadSource(input.firstLeadSource);
      const lastTrafficSource = normalizeLeadSource(input.lastLeadSource);
      const firstVisitAt = normalizeAttributionText(input.first_visit_at, 40);
      const lastVisitAt = normalizeAttributionText(input.last_visit_at, 40);
      const visitsCount = normalizeVisitsCount(input.visits_count);
      const firstReferrer = normalizeAttributionText(input.first_referrer);
      const lastReferrer = normalizeAttributionText(input.last_referrer);
      const firstUtmSource = normalizeAttributionText(input.first_utm_source, 160);
      const firstUtmMedium = normalizeAttributionText(input.first_utm_medium, 160);
      const firstUtmCampaign = normalizeAttributionText(input.first_utm_campaign, 160);
      const lastUtmSource = normalizeAttributionText(input.last_utm_source, 160);
      const lastUtmMedium = normalizeAttributionText(input.last_utm_medium, 160);
      const lastUtmCampaign = normalizeAttributionText(input.last_utm_campaign, 160);
      const spamReasons: string[] = [];

      if (normalizeAttributionText(input.company, 160)) {
        spamReasons.push('honeypot_filled');
      }

      if (isSubmitTooFast(input.form_started_at, now)) {
        spamReasons.push('submit_too_fast');
      }

      if (input.softRateLimitExceeded) {
        spamReasons.push('soft_rate_limit');
      }

      let smartCaptchaResult: SmartCaptchaVerifyResult;

      try {
        smartCaptchaResult = await smartCaptchaVerifier.verify({
          token: normalizeAttributionText(input.smartcaptcha_token, 2048),
          remoteIp: input.ip,
        });
      } catch {
        smartCaptchaResult = {
          configured: true,
          verified: false,
          reason: 'smartcaptcha_verify_error',
        };
      }

      if (smartCaptchaRequired && !smartCaptchaResult.configured) {
        spamReasons.push(smartCaptchaResult.reason ?? 'smartcaptcha_not_configured');
      } else if (smartCaptchaResult.configured && !smartCaptchaResult.verified) {
        spamReasons.push(smartCaptchaResult.reason ?? 'smartcaptcha_failed');
      }

      const duplicateLead = repository.findRecentLeadByPhone({
        phone: validation.value.phone,
        createdAtFrom: formatSqliteUtcTimestamp(new Date(now.getTime() - duplicateLeadWindowMs)),
      });
      const spamCheckResult: LeadSpamCheckResult =
        spamReasons.length > 0 ? 'spam' : duplicateLead ? 'duplicate' : 'passed';

      if (spamCheckResult !== 'passed') {
        return {
          ok: true,
          accepted: false,
          vkSendStatus: 'skipped',
          message: genericSuccessMessage,
        };
      }

      const spamReason = normalizeSpamReason(spamReasons);
      const smartCaptchaVerified = smartCaptchaResult.configured ? smartCaptchaResult.verified : false;
      const vkPeerId = vkAdapter.getDefaultPeerIds?.().join(',') || null;
      const leadId = repository.insertLead({
        name: validation.value.name,
        phone: validation.value.phone,
        ip: input.ip,
        userAgent: input.userAgent,
        firstTrafficSource,
        lastTrafficSource,
        firstVisitAt,
        lastVisitAt,
        visitsCount,
        firstReferrer,
        lastReferrer,
        firstUtmSource,
        firstUtmMedium,
        firstUtmCampaign,
        lastUtmSource,
        lastUtmMedium,
        lastUtmCampaign,
        spamCheckResult,
        spamReason,
        smartCaptchaVerified,
        vkPeerId,
        vkSendStatus: 'skipped',
        vkSendError: null,
      });

      const vkResult = await vkAdapter.sendLeadNotification({
        name: validation.value.name,
        phone: validation.value.phone,
        createdAt: formatCreatedAt(now),
        firstLeadSource: firstTrafficSource,
        lastLeadSource: lastTrafficSource,
        firstVisitAt,
        lastVisitAt,
        visitsCount,
        firstReferrer,
        lastReferrer,
        firstUtmSource,
        firstUtmMedium,
        firstUtmCampaign,
        lastUtmSource,
        lastUtmMedium,
        lastUtmCampaign,
        spamCheckResult,
        spamReason,
        smartCaptchaVerified,
      });

      repository.updateVkStatus({
        id: leadId,
        vkSendStatus: vkResult.status,
        vkSendError: vkResult.error,
      });

      return {
        ok: true,
        accepted: true,
        id: leadId,
        vkSendStatus: vkResult.status,
        message: genericSuccessMessage,
      };
    },
  };
}
