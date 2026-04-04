const DEFAULT_SITE_URL = 'https://partylanding.vercel.app';
const DEFAULT_SITE_NAME = 'Party Landing';
const DEFAULT_LOCALE_VALUE = 'ru_RU';
const DEFAULT_OG_IMAGE_PATH_VALUE = '/og-image.png';

function normalizeSiteUrl(url) {
  return String(url || DEFAULT_SITE_URL).trim().replace(/\/+$/, '');
}

export const SITE_URL_PLACEHOLDER = '__SITE_URL__';
export const SITE_URL = normalizeSiteUrl(process.env.SITE_URL ?? process.env.VITE_SITE_URL ?? DEFAULT_SITE_URL);
export const SITE_NAME = String(process.env.SITE_NAME ?? process.env.VITE_SITE_NAME ?? DEFAULT_SITE_NAME).trim();
export const DEFAULT_LOCALE = String(process.env.DEFAULT_LOCALE ?? process.env.VITE_DEFAULT_LOCALE ?? DEFAULT_LOCALE_VALUE)
  .trim();
export const OG_IMAGE_PATH = String(process.env.OG_IMAGE_PATH ?? process.env.VITE_OG_IMAGE_PATH ?? DEFAULT_OG_IMAGE_PATH_VALUE)
  .trim();
export const OG_IMAGE_URL = /^https?:\/\//i.test(OG_IMAGE_PATH)
  ? OG_IMAGE_PATH
  : `${SITE_URL}${OG_IMAGE_PATH.startsWith('/') ? OG_IMAGE_PATH : `/${OG_IMAGE_PATH}`}`;

export function withSiteUrl(template, siteUrl = SITE_URL) {
  return template.replaceAll(SITE_URL_PLACEHOLDER, normalizeSiteUrl(siteUrl));
}
