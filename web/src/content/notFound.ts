import { brand } from './brand';

export const notFound = {
  path: '/404',
  code: '404',
  title: 'Страница не найдена',
  description:
    'Похоже, такой страницы больше нет или ссылка устала праздновать. Вернитесь на главную или сразу посмотрите услуги для мероприятия.',
  primaryAction: {
    label: 'Вернуться на главную',
    href: '/',
  },
  secondaryAction: {
    label: 'Посмотреть услуги',
    href: '/#services',
  },
  seoTitle: `Страница не найдена — ${brand.name}`,
  seoDescription: `Страница не найдена на сайте ${brand.name}. Вернитесь на главную страницу или откройте каталог услуг для праздника.`,
} as const;
