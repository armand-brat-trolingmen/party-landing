import { homePageContent, moments } from './offerings';
import { contacts } from './contacts';

export const heroPosterSlides = [
  {
    id: 'main-fountain',
    image: '/images/hero/hero-main.png',
    fallbackImage: '/images/hero/hero-main.png',
    imageWebpSrcSet:
      '/images/hero/hero-main-480.webp 480w, /images/hero/hero-main-720.webp 720w, /images/hero/hero-main-960.webp 960w, /images/hero/hero-main-1258.webp 1258w',
    sizes: '(max-width: 900px) min(100vw - 2rem, 28rem), 31rem',
    width: 1258,
    height: 2048,
    alt: 'Шоколадный фонтан на премиальной фуд-станции',
    objectPosition: '52% 44%',
  },
  {
    id: 'cotton-candy',
    image: '/images/hero/hero-cotton.jpg',
    fallbackImage: '/images/hero/hero-cotton.jpg',
    imageWebpSrcSet:
      '/images/hero/hero-cotton-480.webp 480w, /images/hero/hero-cotton-720.webp 720w, /images/hero/hero-cotton-960.webp 960w, /images/hero/hero-cotton-1280.webp 1280w',
    sizes: '(max-width: 900px) min(100vw - 2rem, 28rem), 31rem',
    width: 2560,
    height: 1920,
    alt: 'Сладкая вата в выездном премиальном формате',
    objectPosition: '54% 36%',
  },
] as const;

export const conceptLoop = {
  separator: '•',
  items: [
    'Блины',
    'Фудтраки',
    'Бабл ти',
    'Хотдоги',
    'Сладкая вата',
    'Кейтеринг',
    'Шариковое мороженое',
    'Лимонад',
    'Вафли',
    'Пенная вечеринка',
    'Бургеры',
    'Шоколадный фонтан',
    'Попкорн',
  ],
} as const;

export const faq = {
  title: 'Частые вопросы',
  eyebrow: 'Часто спрашивают',
  description: 'Собрали ответы на частые вопросы, чтобы вам было проще понять, как мы работаем и что потребуется от площадки.',
  items: [
    {
      id: 'when-to-contact',
      question: 'Когда обращаться в «В праздник каждый день»?',
      answer: '',
    },
    {
      id: 'events',
      question: 'На какие праздники можно организовать сладкий кейтеринг?',
      answer: '',
    },
    {
      id: 'rental',
      question: 'Что Вы получаете с арендой станции?',
      answer: '',
    },
    {
      id: 'technical-requirements',
      question: 'Есть ли технические требования для работы станций?',
      answer: '',
    },
    {
      id: 'moscow-region',
      question: 'Работаете ли вы по Москве и Московской области?',
      answer: '',
    },
    {
      id: 'other-region',
      question: 'Можно ли заказать ваши услуги в другой регион?',
      answer: '',
    },
  ],
} as const;

export const contact = {
  title: 'Контакты',
  description: 'Напишите или оставьте заявку удобным способом — поможем быстро сориентироваться по формату и следующему шагу.',
  guideTitle: 'Что удобно написать сразу',
  guideDescription:
    'Так мы быстрее поймём задачу и сможем сразу предложить подходящий вариант, не растягивая диалог на лишние уточнения.',
  exampleMessage:
    'Добрый день! Планируем событие в Москве, ориентир — 60 гостей. Интересны сладкая зона и дополнительная подача. Подскажите, какие форматы лучше подойдут под нашу площадку?',
  promptItems: ['Дата и ориентир по времени', 'Формат события и площадка', 'Количество гостей и желаемые зоны'],
  actions: [
    {
      id: 'telegram',
      label: 'Telegram',
      href: contacts.socialLinks[0].href,
      caption: 'Быстрый канал для первого диалога, референсов и уточнений по проекту.',
      icon: 'telegram',
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      href: contacts.socialLinks[1].href,
      caption: 'Удобно, если хочется обсудить формат короткими сообщениями в течение дня.',
      icon: 'whatsapp',
    },
    {
      id: 'avito',
      label: 'Avito',
      href: contacts.socialLinks[2].href,
      caption: 'Профиль и живые отзывы, которые помогают быстро проверить наш опыт.',
      icon: 'avito',
    },
  ],
} as const;

export const homepage = {
  hero: {
    ...homePageContent.hero,
    titleLines: ['Фуд-станции', 'на ваше', 'мероприятие'],
    slides: heroPosterSlides,
  },
  about: {
    ...homePageContent.about,
    title: 'О нас',
  },
  services: homePageContent.services,
  extras: homePageContent.extras,
  cta: homePageContent.cta,
  moments: {
    ...homePageContent.moments,
    items: moments,
  },
  reviews: homePageContent.reviews,
  conceptLoop,
  faq,
  contact,
} as const;
