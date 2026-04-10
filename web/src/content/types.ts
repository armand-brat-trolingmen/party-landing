export type NavigationItem = {
  id: string;
  label: string;
};

export type ContactLink = {
  raw: string;
  display: string;
  href: string;
};

export type SocialLink = {
  id: 'telegram' | 'whatsapp' | 'avito';
  label: string;
  href: string;
};

export type LegalLink = {
  href: string;
  label: string;
};

export type LegalDocument = {
  path: string;
  title: string;
  seoTitle: string;
  description: string;
};
