import type { LegalDocument, LegalLink } from './types';

export const legal = {
  business: {
    name: 'ИП Гладышев Александр Андреевич',
    inn: 'ИНН 501806886358',
    ogrnip: 'ОГРНИП 319508100076437',
    address: 'Юр. адрес: М.О., г.о. Королев, пр-д Матросова, д. 3 А, кв. 28.',
  },
  links: [
    {
      href: '/privacy',
      label: 'Политика конфиденциальности',
    },
    {
      href: '/offer',
      label: 'Договор-оферта',
    },
    {
      href: '/cookies',
      label: 'Политика использования cookie',
    },
  ] as const satisfies readonly LegalLink[],
  documents: {
    privacy: {
      path: '/privacy',
      title: 'Политика конфиденциальности',
      seoTitle: 'Политика конфиденциальности | Праздник каждый день',
      description:
        'Страница политики конфиденциальности Праздник каждый день. Здесь будет размещен актуальный документ проекта.',
    },
    offer: {
      path: '/offer',
      title: 'Договор-оферта',
      seoTitle: 'Договор-оферта | Праздник каждый день',
      description: 'Страница договора-оферты Праздник каждый день. Здесь будет размещен актуальный документ проекта.',
    },
    cookies: {
      path: '/cookies',
      title: 'Политика использования cookie',
      seoTitle: 'Политика использования cookie | Праздник каждый день',
      description:
        'Страница политики использования cookie Праздник каждый день. Здесь будет размещен актуальный документ проекта.',
    },
  } as const satisfies Record<'privacy' | 'offer' | 'cookies', LegalDocument>,
} as const;
