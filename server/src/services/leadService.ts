import type { LeadApiResponse } from '../types';
import { validateLeadInput } from '../validation/leadValidation';

type Repository = {
  countLeadsByIpBetween(input: {
    ip: string;
    createdAtFrom: string;
    createdAtTo: string;
  }): number;
  insertLead(input: {
    name: string;
    phone: string;
    ip: string | null;
    userAgent: string | null;
    firstTrafficSource: string | null;
    lastTrafficSource: string | null;
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
  }): Promise<{ status: 'success' | 'failed' | 'skipped'; error: string | null }>;
  getDefaultPeerIds?: () => string[];
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

function normalizeLeadSource(source: string | null | undefined) {
  if (typeof source !== 'string') {
    return null;
  }

  const normalized = source.trim().replace(/\s{2,}/g, ' ');
  return normalized ? normalized.slice(0, 160) : null;
}

const DAILY_IP_LEAD_LIMIT = 2;
const MOSCOW_UTC_OFFSET = '+03:00';

function formatSqliteUtcTimestamp(value: Date) {
  return value.toISOString().slice(0, 19).replace('T', ' ');
}

function getMoscowDayWindow(date: Date) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const [{ value: year }, , { value: month }, , { value: day }] = formatter.formatToParts(date);
  const start = new Date(`${year}-${month}-${day}T00:00:00${MOSCOW_UTC_OFFSET}`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  return {
    createdAtFrom: formatSqliteUtcTimestamp(start),
    createdAtTo: formatSqliteUtcTimestamp(end),
  };
}

export function createLeadService({
  repository,
  vkAdapter,
  nowFactory = () => new Date(),
}: {
  repository: Repository;
  vkAdapter: VkAdapter;
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
    }): Promise<LeadApiResponse> {
      const validation = validateLeadInput({
        name: input.name,
        phone: input.phone,
      });

      if (!validation.ok) {
        return {
          ok: false,
          fieldErrors: validation.fieldErrors,
          message: 'Проверьте заполнение формы',
        };
      }

      if (input.ip) {
        const { createdAtFrom, createdAtTo } = getMoscowDayWindow(nowFactory());
        const dailyLeadsCount = repository.countLeadsByIpBetween({
          ip: input.ip,
          createdAtFrom,
          createdAtTo,
        });

        if (dailyLeadsCount >= DAILY_IP_LEAD_LIMIT) {
          return {
            ok: false,
            message: 'С этого IP уже отправлено 2 заявки за сегодня. Попробуйте завтра.',
            statusCode: 429,
          };
        }
      }

      const firstTrafficSource = normalizeLeadSource(input.firstLeadSource);
      const lastTrafficSource = normalizeLeadSource(input.lastLeadSource);
      const vkPeerId = vkAdapter.getDefaultPeerIds?.().join(',') || null;
      const leadId = repository.insertLead({
        name: validation.value.name,
        phone: validation.value.phone,
        ip: input.ip,
        userAgent: input.userAgent,
        firstTrafficSource,
        lastTrafficSource,
        vkPeerId,
        vkSendStatus: 'skipped',
        vkSendError: null,
      });

      const vkResult = await vkAdapter.sendLeadNotification({
        name: validation.value.name,
        phone: validation.value.phone,
        createdAt: formatCreatedAt(nowFactory()),
        firstLeadSource: firstTrafficSource,
        lastLeadSource: lastTrafficSource,
      });

      repository.updateVkStatus({
        id: leadId,
        vkSendStatus: vkResult.status,
        vkSendError: vkResult.error,
      });

      return {
        ok: true,
        id: leadId,
        vkSendStatus: vkResult.status,
        message: 'Заявка сохранена',
      };
    },
  };
}
