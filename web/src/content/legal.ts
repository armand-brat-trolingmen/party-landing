import type { LegalDocument, LegalLink } from './types';
import { legalDocuments } from './legalDocuments';

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
    privacy: legalDocuments.privacy,
    offer: legalDocuments.offer,
    cookies: legalDocuments.cookies,
  } as const satisfies Record<'privacy' | 'offer' | 'cookies', LegalDocument>,
} as const;
