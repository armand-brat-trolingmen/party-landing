const FIRST_SOURCE_COOKIE = 'party_lead_first_source';
const LAST_SOURCE_COOKIE = 'party_lead_last_source';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function readCookie(name: string) {
  const raw = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);

  return raw ? decodeURIComponent(raw) : null;
}

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
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

export function resolveLeadSource(currentUrl: URL, referrer: string) {
  const utmSource = currentUrl.searchParams.get('utm_source')?.trim();
  const utmMedium = currentUrl.searchParams.get('utm_medium')?.trim();

  if (utmSource) {
    return utmMedium ? `UTM: ${utmSource} / ${utmMedium}` : `UTM: ${utmSource}`;
  }

  if (!referrer) {
    return 'Прямой заход';
  }

  try {
    const referrerUrl = new URL(referrer);

    if (referrerUrl.origin === currentUrl.origin) {
      return null;
    }

    return classifyExternalSource(referrerUrl);
  } catch {
    return 'Прямой заход';
  }
}

export function ensureLeadSourceCookies(locationHref = window.location.href, referrer = document.referrer) {
  const source = resolveLeadSource(new URL(locationHref), referrer);

  if (!source) {
    return;
  }

  if (!readCookie(FIRST_SOURCE_COOKIE)) {
    writeCookie(FIRST_SOURCE_COOKIE, source);
  }

  writeCookie(LAST_SOURCE_COOKIE, source);
}

export function getStoredLeadSources() {
  return {
    firstLeadSource: readCookie(FIRST_SOURCE_COOKIE),
    lastLeadSource: readCookie(LAST_SOURCE_COOKIE),
  };
}
