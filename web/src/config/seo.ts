import {
  DEFAULT_LOCALE as ROOT_DEFAULT_LOCALE,
  OG_IMAGE_URL,
  SITE_NAME as ROOT_SITE_NAME,
  SITE_URL as ROOT_SITE_URL,
} from '../../site.config.js';
import { services, siteContent } from '../data/siteContent';

export const SITE_URL = ROOT_SITE_URL;
export const SITE_NAME = ROOT_SITE_NAME;
export const DEFAULT_LOCALE = ROOT_DEFAULT_LOCALE;
export const DEFAULT_OG_IMAGE = OG_IMAGE_URL;
export const BUSINESS_DESCRIPTION =
  'Party Time — кейтеринг и сладкие зоны для частных, детских и корпоративных событий в Москве и Московской области. Фудтраки, сладкая вата и шоколадный фонтан для мероприятий, где важны вкус, подача и атмосфера.';
export const LOGO_URL = toAbsoluteUrl('/favicon.svg');

export function normalizeSeoPath(pathname = '/') {
  const path = pathname.trim();

  if (!path || path === '/') {
    return '/';
  }

  return `/${path.replace(/^\/+/, '').replace(/\/+$/, '')}`;
}

export function toAbsoluteUrl(pathOrUrl = '/') {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const normalizedPath = normalizeSeoPath(pathOrUrl);
  return normalizedPath === '/' ? `${SITE_URL}/` : `${SITE_URL}${normalizedPath}`;
}

export type FaqStructuredItem = {
  question: string;
  answer: string;
};

export function getHomeStructuredData() {
  const homeUrl = toAbsoluteUrl('/');
  const organizationId = `${homeUrl}#organization`;
  const websiteId = `${homeUrl}#website`;
  const serviceId = `${homeUrl}#service`;
  const visibleFormats = services.map((service) => service.name).join(', ');

  return [
    {
      '@type': 'Organization',
      '@id': organizationId,
      name: SITE_NAME,
      url: homeUrl,
      description: BUSINESS_DESCRIPTION,
      logo: LOGO_URL,
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      name: SITE_NAME,
      url: homeUrl,
      description: BUSINESS_DESCRIPTION,
      inLanguage: 'ru-RU',
      publisher: {
        '@id': organizationId,
      },
    },
    {
      '@type': 'Service',
      '@id': serviceId,
      name: 'Кейтеринг и праздничные зоны Party Time',
      serviceType: 'Кейтеринг для праздников и событий',
      description: `${siteContent.heroDescription} На сайте представлены форматы: ${visibleFormats}.`,
      provider: {
        '@id': organizationId,
      },
      areaServed: ['Москва', 'Московская область'],
      audience: {
        '@type': 'Audience',
        audienceType: 'Частные, детские и корпоративные события',
      },
      url: `${homeUrl}#services`,
    },
  ];
}

export function getFaqStructuredData(items: readonly FaqStructuredItem[]) {
  const homeUrl = toAbsoluteUrl('/');

  return {
    '@type': 'FAQPage',
    '@id': `${homeUrl}#faq`,
    mainEntity: items.map((item, index) => ({
      '@type': 'Question',
      '@id': `${homeUrl}#faq-question-${index + 1}`,
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
