import {
  DEFAULT_LOCALE as ROOT_DEFAULT_LOCALE,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_TYPE,
  OG_IMAGE_URL,
  OG_IMAGE_WIDTH,
  SITE_NAME as ROOT_SITE_NAME,
  SITE_URL as ROOT_SITE_URL,
} from '../../site.config.js';
import { contacts } from '../content/contacts';
import { legal } from '../content/legal';
import type { ArticleEntity } from '../content/articles';
import { services, type OfferingEntity } from '../content/offerings';
import { buildHomeServiceDescription, getOfferingSeoDescription, seo as contentSeo } from '../content/seo';

export const SITE_URL = ROOT_SITE_URL;
export const SITE_NAME = ROOT_SITE_NAME;
export const DEFAULT_LOCALE = ROOT_DEFAULT_LOCALE;
export const DEFAULT_OG_IMAGE = OG_IMAGE_URL;
export const DEFAULT_OG_IMAGE_WIDTH = OG_IMAGE_WIDTH;
export const DEFAULT_OG_IMAGE_HEIGHT = OG_IMAGE_HEIGHT;
export const DEFAULT_OG_IMAGE_TYPE = OG_IMAGE_TYPE;
export const DEFAULT_OG_IMAGE_ALT = `${SITE_NAME} — кейтеринг, сладкие станции и фудтраки для праздников`;
export const BUSINESS_DESCRIPTION = contentSeo.defaults.businessDescription;
export const LOGO_URL = toAbsoluteUrl('/brand-logo.png');

const SERVICE_AREAS = ['Москва', 'Московская область'] as const;
const ORGANIZATION_ID = '#organization';
const LOCAL_BUSINESS_ID = '#local-business';

export type FaqStructuredItem = {
  question: string;
  answer: string;
};

function buildBusinessAddress() {
  const normalizedAddress = legal.business.address.replace(/^Юр\.\s*адрес:\s*/i, '').trim();

  return {
    '@type': 'PostalAddress',
    streetAddress: 'пр-д Матросова, д. 3А, кв. 28',
    addressLocality: 'Королев',
    addressRegion: 'Московская область',
    addressCountry: 'RU',
    description: normalizedAddress,
  };
}

function getOrganizationStructuredData(homeUrl: string) {
  return {
    '@type': 'Organization',
    '@id': `${homeUrl}${ORGANIZATION_ID}`,
    name: SITE_NAME,
    url: homeUrl,
    description: BUSINESS_DESCRIPTION,
    logo: LOGO_URL,
  };
}

function getLocalBusinessStructuredData(homeUrl: string) {
  return {
    '@type': 'LocalBusiness',
    '@id': `${homeUrl}${LOCAL_BUSINESS_ID}`,
    name: SITE_NAME,
    url: homeUrl,
    description: BUSINESS_DESCRIPTION,
    image: DEFAULT_OG_IMAGE,
    logo: LOGO_URL,
    telephone: contacts.phone.raw,
    email: contacts.email.raw,
    areaServed: [...SERVICE_AREAS],
    address: buildBusinessAddress(),
    sameAs: contacts.socialLinks.map((link) => link.href),
    parentOrganization: {
      '@id': `${homeUrl}${ORGANIZATION_ID}`,
    },
  };
}

export function normalizeSeoPath(pathname = '/') {
  const path = pathname.trim();

  if (!path || path === '/') {
    return '/';
  }

  return `/${path.replace(/^\/+/, '').replace(/\/+$/, '')}`;
}

