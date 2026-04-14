const COOKIE_CONSENT_NAME = 'party_cookie_consent';
const COOKIE_CONSENT_VALUE = 'accepted';
const COOKIE_CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function readCookie(name: string) {
  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

export function hasCookieConsent() {
  return readCookie(COOKIE_CONSENT_NAME) === COOKIE_CONSENT_VALUE;
}

export function acceptCookieConsent() {
  document.cookie = `${COOKIE_CONSENT_NAME}=${COOKIE_CONSENT_VALUE}; Max-Age=${COOKIE_CONSENT_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
}
