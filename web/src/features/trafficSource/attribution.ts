const FIRST_SOURCE_COOKIE = 'party_lead_first_source';
const LAST_SOURCE_COOKIE = 'party_lead_last_source';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 90;
const ATTRIBUTION_COOKIE_PREFIX = 'party_lead_';

export const LEAD_ATTRIBUTION_FIELDS = [
  'first_visit_at',
  'last_visit_at',
  'visits_count',
  'first_referrer',
  'last_referrer',
  'first_utm_source',
  'first_utm_medium',
  'first_utm_campaign',
  'last_utm_source',
  'last_utm_medium',
  'last_utm_campaign',
] as const;

export type LeadAttributionField = (typeof LEAD_ATTRIBUTION_FIELDS)[number];
export type LeadAttributionPayload = Record<LeadAttributionField, string>;

type TouchData = {
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
};

const emptyAttribution = Object.fromEntries(
  LEAD_ATTRIBUTION_FIELDS.map((field) => [field, '']),
) as LeadAttributionPayload;

function canUseCookies() {
  return typeof document !== 'undefined' && typeof document.cookie === 'string';
}

function readCookie(name: string) {
  if (!canUseCookies()) {
    return null;
  }

  const raw = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);

  if (raw === undefined) {
    return null;
  }

  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function writeCookie(name: string, value: string) {
  if (!canUseCookies()) {
    return;
  }

  // First-party attribution stays readable by the app only and expires after the agreed 90-day window.
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
}

function readAttributionCookie(field: LeadAttributionField) {
  return readCookie(`${ATTRIBUTION_COOKIE_PREFIX}${field}`);
}

function writeAttributionCookie(field: LeadAttributionField, value: string) {
  writeCookie(`${ATTRIBUTION_COOKIE_PREFIX}${field}`, value);
}

function getSearchParam(currentUrl: URL, name: string) {
  return currentUrl.searchParams.get(name)?.trim() ?? '';
}

function classifyExternalSource(referrerUrl: URL) {
  const host = referrerUrl.hostname.toLowerCase();

  if (host.includes('yandex.')) {
    return 'Яндекс поиск';
  }

  if (host.includes('google.')) {
    return 'Google поиск';
  }

  if (host.includes('bing.')) {
    return 'Bing поиск';
  }

  if (host.includes('avito.')) {
    return `Avito: ${referrerUrl.toString()}`;
  }

  if (host === 'vk.com' || host.endsWith('.vk.com')) {
    return 'Переход из VK';
  }

  if (host === 't.me' || host.endsWith('.t.me')) {
    return 'Переход из Telegram';
  }

  return referrerUrl.toString();
}

function resolveReferrer(currentUrl: URL, referrer: string) {
  if (!referrer) {
    return 'direct';
  }

  try {
    const referrerUrl = new URL(referrer);

    if (referrerUrl.origin === currentUrl.origin) {
      return null;
    }

    return referrerUrl.toString();
  } catch {
    return 'direct';
  }
}

function resolveTouchData(currentUrl: URL, referrer: string): TouchData | null {
  const utmSource = getSearchParam(currentUrl, 'utm_source');
  const utmMedium = getSearchParam(currentUrl, 'utm_medium');
  const utmCampaign = getSearchParam(currentUrl, 'utm_campaign');
  const referrerValue = resolveReferrer(currentUrl, referrer);

  if (!utmSource && !utmMedium && !utmCampaign && referrerValue === null) {
    return null;
  }

  return {
    referrer: referrerValue ?? 'direct',
    utmSource,
    utmMedium,
    utmCampaign,
  };
}

function formatUtmSource(touch: Pick<TouchData, 'utmSource' | 'utmMedium' | 'utmCampaign'>) {
  if (!touch.utmSource) {
    return null;
  }

  return `UTM: ${[touch.utmSource, touch.utmMedium, touch.utmCampaign].filter(Boolean).join(' / ')}`;
}

function formatTouchLeadSource(touch: TouchData) {
  const utmSource = formatUtmSource(touch);

  if (utmSource) {
    return utmSource;
  }

  if (!touch.referrer || touch.referrer === 'direct') {
    return 'Прямой заход';
  }

  try {
    return classifyExternalSource(new URL(touch.referrer));
  } catch {
    return touch.referrer;
  }
}

function formatStoredLeadSource(prefix: 'first' | 'last', attribution: LeadAttributionPayload) {
  return formatTouchLeadSource({
    referrer: attribution[`${prefix}_referrer`],
    utmSource: attribution[`${prefix}_utm_source`],
    utmMedium: attribution[`${prefix}_utm_medium`],
    utmCampaign: attribution[`${prefix}_utm_campaign`],
  });
}

function parseVisitsCount(value: string) {
  const visitsCount = Number.parseInt(value, 10);
  return Number.isFinite(visitsCount) && visitsCount > 0 ? visitsCount : 0;
}

export function resolveLeadSource(currentUrl: URL, referrer: string) {
  const touch = resolveTouchData(currentUrl, referrer);

  if (!touch) {
    return null;
  }

  return formatTouchLeadSource(touch);
}

export function ensureLeadAttributionCookies(
  locationHref = window.location.href,
  referrer = document.referrer,
  now = new Date(),
) {
  const touch = resolveTouchData(new URL(locationHref), referrer);

  if (!touch) {
    return;
  }

  const stored = getStoredLeadAttribution();
  const visitAt = now.toISOString();
  const visitsCount = String(parseVisitsCount(stored.visits_count) + 1);

  if (!stored.first_visit_at) {
    writeAttributionCookie('first_visit_at', visitAt);
    writeAttributionCookie('first_referrer', touch.referrer);
    writeAttributionCookie('first_utm_source', touch.utmSource);
    writeAttributionCookie('first_utm_medium', touch.utmMedium);
    writeAttributionCookie('first_utm_campaign', touch.utmCampaign);
  }

  writeAttributionCookie('last_visit_at', visitAt);
  writeAttributionCookie('visits_count', visitsCount);
  writeAttributionCookie('last_referrer', touch.referrer);
  writeAttributionCookie('last_utm_source', touch.utmSource);
  writeAttributionCookie('last_utm_medium', touch.utmMedium);
  writeAttributionCookie('last_utm_campaign', touch.utmCampaign);

  const leadSource = formatTouchLeadSource(touch);

  if (!readCookie(FIRST_SOURCE_COOKIE)) {
    writeCookie(FIRST_SOURCE_COOKIE, leadSource);
  }

  writeCookie(LAST_SOURCE_COOKIE, leadSource);
}

export function ensureLeadSourceCookies(locationHref = window.location.href, referrer = document.referrer) {
  ensureLeadAttributionCookies(locationHref, referrer);
}

export function getStoredLeadAttribution(): LeadAttributionPayload {
  return {
    ...emptyAttribution,
    ...Object.fromEntries(
      LEAD_ATTRIBUTION_FIELDS.map((field) => [field, readAttributionCookie(field) ?? '']),
    ),
  };
}

export function getStoredLeadSources() {
  const attribution = getStoredLeadAttribution();
  const firstLeadSource = readCookie(FIRST_SOURCE_COOKIE) ?? formatStoredLeadSource('first', attribution);
  const lastLeadSource = readCookie(LAST_SOURCE_COOKIE) ?? formatStoredLeadSource('last', attribution);

  return {
    firstLeadSource,
    lastLeadSource,
  };
}
