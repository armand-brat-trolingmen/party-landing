import { homePageContent, moments } from '../data/catalogContent';
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
  {
    id: 'food-truck',
    image: '/images/hero/hero-truck.jpg',
    fallbackImage: '/images/hero/hero-truck.jpg',
    imageWebpSrcSet: '/images/hero/hero-truck-480.webp 480w, /images/hero/hero-truck-720.webp 720w, /images/hero/hero-truck-960.webp 960w',
    sizes: '(max-width: 900px) min(100vw - 2rem, 28rem), 31rem',
    width: 960,
    height: 1280,
    alt: 'Фудтрак как часть кейтеринг-сцены мероприятия',
    objectPosition: '56% 40%',
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
      id: 'events',
      question: 'Для каких мероприятий подходят ваши форматы?',
      answer:
        'Наши сладкие станции и гастроформаты подходят для частных праздников, детских дней рождения, корпоративных встреч, офисных событий и городских мероприятий, где важны вкус, подача и атмосфера.',
    },
    {
      id: 'formats',
      question: 'Можно ли выбрать сразу несколько услуг на одно мероприятие?',
      answer:
        'Да. Мы как раз собираем сайт как каталог, чтобы было удобно комбинировать основные и дополнительные услуги под один сценарий события.',
    },
    {
      id: 'venue',
      question: 'Что обычно требуется от площадки?',
      answer:
        'Требования зависят от выбранной услуги, но чаще всего заранее уточняются электричество, вода, место под установку и логистика доступа. Все детали спокойно сверяем до дня мероприятия.',
    },
    {
      id: 'moscow',
      question: 'Работаете ли вы по Москве и области?',
      answer:
        'Да. Основной радиус работы — Москва и Московская область. Если нужен другой формат выезда, это можно обсудить отдельно.',
    },
    {
      id: 'cta',
      question: 'Как оставить заявку быстрее всего?',
      answer:
        'Самый быстрый вариант — нажать кнопку «Заказать», оставить имя и телефон, а дальше заказчик уже свяжется с вами и поможет с подбором услуги.',
    },
    {
      id: 'extras',
      question: 'Зачем нужны дополнительные услуги?',
      answer:
        'Дополнительные услуги помогают точнее встроить основной формат в площадку, усилить подачу и сделать общий сценарий мероприятия более цельным.',
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
