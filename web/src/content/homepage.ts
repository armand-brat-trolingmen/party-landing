import { homePageContent, moments } from './offerings';
import { contacts } from './contacts';

const heroPosterSlideSizes = '(max-width: 900px) min(100vw - 2rem, 28rem), 31rem';

const heroGallerySlides = [
  {
    id: 'gallery-01',
    image: '/images/hero/hero-gallery-01.jpg',
    fallbackImage: '/images/hero/hero-gallery-01.jpg',
    imageWebpSrcSet:
      '/images/hero/hero-gallery-01-480.webp 480w, /images/hero/hero-gallery-01-720.webp 720w, /images/hero/hero-gallery-01-960.webp 960w',
    sizes: heroPosterSlideSizes,
    width: 960,
    height: 1280,
    alt: 'Party Landing hero gallery photo 1',
  },
  {
    id: 'gallery-02',
    image: '/images/hero/hero-gallery-02.jpg',
    fallbackImage: '/images/hero/hero-gallery-02.jpg',
    imageWebpSrcSet:
      '/images/hero/hero-gallery-02-480.webp 480w, /images/hero/hero-gallery-02-720.webp 720w, /images/hero/hero-gallery-02-960.webp 960w, /images/hero/hero-gallery-02-1280.webp 1280w',
    sizes: heroPosterSlideSizes,
    width: 1920,
    height: 2560,
    alt: 'Party Landing hero gallery photo 2',
  },
  {
    id: 'gallery-03',
    image: '/images/hero/hero-gallery-03.jpg',
    fallbackImage: '/images/hero/hero-gallery-03.jpg',
    imageWebpSrcSet:
      '/images/hero/hero-gallery-03-480.webp 480w, /images/hero/hero-gallery-03-720.webp 720w, /images/hero/hero-gallery-03-960.webp 960w',
    sizes: heroPosterSlideSizes,
    width: 1200,
    height: 1600,
    alt: 'Party Landing hero gallery photo 3',
  },
  {
    id: 'gallery-04',
    image: '/images/hero/hero-gallery-04.jpg',
    fallbackImage: '/images/hero/hero-gallery-04.jpg',
    imageWebpSrcSet:
      '/images/hero/hero-gallery-04-480.webp 480w, /images/hero/hero-gallery-04-720.webp 720w, /images/hero/hero-gallery-04-960.webp 960w',
    sizes: heroPosterSlideSizes,
    width: 960,
    height: 1280,
    alt: 'Party Landing hero gallery photo 4',
  },
  {
    id: 'gallery-05',
    image: '/images/hero/hero-gallery-05.jpg',
    fallbackImage: '/images/hero/hero-gallery-05.jpg',
    imageWebpSrcSet:
      '/images/hero/hero-gallery-05-480.webp 480w, /images/hero/hero-gallery-05-720.webp 720w, /images/hero/hero-gallery-05-960.webp 960w, /images/hero/hero-gallery-05-1280.webp 1280w',
    sizes: heroPosterSlideSizes,
    width: 1920,
    height: 2560,
    alt: 'Party Landing hero gallery photo 5',
  },
  {
    id: 'gallery-06',
    image: '/images/hero/hero-gallery-06.jpg',
    fallbackImage: '/images/hero/hero-gallery-06.jpg',
    imageWebpSrcSet:
      '/images/hero/hero-gallery-06-480.webp 480w, /images/hero/hero-gallery-06-720.webp 720w, /images/hero/hero-gallery-06-960.webp 960w, /images/hero/hero-gallery-06-1280.webp 1280w',
    sizes: heroPosterSlideSizes,
    width: 1920,
    height: 2560,
    alt: 'Party Landing hero gallery photo 6',
  },
  {
    id: 'gallery-07',
    image: '/images/hero/hero-gallery-07.jpg',
    fallbackImage: '/images/hero/hero-gallery-07.jpg',
    imageWebpSrcSet:
      '/images/hero/hero-gallery-07-480.webp 480w, /images/hero/hero-gallery-07-720.webp 720w',
    sizes: heroPosterSlideSizes,
    width: 959,
    height: 1173,
    alt: 'Party Landing hero gallery photo 7',
  },
  {
    id: 'gallery-08',
    image: '/images/hero/hero-gallery-08.jpg',
    fallbackImage: '/images/hero/hero-gallery-08.jpg',
    imageWebpSrcSet:
      '/images/hero/hero-gallery-08-480.webp 480w, /images/hero/hero-gallery-08-720.webp 720w, /images/hero/hero-gallery-08-960.webp 960w, /images/hero/hero-gallery-08-1280.webp 1280w',
    sizes: heroPosterSlideSizes,
    width: 1920,
    height: 2560,
    alt: 'Party Landing hero gallery photo 8',
  },
  {
    id: 'gallery-09',
    image: '/images/hero/hero-gallery-09.jpg',
    fallbackImage: '/images/hero/hero-gallery-09.jpg',
    imageWebpSrcSet:
      '/images/hero/hero-gallery-09-480.webp 480w, /images/hero/hero-gallery-09-720.webp 720w, /images/hero/hero-gallery-09-960.webp 960w',
    sizes: heroPosterSlideSizes,
    width: 960,
    height: 1280,
    alt: 'Party Landing hero gallery photo 9',
  },
  {
    id: 'gallery-10',
    image: '/images/hero/hero-gallery-10.jpg',
    fallbackImage: '/images/hero/hero-gallery-10.jpg',
    imageWebpSrcSet:
      '/images/hero/hero-gallery-10-480.webp 480w, /images/hero/hero-gallery-10-720.webp 720w, /images/hero/hero-gallery-10-960.webp 960w, /images/hero/hero-gallery-10-1280.webp 1280w',
    sizes: heroPosterSlideSizes,
    width: 2560,
    height: 1920,
    alt: 'Party Landing hero gallery photo 10',
  },
  {
    id: 'gallery-11',
    image: '/images/hero/hero-gallery-11.jpg',
    fallbackImage: '/images/hero/hero-gallery-11.jpg',
    imageWebpSrcSet:
      '/images/hero/hero-gallery-11-480.webp 480w, /images/hero/hero-gallery-11-720.webp 720w, /images/hero/hero-gallery-11-960.webp 960w, /images/hero/hero-gallery-11-1280.webp 1280w',
    sizes: heroPosterSlideSizes,
    width: 1920,
    height: 2560,
    alt: 'Party Landing hero gallery photo 11',
  },
  {
    id: 'gallery-12',
    image: '/images/hero/hero-gallery-12.jpg',
    fallbackImage: '/images/hero/hero-gallery-12.jpg',
    imageWebpSrcSet:
      '/images/hero/hero-gallery-12-480.webp 480w, /images/hero/hero-gallery-12-720.webp 720w',
    sizes: heroPosterSlideSizes,
    width: 919,
    height: 1228,
    alt: 'Party Landing hero gallery photo 12',
  },
  {
    id: 'gallery-13',
    image: '/images/hero/hero-gallery-13.jpg',
    fallbackImage: '/images/hero/hero-gallery-13.jpg',
    imageWebpSrcSet:
      '/images/hero/hero-gallery-13-480.webp 480w, /images/hero/hero-gallery-13-720.webp 720w, /images/hero/hero-gallery-13-960.webp 960w, /images/hero/hero-gallery-13-1280.webp 1280w',
    sizes: heroPosterSlideSizes,
    width: 1607,
    height: 2000,
    alt: 'Party Landing hero gallery photo 13',
  },
  {
    id: 'gallery-14',
    image: '/images/hero/hero-gallery-14.jpg',
    fallbackImage: '/images/hero/hero-gallery-14.jpg',
    imageWebpSrcSet:
      '/images/hero/hero-gallery-14-480.webp 480w, /images/hero/hero-gallery-14-720.webp 720w, /images/hero/hero-gallery-14-960.webp 960w, /images/hero/hero-gallery-14-1280.webp 1280w',
    sizes: heroPosterSlideSizes,
    width: 1714,
    height: 2560,
    alt: 'Party Landing hero gallery photo 14',
  },
] as const;


