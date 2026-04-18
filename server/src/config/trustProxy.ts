export type TrustProxyConfig = boolean | string | number;

export function parseTrustProxy(value: string | undefined): TrustProxyConfig {
  if (!value) {
    return false;
  }

  const trimmed = value.trim();
  const normalized = trimmed.toLowerCase();

  if (!normalized || normalized === 'false' || normalized === '0') {
    return false;
  }

  if (normalized === 'true') {
    return true;
  }

  const numericValue = Number.parseInt(normalized, 10);

  if (Number.isFinite(numericValue) && String(numericValue) === normalized) {
    return numericValue;
  }

  return trimmed;
}
