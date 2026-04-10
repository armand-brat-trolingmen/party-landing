import { brand } from './brand';
import { homepage } from './homepage';
import { legal } from './legal';
import type { OfferingEntity } from './offerings';

export const seo = {
  defaults: {
    siteName: brand.name,
    businessDescription: `${brand.name} — кейтеринг и сладкие станции для частных, детских и корпоративных событий в Москве и Московской области.`,
  },
  home: {
    title: `${brand.name} — кейтеринг для праздников в Москве`,
    description:
      'Фудтраки, сладкая вата и шоколадный фонтан для частных, детских и корпоративных событий в Москве и области. Связь в Telegram, WhatsApp и отзывы на Avito.',
  },
  legal: {
    privacy: {
      title: legal.documents.privacy.seoTitle,
      description: legal.documents.privacy.description,
    },
    terms: {
      title: legal.documents.terms.seoTitle,
      description: legal.documents.terms.description,
    },
    consent: {
      title: legal.documents.consent.seoTitle,
      description: legal.documents.consent.description,
    },
  },
} as const;

export function buildHomeServiceDescription(visibleFormats: string) {
  return `${homepage.hero.description} На сайте представлены форматы: ${visibleFormats}.`;
}

export function getOfferingSeoDescription(offering: OfferingEntity) {
  return offering.price?.display ?? offering.priceFrom;
}
