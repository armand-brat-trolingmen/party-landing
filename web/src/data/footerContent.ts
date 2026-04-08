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
  brand: 'Праздник каждый день',
  descriptor: 'Кейтеринг и сладкие зоны для событий в Москве и области',
  phoneLabel: '+79263919225',
  phoneHref: 'tel:+79263919225',
  emailLabel: 'Glad_2015@bk.ru',
  emailHref: 'mailto:Glad_2015@bk.ru',
  businessName: 'ИП Гладышев Александр Андреевич',
  inn: 'ИНН 501806886358',
  ogrnip: 'ОГРНИП 319508100076437',
  legalAddress: 'Юр. адрес: М.о., г.о. Королев, пр-д Матроросова, д. 3 А, кв. 28.',
  socialLinks: [
    {
      id: 'telegram',
      label: 'Telegram',
      href: 'https://t.me/+79263919225',
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      href: 'https://wa.me/79263919225',
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
    seoTitle: 'Политика конфиденциальности для клиентов Праздник каждый день',
    description: 'Страница политики конфиденциальности Праздник каждый день. Здесь будет размещён актуальный документ проекта.',
  },
  terms: {
    path: '/terms',
    title: 'Пользовательское соглашение',
    seoTitle: 'Пользовательское соглашение для сайта Праздник каждый день',
    description: 'Страница пользовательского соглашения Праздник каждый день. Здесь будет размещён актуальный документ проекта.',
  },
  consent: {
    path: '/consent',
    title: 'Согласие на обработку персональных данных',
    seoTitle: 'Согласие на обработку персональных данных | Праздник каждый день',
    description:
      'Страница согласия на обработку персональных данных Праздник каждый день. Здесь будет размещён актуальный документ проекта.',
  },
} as const satisfies Record<'privacy' | 'terms' | 'consent', LegalDocument>;

