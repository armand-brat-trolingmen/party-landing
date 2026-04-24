const DEFAULT_ALLOWED_ORIGINS = [
  'https://party-everyday.ru',
  'https://www.party-everyday.ru',
  'http://party-everyday.ru',
  'http://www.party-everyday.ru',
];

const LOCALHOST_HOSTS = new Set(['localhost', '127.0.0.1']);

function normalizeOrigin(value: string) {
  try {
    const url = new URL(value.trim());

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
}

function parseConfiguredOrigins(value: string | string[] | undefined) {
  if (!value) {
    return [];
  }

  const source = Array.isArray(value) ? value : value.split(',');
  return source
    .map((item) => normalizeOrigin(item))
    .filter((item): item is string => Boolean(item));
}

export type OriginPolicy = {
  isAllowed(origin: string | null | undefined): boolean;
};

export function createOriginPolicy({ allowedOrigins }: { allowedOrigins?: string | string[] }): OriginPolicy {
  const exactAllowedOrigins = new Set([
    ...DEFAULT_ALLOWED_ORIGINS,
    ...parseConfiguredOrigins(allowedOrigins),
  ]);

  return {
    isAllowed(origin) {
      if (typeof origin !== 'string') {
        return false;
      }

      const normalizedOrigin = normalizeOrigin(origin);

      if (!normalizedOrigin) {
        return false;
      }

      if (exactAllowedOrigins.has(normalizedOrigin)) {
        return true;
      }

      try {
        const url = new URL(normalizedOrigin);
        return url.protocol === 'http:' && LOCALHOST_HOSTS.has(url.hostname);
      } catch {
        return false;
      }
    },
  };
}