export const heroPosterSlides = [
  {
    id: 'main-fountain',
    image: '/images/hero/hero-main.png',
    fallbackImage: '/images/hero/hero-main.png',
    imageWebpSrcSet:
      '/images/hero/hero-main-480.webp 480w, /images/hero/hero-main-720.webp 720w, /images/hero/hero-main-960.webp 960w, /images/hero/hero-main-1258.webp 1258w',
    sizes: heroPosterSlideSizes,
    width: 1258,
    height: 2048,
    alt: 'Chocolate fountain on the premium food station',
    objectPosition: '52% 44%',
  },
  ...heroGallerySlides,
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
  foodTruckRental: {
    title: 'Аренда фудтраков',
    description:
      'Фудтрак можно взять на краткосрочный или долгосрочный срок: под фестиваль, сезонную точку, бренд-зону или выездную кухню с готовой технической базой.',
    items: [
      {
        image: '/images/food-truck-rental/rental-food-truck-1.webp',
        alt: 'Черный фудтрак MobiTruck SL-7 для аренды',
        width: 1120,
        height: 1493,
      },
      {
        image: '/images/food-truck-rental/rental-food-truck-2.webp',
        alt: 'Красный фудтрак MobiTruck SL-5 для аренды',
        width: 1120,
        height: 840,
      },
      {
        image: '/images/food-truck-rental/rental-food-truck-3.webp',
        alt: 'Желтый фудтрак SpaceBox 5 для аренды',
        width: 1120,
        height: 840,
      },
    ],
    models: ['MobiTruck SL-7', 'MobiTruck SL-5', 'SpaceBox 5'],
    formatsTitle: 'Что можно собрать на базе фудтрака',
    formats:
      'Горячее питание, напитки, десерты, стритфуд, точку выдачи или промозону под бренд. Подбираем модель, цвет фудтрака и комплектацию под площадку, меню и сценарий работы.',
    equipmentTitle: 'Внутри уже есть все для старта',
    equipment: [
      'холодильное и морозильное оборудование',
      'тепловые завесы и кондиционеры',
      'рукомойники с горячей и холодной водой',
      'все фудтраки электрифицированы и готовы к подключению на площадке',
      'дополнительное настольное оборудование: роликовые грили, фритюрницы и жарочные поверхности',
    ],
    pricing: ['Посуточная аренда от 15.000 ₽ в сутки', 'Месячная аренда от 80.000 ₽ в месяц'],
    terms:
      'Итоговая стоимость зависит от срока аренды, модели, площадки, формата работы и комплектации. Детали размещения, подключений и дополнительного оборудования согласуем индивидуально.',
    ctaLabel: 'Узнать условия',
  },
  foodTrucks: {
    title: 'Кейтеринг на фудтраках',
    items: [
      {
        image: '/images/food-trucks/food-truck-1.webp',
        alt: 'Фудтрак для кейтеринга на выездном мероприятии, фото 1',
        width: 1280,
        height: 960,
      },
      {
        image: '/images/food-trucks/food-truck-2.webp',
        alt: 'Фудтрак для кейтеринга на выездном мероприятии, фото 2',
        width: 1280,
        height: 960,
      },
      {
        image: '/images/food-trucks/food-truck-3.webp',
        alt: 'Фудтрак для кейтеринга на выездном мероприятии, фото 3',
        width: 1280,
        height: 960,
      },
      {
        image: '/images/food-trucks/food-truck-5.webp',
        alt: '?????????????? ?????? ???????????????????? ???? ???????????????? ??????????????????????, ???????? 5',
        width: 1280,
        height: 960,
      },
      {
        image: '/images/food-trucks/food-truck-6.webp',
        alt: '?????????????? ?????? ???????????????????? ???? ???????????????? ??????????????????????, ???????? 6',
        width: 1280,
        height: 960,
      },
      {
        image: '/images/food-trucks/food-truck-4.webp',
        alt: '?????????????? ?????? ???????????????????? ???? ???????????????? ??????????????????????, ???????? 4',
        width: 1280,
        height: 960,
      },
    ],
    storyTitle:
      'Стритфуд от профессионалов — это настоящее гастрономическое шоу, где каждая деталь превращает уличную еду в яркий и незабываемый праздник вкуса.',
    storyBody:
      'Мы привозим не просто еду, а готовую гастрономическую сцену для праздника, фестиваля, корпоратива или городского события. Фудтраки создают живую атмосферу, собирают гостей вокруг себя и помогают превратить подачу в полноценную часть впечатления.',
    trustTitle: 'Почему клиенты доверяют нам?',
    trustBody:
      'Мы берем на себя не только подачу, но и организационные детали: помогаем подобрать формат под площадку, количество гостей и сценарий мероприятия. Поэтому заказчики получают понятный процесс, аккуратную работу на площадке и результат, который выглядит ярко и профессионально.',
  },
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