export function normalizeSeoPagePath(pathname = '/') {
  const path = pathname.trim();
  const suffixMatch = path.match(/[?#].*$/);
  const suffix = suffixMatch?.[0] ?? '';
  const pathWithoutSuffix = suffix ? path.slice(0, -suffix.length) : path;
  const normalizedPath = normalizeSeoPath(pathWithoutSuffix || '/');

  if (normalizedPath === '/') {
    return suffix ? `/${suffix}` : '/';
  }

  // Dokploy/Nginx serves prerendered directories as slash-final pages; canonical signals must match that final URL.
  return `${normalizedPath}/${suffix}`;
}

export function toAbsoluteUrl(pathOrUrl = '/') {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const normalizedPath = normalizeSeoPath(pathOrUrl);
  return normalizedPath === '/' ? `${SITE_URL}/` : `${SITE_URL}${normalizedPath}`;
}

export function toAbsolutePageUrl(pathOrUrl = '/') {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    const url = new URL(pathOrUrl);
    return `${url.origin}${normalizeSeoPagePath(`${url.pathname}${url.search}${url.hash}`)}`;
  }

  return `${SITE_URL}${normalizeSeoPagePath(pathOrUrl)}`;
}

export function getHomeStructuredData() {
  const homeUrl = toAbsoluteUrl('/');
  const organizationId = `${homeUrl}${ORGANIZATION_ID}`;
  const localBusinessId = `${homeUrl}${LOCAL_BUSINESS_ID}`;
  const websiteId = `${homeUrl}#website`;
  const serviceId = `${homeUrl}#service`;
  const visibleFormats = services.slice(0, 6).map((service) => service.name).join(', ');

  return [
    getOrganizationStructuredData(homeUrl),
    getLocalBusinessStructuredData(homeUrl),
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
        '@id': localBusinessId,
      },
      areaServed: [...SERVICE_AREAS],
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
  const localBusinessId = `${homeUrl}${LOCAL_BUSINESS_ID}`;
  const pageUrl = toAbsolutePageUrl(offering.kind === 'service' ? `/services/${offering.slug}` : `/extras/${offering.slug}`);
  const collectionUrl = toAbsolutePageUrl(offering.kind === 'service' ? '/#services' : '/#extras');
  const collectionName = offering.kind === 'service' ? 'Услуги' : 'Дополнительные услуги';

  return [
    getOrganizationStructuredData(homeUrl),
    getLocalBusinessStructuredData(homeUrl),
    {
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumbs`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: SITE_NAME,
          item: homeUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: collectionName,
          item: collectionUrl,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: offering.name,
          item: pageUrl,
        },
      ],
    },
    {
      '@type': 'Service',
      '@id': `${pageUrl}#service`,
      name: offering.name,
      serviceType: offering.kind === 'service' ? 'Основная услуга Праздник каждый день' : 'Дополнительная услуга Праздник каждый день',
      description: offering.fullDescription,
      provider: {
        '@id': localBusinessId,
      },
      areaServed: [...SERVICE_AREAS],
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
    },
  ];
}

export function getArticleStructuredData(article: ArticleEntity) {
  const homeUrl = toAbsoluteUrl('/');
  const articlesUrl = toAbsolutePageUrl('/articles');
  const pageUrl = toAbsolutePageUrl(`/articles/${article.slug}`);
  const organizationId = `${homeUrl}${ORGANIZATION_ID}`;
  const graph: Record<string, unknown>[] = [
    getOrganizationStructuredData(homeUrl),
    getLocalBusinessStructuredData(homeUrl),
    {
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumbs`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: SITE_NAME,
          item: homeUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Статьи',
          item: articlesUrl,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: article.h1,
          item: pageUrl,
        },
      ],
    },
    {
      '@type': 'Article',
      '@id': `${pageUrl}#article`,
      headline: article.h1,
      description: article.description,
      image: toAbsoluteUrl(article.heroImage.src),
      mainEntityOfPage: pageUrl,
      inLanguage: 'ru-RU',
      author: {
        '@id': organizationId,
      },
      publisher: {
        '@id': organizationId,
      },
    },
  ];

  if (article.faq.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      mainEntity: article.faq.map((item, index) => ({
        '@type': 'Question',
        '@id': `${pageUrl}#faq-question-${index + 1}`,
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
  }

  return graph;
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
