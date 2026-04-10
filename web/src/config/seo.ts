import {
  DEFAULT_LOCALE as ROOT_DEFAULT_LOCALE,
  OG_IMAGE_URL,
  SITE_NAME as ROOT_SITE_NAME,
  SITE_URL as ROOT_SITE_URL,
} from '../../site.config.js';
import { buildHomeServiceDescription, getOfferingSeoDescription, siteConfig, type OfferingEntity } from '../content';

export const SITE_URL = ROOT_SITE_URL;
export const SITE_NAME = ROOT_SITE_NAME;
export const DEFAULT_LOCALE = ROOT_DEFAULT_LOCALE;
export const DEFAULT_OG_IMAGE = OG_IMAGE_URL;
export const BUSINESS_DESCRIPTION = siteConfig.seo.defaults.businessDescription;
export const LOGO_URL = toAbsoluteUrl('/brand-logo.png');

export type FaqStructuredItem = {
  question: string;
  answer: string;
};

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

export function getHomeStructuredData() {
  const homeUrl = toAbsoluteUrl('/');
  const organizationId = `${homeUrl}#organization`;
  const websiteId = `${homeUrl}#website`;
  const serviceId = `${homeUrl}#service`;
  const visibleFormats = siteConfig.services.slice(0, 6).map((service) => service.name).join(', ');

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
      name: 'Каталог сладких станций и кейтеринга Праздник каждый день',
      serviceType: 'Кейтеринг для праздников и мероприятий',
      description: buildHomeServiceDescription(visibleFormats),
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

export function getOfferingStructuredData(offering: OfferingEntity) {
  const homeUrl = toAbsoluteUrl('/');
  const organizationId = `${homeUrl}#organization`;
  const pageUrl = toAbsoluteUrl(offering.kind === 'service' ? `/services/${offering.slug}` : `/extras/${offering.slug}`);

  return {
    '@type': 'Service',
    '@id': `${pageUrl}#service`,
    name: offering.name,
    serviceType: offering.kind === 'service' ? 'Основная услуга Праздник каждый день' : 'Дополнительная услуга Праздник каждый день',
    description: offering.fullDescription,
    provider: {
      '@id': organizationId,
    },
    areaServed: ['Москва', 'Московская область'],
    offers: {
      '@type': 'Offer',
      url: pageUrl,
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'RUB',
        valueAddedTaxIncluded: false,
        description: getOfferingSeoDescription(offering),
      },
    },
  };
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

