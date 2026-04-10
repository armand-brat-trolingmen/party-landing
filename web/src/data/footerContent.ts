import { siteConfig } from '../content';
import type { LegalDocument, LegalLink, SocialLink } from '../content/types';

export type FooterSocialLink = SocialLink;
export type FooterLegalLink = LegalLink;
export type { LegalDocument };

export const footerContent = {
  brand: siteConfig.brand.name,
  descriptor: siteConfig.brand.descriptor,
  phoneLabel: siteConfig.contacts.phone.display,
  phoneHref: siteConfig.contacts.phone.href,
  emailLabel: siteConfig.contacts.email.display,
  emailHref: siteConfig.contacts.email.href,
  businessName: siteConfig.legal.business.name,
  inn: siteConfig.legal.business.inn,
  ogrnip: siteConfig.legal.business.ogrnip,
  legalAddress: siteConfig.legal.business.address,
  socialLinks: siteConfig.contacts.socialLinks as readonly FooterSocialLink[],
  legalLinks: siteConfig.legal.links as readonly FooterLegalLink[],
} as const;

export const legalDocuments = siteConfig.legal.documents as Record<'privacy' | 'terms' | 'consent', LegalDocument>;
