import { brand } from './brand';
import { homepage } from './homepage';
import { legal } from './legal';
import type { OfferingEntity } from './offerings';

export const seo = {
  defaults: {
    siteName: brand.name,
    businessDescription: `${brand.name} — выездной кейтеринг, сладкие станции, фудтраки и праздничные форматы под ключ для частных, детских и корпоративных событий в Москве и Московской области.`,
  },
  home: {
    title: `${brand.name} — выездной кейтеринг в Москве`,
    description:
      'Выездной кейтеринг для праздников в Москве и области: сладкая вата, попкорн, шоколадный фонтан, фудтраки и станции под ключ для детских, частных и корпоративных событий.',
  },
  legal: {
    privacy: {
      title: legal.documents.privacy.seoTitle,
      description: legal.documents.privacy.description,
    },
    offer: {
      title: legal.documents.offer.seoTitle,
      description: legal.documents.offer.description,
    },
    cookies: {
      title: legal.documents.cookies.seoTitle,
      description: legal.documents.cookies.description,
    },
  },
} as const;

export function buildHomeServiceDescription(visibleFormats: string) {
  return `${homepage.hero.description} На сайте представлены форматы: ${visibleFormats}.`;
}

export function getOfferingSeoDescription(offering: OfferingEntity) {
  return offering.price?.display ?? offering.priceFrom;
}
