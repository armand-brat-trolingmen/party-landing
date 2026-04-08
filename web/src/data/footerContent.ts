import { avitoProfileUrl } from './siteContent';

export type FooterSocialLink = {
  id: 'telegram' | 'whatsapp' | 'avito';
  label: string;
  href: string;
};

export type FooterLegalLink = {
  href: string;
  label: string;
};

export type LegalDocument = {
  path: string;
  title: string;
  seoTitle: string;
  description: string;
};

export const footerContent = {
  brand: 'Party Everyday',
  descriptor: 'Кейтеринг и сладкие зоны для событий в Москве и области',
  phoneLabel: '+7 (999) 999-99-99',
  phoneHref: 'tel:+79999999999',
  emailLabel: 'contact@party-everyday.ru',
  emailHref: 'mailto:contact@party-everyday.ru',
  businessName: 'ИП Гладышев Александр Андреевич',
  inn: 'ИНН 501806886358',
  ogrnip: 'ОГРНИП 319508100076437',
  legalAddress: 'Юр. адрес: М.о., г.о. Королев, пр-д Матроросова, д. 3 А, кв. 28.',
  socialLinks: [
    {
      id: 'telegram',
      label: 'Telegram',
      href: '#telegram',
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      href: '#whatsapp',
    },
    {
      id: 'avito',
      label: 'Avito',
      href: avitoProfileUrl,
    },
  ] as const satisfies readonly FooterSocialLink[],
  legalLinks: [
    {
      href: '/privacy',
      label: 'Политика конфиденциальности',
    },
    {
      href: '/terms',
      label: 'Пользовательское соглашение',
    },
    {
      href: '/consent',
      label: 'Согласие на обработку персональных данных',
    },
  ] as const satisfies readonly FooterLegalLink[],
} as const;

export const legalDocuments = {
  privacy: {
    path: '/privacy',
    title: 'Политика конфиденциальности',
    seoTitle: 'Политика конфиденциальности для клиентов Party Everyday',
    description: 'Страница политики конфиденциальности Party Everyday. Здесь будет размещён актуальный документ проекта.',
  },
  terms: {
    path: '/terms',
    title: 'Пользовательское соглашение',
    seoTitle: 'Пользовательское соглашение для сайта Party Everyday',
    description: 'Страница пользовательского соглашения Party Everyday. Здесь будет размещён актуальный документ проекта.',
  },
  consent: {
    path: '/consent',
    title: 'Согласие на обработку персональных данных',
    seoTitle: 'Согласие на обработку персональных данных | Party Everyday',
    description:
      'Страница согласия на обработку персональных данных Party Everyday. Здесь будет размещён актуальный документ проекта.',
  },
} as const satisfies Record<'privacy' | 'terms' | 'consent', LegalDocument>;
