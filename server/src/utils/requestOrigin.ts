import type { IncomingHttpHeaders } from 'node:http';

function firstHeaderValue(value: string | string[] | undefined) {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return null;
}

function normalizeOrigin(value: string | null) {
  if (!value) {
    return null;
  }

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

export function extractOriginHeader(headers: IncomingHttpHeaders) {
  return normalizeOrigin(firstHeaderValue(headers.origin));
}

export function extractRefererOrigin(headers: IncomingHttpHeaders) {
  return normalizeOrigin(firstHeaderValue(headers.referer));
}

export function pickRequestOrigin(headers: IncomingHttpHeaders) {
  const origin = extractOriginHeader(headers);

  if (origin) {
    return {
      value: origin,
      source: 'origin' as const,
    };
  }

  const refererOrigin = extractRefererOrigin(headers);

  if (refererOrigin) {
    return {
      value: refererOrigin,
      source: 'referer' as const,
    };
  }

  return {
    value: null,
    source: 'none' as const,
  };
}
