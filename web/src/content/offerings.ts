import { formatRubPriceFrom, parseRubPriceFromLabel } from './formatters';

export type CatalogVisual = {
  image?: string;
  alt?: string;
  width?: number;
  height?: number;
  imageWebpSrcSet?: string;
  sizes?: string;
  objectPosition?: string;
  emoji: string;
  tone: 'gold' | 'rose' | 'mint' | 'sky' | 'berry' | 'caramel' | 'chocolate';
};

export type HomeCardImage = {
  src: string;
  fallbackSrc: string;
  width: number;
  height: number;
  sizes: string;
  sourceType?: string;
  objectPosition?: string;
  objectFit?: 'cover' | 'contain';
};

export type ServicePageTariffVariant = {
  label: string;
  price: string;
};

export type ServicePageTariff = {
  title: string;
  subtitle?: string;
  price?: string;
  weekdayPrice?: string;
  note?: string;
  items?: string[];
  variants?: ServicePageTariffVariant[];
};

export type ServicePagePackage = {
  title: string;
  meta?: string;
  items: string[];
  additions?: string[];
};

export type ServicePageDelivery = {
  moscow: string;
  region: string;
};

export type ServicePageComboBadge = {
  label: string;
  text: string;
};

export type ServicePageContent = {
  duration?: string;
  included: string[];
  materials: string[];
  delivery: ServicePageDelivery;
  tariffs: ServicePageTariff[];
  packages?: ServicePagePackage[];
  comboBadge?: ServicePageComboBadge;
  notes?: string[];
};

export type OfferingEntity = {
  kind: 'service' | 'extra';
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  priceFrom: string;
  price?: {
    from: number;
    display: string;
  };
  included: string[];
  ctaLabel: string;
  seoTitle: string;
  seoDescription: string;
  visual: CatalogVisual;
  homeCardImage?: HomeCardImage;
  servicePage?: ServicePageContent;
};

export type MomentEntity = {
  id: string;
  label: string;
  title: string;
  image: string;
  imageWebpSrcSet?: string;
  sizes?: string;
  width: number;
  height: number;
  alt: string;
  objectPosition?: string;
  tone: 'gold' | 'rose' | 'chocolate';
};

export type ReviewProofEntity = {
  id: string;
  author: string;
  eventType: string;
  quote: string;
  ratingLabel: string;
};

const BRAND_NAME = 'Праздник каждый день';

const HOME_SERVICE_CARD_SIZES =
  '(max-width: 720px) calc(100vw - 2.3rem), (max-width: 1079px) 46vw, 31vw';

const HOME_SERVICE_CARD_IMAGE_MAP: Record<string, HomeCardImage> = {
  'cotton-candy': {
    src: '/images/services-home/cotton-candy.webp',
    fallbackSrc: '/images/services-home/cotton-candy.webp',
    width: 1024,
    height: 1024,
    sizes: HOME_SERVICE_CARD_SIZES,
  },
  popcorn: {
    src: '/images/services-home/popcorn.webp',
    fallbackSrc: '/images/services-home/popcorn.webp',
    width: 1024,
    height: 1024,
    sizes: HOME_SERVICE_CARD_SIZES,
  },
  'cotton-candy-popcorn': {
    src: '/images/services-home/cotton-candy-popcorn.webp',
    fallbackSrc: '/images/services-home/cotton-candy-popcorn.webp',
    width: 1024,
    height: 1024,
    sizes: HOME_SERVICE_CARD_SIZES,
  },
  'caramel-apples': {
    src: '/images/services-home/caramel-apples.webp',
    fallbackSrc: '/images/services-home/caramel-apples-ui.png',
    width: 1024,
    height: 1024,
    sizes: HOME_SERVICE_CARD_SIZES,
  },
  'roll-ice-cream': {
    src: '/images/services-home/roll-ice-cream.webp',
    fallbackSrc: '/images/services-home/roll-ice-cream.webp',
    width: 1024,
    height: 1024,
    sizes: HOME_SERVICE_CARD_SIZES,
  },
  'scoop-ice-cream': {
    src: '/images/services-home/scoop-ice-cream.webp',
    fallbackSrc: '/images/services-home/scoop-ice-cream.webp',
    width: 1024,
    height: 1024,
    sizes: HOME_SERVICE_CARD_SIZES,
  },
  'nitro-ice-cream': {
    src: '/images/services-home/nitro-ice-cream.webp',
    fallbackSrc: '/images/services-home/nitro-ice-cream.webp',
    width: 1024,
    height: 1024,
    sizes: HOME_SERVICE_CARD_SIZES,
  },
  'chocolate-fountain': {
    src: '/images/services-home/chocolate-fountain.webp',
    fallbackSrc: '/images/services-home/chocolate-fountain.webp',
    width: 1024,
    height: 1024,
    sizes: HOME_SERVICE_CARD_SIZES,
  },
  'french-hot-dog': {
    src: '/images/services-home/french-hot-dog.webp',
    fallbackSrc: '/images/services-home/french-hot-dog-ui.png',
    width: 1024,
    height: 1024,
    sizes: HOME_SERVICE_CARD_SIZES,
  },
  'danish-hot-dog': {
    src: '/images/services-home/danish-hot-dog.webp',
    fallbackSrc: '/images/services-home/danish-hot-dog.webp',
    width: 1024,
    height: 1024,
    sizes: HOME_SERVICE_CARD_SIZES,
  },
  burgers: {
    src: '/images/services-home/burgers.webp',
    fallbackSrc: '/images/services-home/burgers.webp',
    width: 1024,
    height: 1024,
    sizes: HOME_SERVICE_CARD_SIZES,
  },
  'belgian-waffles': {
    src: '/images/services-home/belgian-waffles.webp',
    fallbackSrc: '/images/services-home/belgian-waffles.webp',
    width: 1024,
    height: 1024,
    sizes: HOME_SERVICE_CARD_SIZES,
  },
  pancakes: {
    src: '/images/services-home/pancakes.webp',
    fallbackSrc: '/images/services-home/pancakes-ui.png',
    width: 1024,
    height: 1024,
    sizes: HOME_SERVICE_CARD_SIZES,
  },
  'champagne-pyramid': {
    src: '/images/services-home/champagne-pyramid.webp',
    fallbackSrc: '/images/services-home/champagne-pyramid.webp',
    width: 1024,
    height: 1024,
    sizes: HOME_SERVICE_CARD_SIZES,
  },
  'craft-lemonade': {
    src: '/images/services-home/craft-lemonade.webp',
    fallbackSrc: '/images/services-home/craft-lemonade.webp',
    width: 1024,
    height: 1024,
    sizes: HOME_SERVICE_CARD_SIZES,
  },
  'bubble-tea': {
    src: '/images/services-home/bubble-tea.webp',
    fallbackSrc: '/images/services-home/bubble-tea.webp',
    width: 1024,
    height: 1024,
    sizes: HOME_SERVICE_CARD_SIZES,
  },
  'foam-cannon': {
    src: '/images/services-home/foam-cannon.webp',
    fallbackSrc: '/images/services-home/foam-cannon.webp',
    width: 1024,
    height: 1024,
    sizes: HOME_SERVICE_CARD_SIZES,
    objectFit: 'contain',
  },
};

const MOMENT_ALT_MAP: Record<string, string> = {
  'moment-truck': `Фудтрак ${BRAND_NAME} на выездном событии`,
  'moment-cotton': `Стойка сладкой ваты ${BRAND_NAME} на празднике`,
  'moment-fountain': `Шоколадный фонтан ${BRAND_NAME} в десертной зоне`,
};

function buildOfferingSeoTitle(offering: Pick<OfferingEntity, 'kind' | 'name'>) {
  return offering.kind === 'service'
    ? `${offering.name} на мероприятие — ${BRAND_NAME}`
    : `${offering.name} для мероприятия — ${BRAND_NAME}`;
}

function buildOfferingSeoDescription(offering: Pick<OfferingEntity, 'name' | 'shortDescription'>) {
  return `${offering.name} от ${BRAND_NAME} для мероприятий в Москве и области. ${offering.shortDescription}`;
}

function buildOfferingAlt(name: string) {
  return `Иллюстрация услуги «${name}» — ${BRAND_NAME}`;
}

function normalizeOffering(offering: OfferingEntity): OfferingEntity {
  const priceFromValue = parseRubPriceFromLabel(offering.priceFrom);

  return {
    ...offering,
    price: {
      from: priceFromValue,
      display: formatRubPriceFrom(priceFromValue),
    },
    seoTitle: buildOfferingSeoTitle(offering),
    seoDescription: buildOfferingSeoDescription(offering),
    homeCardImage: offering.kind === 'service' ? HOME_SERVICE_CARD_IMAGE_MAP[offering.slug] : offering.homeCardImage,
    servicePage: offering.kind === 'service' ? SERVICE_PAGE_CONTENT_BY_SLUG[offering.slug] : offering.servicePage,
    visual: {
      ...offering.visual,
      emoji: offering.visual.emoji,
      alt: buildOfferingAlt(offering.name),
    },
  };
}

function normalizeMoment(moment: MomentEntity): MomentEntity {
  return {
    ...moment,
    alt: MOMENT_ALT_MAP[moment.id] ?? moment.alt,
  };
}

type ServiceDraft = {
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  priceFrom: string;
  included: string[];
  ctaLabel: string;
  tone: CatalogVisual['tone'];
};

function createService({
  slug,
  name,
  shortDescription,
  fullDescription,
  priceFrom,
  included,
  ctaLabel,
  tone,
}: ServiceDraft): OfferingEntity {
  return {
    kind: 'service',
    slug,
    name,
    shortDescription,
    fullDescription,
    priceFrom,
    included,
    ctaLabel,
    seoTitle: '',
    seoDescription: '',
    visual: {
      emoji: '',
      tone,
    },
  };
}

export const homePageContent = {
  hero: {
    eyebrow: BRAND_NAME,
    title: 'Фуд-станции на ваше мероприятие',
    description:
      'Праздник каждый день создаёт фуд-станции, сладкие зоны и выездные форматы для мероприятий в Москве и области.',
    primaryActionLabel: 'Заказать',
    secondaryActionLabel: 'В каталог',
  },
  about: {
    eyebrow: 'Манифест',
    description:
      'Собираем праздничные форматы так, чтобы они выглядели частью общей композиции события, а не отдельной активностью на площадке.',
    manifest:
      'Компания «Праздник Каждый День» — это команда, которая превращает события в масштабные впечатления. С 2018 года мы реализуем проекты по всей России, нарабатывая опыт на крупнейших площадках и самых амбициозных мероприятиях. За это время мы стали надежным партнером для тех, кто ценит качество, скорость и безупречный результат. Мы работаем с событиями любого уровня — от частных мероприятий до масштабных федеральных проектов. Берем на себя любые объемы и всегда доводим задачу до идеального результата, независимо от сложности и географии. С нами ваш проект — это не просто событие, а эффект, который запоминается.',
    manifestParagraphs: [
      'Компания «Праздник Каждый День» — это команда, которая превращает события в масштабные впечатления.',
      'С 2018 года мы реализуем проекты по всей России, нарабатывая опыт на крупнейших площадках и самых амбициозных мероприятиях. За это время мы стали надежным партнером для тех, кто ценит качество, скорость и безупречный результат.',
      'Мы работаем с событиями любого уровня — от частных мероприятий до масштабных федеральных проектов. Берем на себя любые объемы и всегда доводим задачу до идеального результата, независимо от сложности и географии.',
      'С нами ваш проект — это не просто событие, а эффект, который запоминается.',
    ],
    layers: [
      {
        id: 'taste',
        label: 'Вкус',
        description:
          'Делаем так, чтобы станции работали не только визуально, но и действительно собирали гостей вокруг себя.',
      },
      {
        id: 'staging',
        label: 'Подача',
        description:
          'Каждый формат выглядит как часть общей красивой сцены и усиливает впечатление от события.',
      },
      {
        id: 'calm',
        label: 'Спокойствие',
        description:
          'Продумываем организацию заранее, поэтому площадка работает спокойно и без лишней суеты.',
      },
    ],
    facts: [
      {
        id: 'years',
        value: '7+',
        label: 'лет в праздничных форматах',
      },
      {
        id: 'events',
        value: '300+',
        label: 'событий обслужено',
      },
      {
        id: 'clients',
        value: '1000+',
        label: 'довольных клиентов',
      },
    ],
  },
  services: {
    eyebrow: 'Каталог услуг',
    title: 'Услуги',
    description:
      'Собрали основные форматы в виде аккуратного меню-витрины, чтобы было проще быстро сориентироваться и перейти к нужной услуге.',
    initialVisibleCount: 9,
    revealLabel: 'Показать ещё',
    collapseLabel: 'Свернуть',
  },
  extras: {
    eyebrow: 'Дополнительные услуги',
    title: 'Доп. услуги',
    description:
      'Небольшие дополнительные решения, которые усиливают подачу, делают станцию выразительнее и помогают подстроиться под конкретную площадку.',
  },
  cta: {
    eyebrow: 'Короткая заявка',
    title: 'Оставьте заявку на мероприятие',
    description:
      'Оставьте контакты, и мы быстро свяжемся, поможем подобрать формат и подскажем следующий шаг.',
    actionLabel: 'Заказать',
    consentPrefix: 'Нажимая на кнопку, вы соглашаетесь с',
  },
  moments: {
    eyebrow: 'Лента моментов',
    title: 'Красивые кадры с реальных событий',
    description:
      'До самих отзывов показываем атмосферу вживую: как выглядят станции, как они работают в пространстве и как собирают вокруг себя гостей.',
  },
  reviews: {
    eyebrow: 'Отзывы',
    title: 'Отзывы клиентов',
    description:
      'Собрали аккуратный proof-блок с отзывами и оставили переход на Avito, чтобы можно было быстро проверить профиль и внешний социальный сигнал.',
    avitoTitle: 'Проверить отзывы на Avito',
    avitoDescription: `Часть живых отзывов и профиль ${BRAND_NAME} можно посмотреть на Avito.`,
  },
} as const;

const rawServices: readonly OfferingEntity[] = [
  createService({
    slug: 'cotton-candy',
    name: 'Сахарная вата',
    shortDescription: 'Лёгкий сладкий формат для мероприятий, где нужна понятная и фотогеничная подача.',
    fullDescription:
      'Сахарная вата подходит для детских, семейных и городских мероприятий, где важны лёгкость, узнаваемость и дружелюбная атмосфера. Формат удобно встраивается в праздник как самостоятельная сладкая точка или как часть более широкой десертной зоны.',
    priceFrom: 'от 12.000',
    included: ['Стойка под выдачу', 'Базовые ингредиенты', 'Работа оператора'],
    ctaLabel: 'Заказать сахарную вату',
    tone: 'rose',
  }),
  createService({
    slug: 'popcorn',
    name: 'Попкорн',
    shortDescription: 'Простой и любимый формат, который легко вовлекает гостей и работает в разном темпе события.',
    fullDescription:
      'Попкорн хорошо подходит для детских праздников, уличных акций и неформальных корпоративных событий, где нужна знакомая и удобная гастрономическая точка. Он легко воспринимается гостями и не перегружает общую композицию площадки.',
    priceFrom: 'от 13.000',
    included: ['Стойка под выдачу', 'Попкорн и расходные материалы', 'Работа оператора'],
    ctaLabel: 'Заказать попкорн',
    tone: 'gold',
  }),
  createService({
    slug: 'cotton-candy-popcorn',
    name: 'Сахарная вата + попкорн',
    shortDescription: 'Комбинированная сладкая зона для событий, где хочется закрыть сразу два понятных гостям формата.',
    fullDescription:
      'Комбо из сахарной ваты и попкорна удобно использовать на мероприятиях с активным потоком гостей, когда нужна сразу более насыщенная сладкая точка. Такой формат помогает сделать зону визуально богаче и даёт гостям быстрый выбор без перегруза.',
    priceFrom: 'от 21.000',
    included: ['Две точки выдачи', 'Базовые ингредиенты', 'Работа персонала'],
    ctaLabel: 'Заказать сахарную вату и попкорн',
    tone: 'berry',
  }),
  createService({
    slug: 'caramel-apples',
    name: 'Карамельные яблоки',
    shortDescription: 'Сладкий акцент для мероприятий, где хочется добавить фотогеничную и сезонную десертную подачу.',
    fullDescription:
      'Карамельные яблоки хорошо подходят для ярмарок, сезонных праздников, детских мероприятий и камерных корпоративных форматов, где важна заметная и аккуратная десертная зона. Станция выглядит выразительно сама по себе и легко встраивается в сладкую зону как отдельный акцент.',
    priceFrom: 'от 12.500',
    included: ['Станция выдачи', 'Подготовленные яблоки в карамели', 'Работа оператора'],
    ctaLabel: 'Заказать карамельные яблоки',
    tone: 'caramel',
  }),
  createService({
    slug: 'roll-ice-cream',
    name: 'Мороженое (Ролл)',
    shortDescription: 'Формат с приготовлением на глазах у гостей, который добавляет десертной зоне живой ритм.',
    fullDescription:
      'Ролл-мороженое подходит для мероприятий, где важен эффект свежего приготовления и хочется добавить в сладкую зону больше динамики. Это понятный шоу-формат, который хорошо собирает вокруг себя гостей и поддерживает интерес в течение всего события.',
    priceFrom: 'от 24.000',
    included: ['Охлаждаемая станция', 'Базовые вкусы и топпинги', 'Работа мастера'],
    ctaLabel: 'Заказать ролл-мороженое',
    tone: 'sky',
  }),
  createService({
    slug: 'scoop-ice-cream',
    name: 'Мороженое (Шариковое)',
    shortDescription: 'Классический десертный формат для событий, где нужна аккуратная и знакомая гостям подача.',
    fullDescription:
      'Шариковое мороженое удобно для частных и корпоративных мероприятий, где важно дать гостям понятный десерт без сложной механики. Формат легко встраивается в общий сценарий и хорошо работает как самостоятельная сладкая станция.',
    priceFrom: 'от 15.000',
    included: ['Холодильная витрина', 'Базовые вкусы', 'Работа оператора'],
    ctaLabel: 'Заказать шариковое мороженое',
    tone: 'mint',
  }),
  createService({
    slug: 'nitro-ice-cream',
    name: 'Мороженое (Азотное)',
    shortDescription: 'Десертный формат с более выраженным вау-эффектом для событий, где важна эмоция приготовления.',
    fullDescription:
      'Азотное мороженое подходит для мероприятий, где хочется усилить впечатление от десертной зоны и добавить элемент шоу. Формат привлекает внимание гостей и делает подачу более запоминающейся, сохраняя при этом аккуратный внешний вид станции.',
    priceFrom: 'от 17.000',
    included: ['Оборудование для приготовления', 'Базовые вкусы', 'Работа мастера'],
    ctaLabel: 'Заказать азотное мороженое',
    tone: 'chocolate',
  }),
  createService({
    slug: 'chocolate-fountain',
    name: 'Шоколадный фонтан',
    shortDescription: 'Тёплый сладкий акцент для мероприятий, где нужна щедрая и визуально выразительная десертная точка.',
    fullDescription:
      'Шоколадный фонтан хорошо работает на частных и корпоративных событиях, когда хочется добавить столу более праздничное и собранное ощущение. Этот формат воспринимается как центральный десертный акцент и помогает сделать сладкую зону более заметной.',
    priceFrom: 'от 11.500',
    included: ['Фонтан и подготовка', 'Шоколад для работы', 'Сопровождение на площадке'],
    ctaLabel: 'Заказать шоколадный фонтан',
    tone: 'chocolate',
  }),
  createService({
    slug: 'french-hot-dog',
    name: 'Хот-дог (Французский)',
    shortDescription: 'Удобный формат для событий, где нужен быстрый и понятный street-food с аккуратной подачей.',
    fullDescription:
      'Французский хот-дог подходит для мероприятий с активным потоком гостей, когда важно сочетание скорости выдачи и понятного вкуса. Формат легко включается в общий ритм события и хорошо работает как самостоятельная гастрономическая точка.',
    priceFrom: 'от 15.000',
    included: ['Станция выдачи', 'Базовые ингредиенты', 'Работа персонала'],
    ctaLabel: 'Заказать французские хот-доги',
    tone: 'caramel',
  }),
  createService({
    slug: 'danish-hot-dog',
    name: 'Хот-дог (Датский)',
    shortDescription: 'Более насыщенный формат хот-дога для событий, где нужен узнаваемый акцент уличной еды.',
    fullDescription:
      'Датский хот-дог подходит для неформальных и корпоративных мероприятий, где хочется добавить в гастрозону более плотный и выразительный формат. Он хорошо справляется с активной выдачей и остаётся понятным для гостей разного возраста.',
    priceFrom: 'от 17.500',
    included: ['Станция выдачи', 'Базовые ингредиенты', 'Работа персонала'],
    ctaLabel: 'Заказать датские хот-доги',
    tone: 'caramel',
  }),
  createService({
    slug: 'burgers',
    name: 'Бургеры',
    shortDescription: 'Сытный гастроформат для мероприятий, где нужна понятная и уверенная точка основного угощения.',
    fullDescription:
      'Бургеры хорошо подходят для городских, корпоративных и частных событий, где гости ожидают более плотную еду, а не только сладкие форматы. Такой формат удобно использовать как самостоятельную точку или как часть более крупной гастрономической линейки.',
    priceFrom: 'от 15.000',
    included: ['Станция приготовления', 'Базовый набор ингредиентов', 'Работа персонала'],
    ctaLabel: 'Заказать бургеры',
    tone: 'gold',
  }),
  createService({
    slug: 'belgian-waffles',
    name: 'Бельгийские вафли',
    shortDescription: 'Тёплый десертный формат с понятной подачей для мероприятий с акцентом на уют и сладкую классику.',
    fullDescription:
      'Бельгийские вафли хорошо работают на семейных, частных и корпоративных событиях, где нужна десертная станция с мягким, тёплым впечатлением. Формат выглядит аккуратно, быстро считывается гостями и легко дополняется топпингами под сценарий мероприятия.',
    priceFrom: 'от 17.000',
    included: ['Вафельная станция', 'Базовые топпинги', 'Работа оператора'],
    ctaLabel: 'Заказать бельгийские вафли',
    tone: 'mint',
  }),
  createService({
    slug: 'pancakes',
    name: 'Блины',
    shortDescription: 'Тёплая гастрономическая точка для мероприятий, где важна уютная и знакомая гостям подача.',
    fullDescription:
      'Блины подходят для семейных, городских и корпоративных событий, где хочется предложить гостям понятный и комфортный формат. Такая станция хорошо работает в спокойном ритме и остаётся уместной как в помещении, так и на выездной площадке.',
    priceFrom: 'от 18.000',
    included: ['Блинная станция', 'Базовые начинки', 'Работа персонала'],
    ctaLabel: 'Заказать блины',
    tone: 'caramel',
  }),
  createService({
    slug: 'champagne-pyramid',
    name: 'Пирамида из шампанского',
    shortDescription: 'Эффектный формат встречи гостей для мероприятий, где важно красивое первое впечатление.',
    fullDescription:
      'Пирамида из шампанского подходит для встречи гостей, торжественных открытий и событий, где важен выразительный старт. Этот формат работает как визуальный акцент и помогает задать мероприятию более праздничный тон с первых минут.',
    priceFrom: 'от 12.000',
    included: ['Сборка пирамиды', 'Базовый сетап зоны', 'Сопровождение подачи'],
    ctaLabel: 'Заказать пирамиду из шампанского',
    tone: 'sky',
  }),
  createService({
    slug: 'craft-lemonade',
    name: 'Крафтовый лимонад',
    shortDescription: 'Освежающая напиточная станция для событий, где нужен лёгкий и чистый формат подачи.',
    fullDescription:
      'Крафтовый лимонад хорошо подходит для тёплых сезонов, зон встречи гостей и мероприятий с активным потоком гостей, где нужен освежающий напиточный акцент. Формат помогает сделать гастрономическую часть легче и визуально более воздушной.',
    priceFrom: 'от 15.000',
    included: ['Напиточная стойка', 'Базовые вкусы лимонада', 'Стаканы и подача'],
    ctaLabel: 'Заказать крафтовый лимонад',
    tone: 'mint',
  }),
  createService({
    slug: 'bubble-tea',
    name: 'Бабл ти',
    shortDescription: 'Современный напиточный формат для мероприятий, где хочется добавить заметный и фотогеничный акцент.',
    fullDescription:
      'Бабл ти подходит для молодёжных, городских и корпоративных событий, где важна современная подача и узнаваемый формат. Станция хорошо привлекает внимание и помогает сделать напиточную часть программы более живой.',
    priceFrom: 'от 15.000',
    included: ['Станция приготовления', 'Базовые вкусы', 'Работа оператора'],
    ctaLabel: 'Заказать бабл ти',
    tone: 'berry',
  }),
  createService({
    slug: 'foam-cannon',
    name: 'Пенная пушка',
    shortDescription: 'Активный формат для событий на открытых площадках, где нужна яркая развлекательная точка.',
    fullDescription:
      'Пенная пушка подходит для летних праздников, детских мероприятий и выездных программ, где важны движение, эмоции и вовлечённость гостей. Это формат для событий, которые хотят усилить игровую часть программы и добавить ей более запоминающийся характер.',
    priceFrom: 'от 13.500',
    included: ['Оборудование для работы', 'Подготовка площадки', 'Сопровождение оператора'],
    ctaLabel: 'Заказать пенную пушку',
    tone: 'sky',
  }),
] as const;

const rawExtras: readonly OfferingEntity[] = [
  {
    kind: 'extra',
    slug: 'branded-cart',
    name: 'Брендирование тележки для кейтеринга',
    shortDescription:
      'Аккуратно оформляем тележку под стиль события, чтобы зона выглядела частью общей визуальной концепции.',
    fullDescription:
      'Брендирование тележки для кейтеринга помогает встроить станцию в айдентику бренда, корпоративного события или частного праздника. Мы согласуем визуальные акценты и подачу, чтобы тележка выглядела собранно и уместно на площадке.',
    priceFrom: 'от 7 000 ₽',
    included: ['Адаптация оформления тележки', 'Согласование визуальных акцентов', 'Интеграция в общую концепцию'],
    ctaLabel: 'Заказать брендирование тележки',
    seoTitle: 'Брендирование тележки для кейтеринга — Праздник каждый день',
    seoDescription:
      'Брендирование тележки для кейтеринга от Праздник каждый день. Оформляем тележку под фирменный стиль, сценарий и визуальную концепцию мероприятия.',
    visual: {
      image: '/images/extras/branding-ui.png',
      imageWebpSrcSet: '/images/extras/branding.webp',
      width: 1536,
      height: 1024,
      emoji: '',
      tone: 'gold',
    },
  },
  {
    kind: 'extra',
    slug: 'equipment-rental',
    name: 'Аренда оборудования',
    shortDescription:
      'Подбираем и предоставляем оборудование, которое помогает аккуратно собрать рабочую зону под формат события.',
    fullDescription:
      'Аренда оборудования подходит, когда для мероприятия нужна дополнительная техническая база или отдельные элементы для рабочей зоны. Мы уточняем задачу, площадку и формат, а затем подбираем оборудование под сценарий события.',
    priceFrom: 'от 6 000 ₽',
    included: ['Подбор оборудования', 'Согласование состава аренды', 'Передача под формат площадки'],
    ctaLabel: 'Заказать аренду оборудования',
    seoTitle: 'Аренда оборудования для мероприятия — Праздник каждый день',
    seoDescription:
      'Аренда оборудования от Праздник каждый день для мероприятий в Москве и области. Подбираем оборудование под формат площадки и сценарий события.',
    visual: {
      image: '/images/extras/equipment-ui.png',
      imageWebpSrcSet: '/images/extras/equipment-ui.webp',
      width: 1024,
      height: 1024,
      emoji: '',
      tone: 'sky',
    },
  },
  {
    kind: 'extra',
    slug: 'plov-station',
    name: 'Станция плова',
    shortDescription:
      'Гастрономическая точка с более плотной подачей для мероприятий, где нужен сытный формат и выразительный ароматный акцент.',
    fullDescription:
      'Станция плова подходит для городских, семейных и корпоративных событий, где хочется добавить горячее блюдо с понятной подачей и живой атмосферой приготовления. Такой формат хорошо работает как самостоятельная гастрозона или как часть более насыщенной выездной кухни.',
    priceFrom: 'от 10 000 ₽',
    included: ['Подбор формата станции', 'Согласование подачи под площадку', 'Подготовка гастрозоны к работе'],
    ctaLabel: 'Заказать станцию плова',
    seoTitle: 'Станция плова для мероприятия — Праздник каждый день',
    seoDescription:
      'Станция плова от Праздник каждый день для мероприятий в Москве и области. Подберём формат подачи и встроим горячую гастрозону в общий сценарий события.',
    visual: {
      image: '/images/extras/plov-ui.png',
      imageWebpSrcSet: '/images/extras/plov-ui.webp',
      width: 1024,
      height: 1024,
      emoji: '',
      tone: 'gold',
    },
  },
] as const;

const rawMoments: readonly MomentEntity[] = [
  {
    id: 'moment-truck',
    label: 'Фудтрак',
    title: 'Фудтрак, возле которого гости собираются сами собой.',
    image: '/images/reviews/review-truck-1.png',
    imageWebpSrcSet: '/images/reviews/review-truck-1-960.webp 960w, /images/reviews/review-truck-1-1166.webp 1166w',
    sizes: '(max-width: 860px) calc(100vw - 3rem), 42rem',
    width: 1166,
    height: 737,
    alt: 'Фудтрак Праздник каждый день на выездном событии',
    objectPosition: '50% 50%',
    tone: 'gold',
  },
  {
    id: 'moment-cotton',
    label: 'Сладкая вата',
    title: 'Сладкая вата, которую сначала фотографируют, а потом просят повторить.',
    image: '/images/reviews/review-cotton-1.png',
    imageWebpSrcSet:
      '/images/reviews/review-cotton-1-960.webp 960w, /images/reviews/review-cotton-1-1280.webp 1280w',
    sizes: '(max-width: 860px) calc(100vw - 3rem), 42rem',
    width: 1280,
    height: 960,
    alt: 'Стойка сладкой ваты Праздник каждый день на празднике',
    objectPosition: '50% 42%',
    tone: 'rose',
  },
  {
    id: 'moment-fountain',
    label: 'Шоколадный фонтан',
    title: 'Шоколадный фонтан, к которому гости возвращаются за добавкой весь вечер.',
    image: '/images/reviews/review-fountain-2.jpg',
    imageWebpSrcSet: '/images/reviews/review-fountain-2-960.webp 960w, /images/reviews/review-fountain-2-1600.webp 1600w',
    sizes: '(max-width: 860px) calc(100vw - 3rem), 46rem',
    width: 1920,
    height: 2560,
    alt: 'Шоколадный фонтан Праздник каждый день в десертной зоне',
    objectPosition: '50% 56%',
    tone: 'chocolate',
  },
] as const;

type ServicePageDraft = {
  duration?: string;
  included?: string[];
  materials?: string[];
  delivery?: ServicePageDelivery;
  tariffs: ServicePageTariff[];
  packages?: ServicePagePackage[];
  comboBadge?: ServicePageComboBadge;
  notes?: string[];
};

const DEFAULT_SERVICE_PAGE_INCLUDED = ['Монтаж и демонтаж', 'Работа специалиста', 'Расходные материалы', 'Подготовка зоны выдачи'];

const DEFAULT_SERVICE_PAGE_MATERIALS = [
  'Подготовка рабочей зоны под формат мероприятия',
  'Расходные материалы и инвентарь для комфортной работы',
  'Оборудование и материалы под выбранный тариф',
];

const COLOR_COTTON_CANDY_NOTE = 'Цветная сахарная вата +1.000 ₽ к стоимости';

const DEFAULT_DELIVERY: ServicePageDelivery = {
  moscow: 'Москва — 3.500 ₽',
  region: 'Московская область — рассчитывается индивидуально по удаленности площадки',
};

const CHAMPAGNE_DELIVERY: ServicePageDelivery = DEFAULT_DELIVERY;

const DEFAULT_TARIFF_ITEMS = ['Монтаж и демонтаж', 'Работа специалиста', 'Расходные материалы'];

const COMBO_DISCOUNT_BADGE: ServicePageComboBadge = {
  label: 'Комбо −20%',
  text: 'Скидка действует при заказе пирамиды из шампанского вместе с шоколадным фонтаном и применяется к этим двум услугам.',
};

const DURATION_PATTERN = /(\d+\s*(?:часов|часа|час|минуты|минута|минут))/u;

function extractDurationFromText(value?: string) {
  if (!value) {
    return undefined;
  }

  return value.match(DURATION_PATTERN)?.[1];
}

function resolveMinimumTariffDuration(tariffs: readonly ServicePageTariff[]) {
  const minimumTariff = tariffs[0];

  if (!minimumTariff) {
    return undefined;
  }

  return extractDurationFromText(minimumTariff.subtitle) ?? extractDurationFromText(minimumTariff.title);
}

function createServicePage({
  duration,
  included = DEFAULT_SERVICE_PAGE_INCLUDED,
  materials = DEFAULT_SERVICE_PAGE_MATERIALS,
  delivery = DEFAULT_DELIVERY,
  tariffs,
  packages,
  comboBadge,
  notes,
}: ServicePageDraft): ServicePageContent {
  return {
    duration: duration ?? resolveMinimumTariffDuration(tariffs),
    included,
    materials,
    delivery,
    tariffs,
    packages,
    comboBadge,
    notes,
  };
}

function tariff(title: string, price: string, note?: string): ServicePageTariff {
  return { title, price, note, items: DEFAULT_TARIFF_ITEMS };
}

function portionTariff(title: string, subtitle: string, price: string): ServicePageTariff {
  return { title, subtitle, price, items: DEFAULT_TARIFF_ITEMS };
}

const SERVICE_PAGE_CONTENT_BY_SLUG: Record<string, ServicePageContent> = {
  'cotton-candy': createServicePage({
    notes: [COLOR_COTTON_CANDY_NOTE],
    tariffs: [
      tariff('2 часа', '12.000 ₽'),
      tariff('3 часа', '16.500 ₽'),
      tariff('4 часа', '21.000 ₽'),
    ],
  }),
  popcorn: createServicePage({
    tariffs: [tariff('2 часа', '13.000 ₽'), tariff('3 часа', '17.500 ₽'), tariff('4 часа', '22.000 ₽')],
  }),
  'cotton-candy-popcorn': createServicePage({
    notes: [COLOR_COTTON_CANDY_NOTE],
    tariffs: [tariff('2 часа', '21.000 ₽'), tariff('3 часа', '30.000 ₽'), tariff('4 часа', '38.000 ₽')],
  }),
  'caramel-apples': createServicePage({
    included: ['Монтаж и демонтаж', 'Подготовка станции', 'Расходные материалы', 'Работа специалиста'],
    materials: [
      'Подбираем формат подачи под площадку и поток гостей',
      'Готовим яблоки, карамель и расходные материалы под согласованный объём',
      'Настраиваем станцию так, чтобы она выглядела аккуратно и спокойно работала в ритме мероприятия',
    ],
    tariffs: [
      portionTariff('50 порций', '1 час', '12.500 ₽'),
      portionTariff('100 порций', '2 часа', '22.000 ₽'),
      portionTariff('150 порций', '3 часа', '31.500 ₽'),
    ],
  }),
  'roll-ice-cream': createServicePage({
    tariffs: [tariff('2 часа', '24.000 ₽'), tariff('3 часа', '30.000 ₽'), tariff('4 часа', '38.000 ₽')],
  }),
  'scoop-ice-cream': createServicePage({
    tariffs: [
      portionTariff('50 порций', '1 час', '15.000 ₽'),
      portionTariff('100 порций', '2 часа', '22.000 ₽'),
      portionTariff('150 порций', '3 часа', '30.000 ₽'),
    ],
  }),
  'nitro-ice-cream': createServicePage({
    tariffs: [
      portionTariff('50 порций', '1 час', '17.000 ₽'),
      portionTariff('100 порций', '2 часа', '24.000 ₽'),
      portionTariff('150 порций', '3 часа', '32.000 ₽'),
    ],
  }),
  'chocolate-fountain': createServicePage({
    comboBadge: COMBO_DISCOUNT_BADGE,
    tariffs: [
      {
        title: '1 час',
        variants: [
          { label: 'Стандарт', price: '11.500 ₽' },
          { label: 'VIP', price: '14.500 ₽' },
        ],
        items: DEFAULT_TARIFF_ITEMS,
      },
      {
        title: '2 часа',
        variants: [
          { label: 'Стандарт', price: '17.000 ₽' },
          { label: 'VIP', price: '19.000 ₽' },
        ],
        items: DEFAULT_TARIFF_ITEMS,
      },
      {
        title: '3 часа',
        variants: [
          { label: 'Стандарт', price: '21.000 ₽' },
          { label: 'VIP', price: '24.000 ₽' },
        ],
        items: DEFAULT_TARIFF_ITEMS,
      },
    ],
    packages: [
      {
        title: 'Пакет Стандарт',
        meta: 'до 30 человек',
        items: [
          'Аренда профессионального шоколадного фонтана высотой 70 см, 5 ярусов',
          '2.5 кг бельгийского шоколада Barry Callebaut',
          '5 кг фруктового ассорти и сладостей: банан, киви, ананас, апельсин, яблоко, маршмеллоу',
          'Салфетки и бумажные тарелочки',
          'Шпажки',
          'Профессиональный кондитер на протяжении мероприятия',
          'Установка и сервировка фонтана',
          'Демонтаж после завершения работы',
        ],
        additions: ['Клубника +2.000 ₽ за 1 кг', 'Манго +800 ₽ за 1 кг'],
      },
      {
        title: 'Пакет VIP',
        meta: 'до 50 человек',
        items: [
          'Аренда профессионального шоколадного фонтана высотой 75 см, 5 ярусов',
          '3.5 кг бельгийского шоколада Barry Callebaut',
          '7 кг фруктового ассорти и сладостей: банан, киви, ананас, апельсин, яблоко, маршмеллоу',
          'Салфетки и бумажные тарелочки',
          'Шпажки',
          'Профессиональный кондитер на протяжении мероприятия',
          'Установка и сервировка фонтана',
          'Демонтаж после завершения работы',
        ],
        additions: ['Клубника +2.000 ₽ за 1 кг', 'Манго +800 ₽ за 1 кг'],
      },
    ],
  }),
  'french-hot-dog': createServicePage({
    tariffs: [
      portionTariff('50 порций', '1 час', '15.000 ₽'),
      portionTariff('100 порций', '2 часа', '28.000 ₽'),
      portionTariff('150 порций', '3 часа', '40.000 ₽'),
    ],
  }),
  'danish-hot-dog': createServicePage({
    tariffs: [
      portionTariff('50 порций', '1 час', '17.500 ₽'),
      portionTariff('100 порций', '2 часа', '33.000 ₽'),
      portionTariff('150 порций', '3 часа', '47.000 ₽'),
    ],
  }),
  burgers: createServicePage({
    tariffs: [
      portionTariff('25 порций', '1 час', '15.000 ₽'),
      portionTariff('50 порций', '2 часа', '25.000 ₽'),
      portionTariff('100 порций', '3 часа', '48.000 ₽'),
    ],
  }),
  'belgian-waffles': createServicePage({
    tariffs: [
      portionTariff('50 порций', '1 час', '17.000 ₽'),
      portionTariff('100 порций', '2 часа', '31.000 ₽'),
      portionTariff('150 порций', '3 часа', '45.000 ₽'),
    ],
  }),
  pancakes: createServicePage({
    tariffs: [
      portionTariff('50 порций', '1 час', '18.000 ₽'),
      portionTariff('100 порций', '2 часа', '32.000 ₽'),
      portionTariff('150 порций', '3 часа', '46.000 ₽'),
    ],
  }),
  'champagne-pyramid': createServicePage({
    duration: '1 час',
    delivery: CHAMPAGNE_DELIVERY,
    comboBadge: COMBO_DISCOUNT_BADGE,
    included: [
      'Качественные бокалы, которые подчеркнут изысканность вашего праздника',
      'Эффект дыма',
      'Ведра для льда',
      'Вишня или сироп в каждый бокал',
      'Монтаж и демонтаж',
      'Шампанское предоставляется заказчиком либо закупается барменом',
    ],
    tariffs: [tariff('35 бокалов', '12.000 ₽'), tariff('56 бокалов', '14.000 ₽'), tariff('84 бокала', '20.000 ₽')],
  }),
  'craft-lemonade': createServicePage({
    tariffs: [
      portionTariff('50 порций', '1 час', '15.000 ₽'),
      portionTariff('100 порций', '2 часа', '24.000 ₽'),
      portionTariff('150 порций', '3 часа', '32.000 ₽'),
    ],
  }),
  'bubble-tea': createServicePage({
    tariffs: [
      portionTariff('25 порций', '1 час', '15.000 ₽'),
      portionTariff('50 порций', '2 часа', '23.000 ₽'),
      portionTariff('100 порций', '3 часа', '40.000 ₽'),
    ],
  }),
  'foam-cannon': createServicePage({
    duration: '30 минут',
    tariffs: [
      {
        title: 'Пакет Стандарт',
        price: '13.500 ₽',
        weekdayPrice: 'Пн-Чт — 11.500 ₽',
        items: [
          'Профессиональная пенная пушка',
          'Выброс пены до 8 метров мягкими воздушными облаками',
          'Площадь покрытия пеной до 50 кв. м',
          '220 литров пены на 30 минут',
          'Технический специалист без аниматора',
          'Профессиональная колонка с современными треками',
        ],
      },
      {
        title: 'Пакет Премиум',
        price: '18.000 ₽',
        weekdayPrice: 'Пн-Чт — 16.000 ₽',
        items: [
          'Профессиональная пенная пушка',
          'Выброс пены до 8 метров и площадь покрытия до 50 кв. м',
          '220 литров пены на 50 минут',
          'Ведущий-аниматор пенной дискотеки',
          'Профессиональная колонка с современными треками',
          'Надувные игрушки: круги, пончики, фламинго, мячи и другое',
        ],
      },
      {
        title: 'Пакет VIP',
        price: '27.000 ₽',
        weekdayPrice: 'Пн-Чт — 25.000 ₽',
        items: [
          'Профессиональная пенная пушка',
          'Выброс пены до 8 метров и площадь покрытия до 50 кв. м',
          '500 литров пены на 80 минут',
          'Два профессиональных ведущих-аниматора пенной дискотеки',
          'Профессиональная колонка с современными треками',
          'Надувные игрушки: круги, пончики, фламинго, мячи и другое',
          'Водные бластеры',
          'Конкурсы и игры для участников дискотеки',
        ],
      },
    ],
    packages: [
      {
        title: 'Пакет Стандарт',
        meta: '220 литров пены · 30 минут',
        items: [
          'Профессиональная пенная пушка с выбросом пены до 8 метров мягкими воздушными облаками',
          'Площадь покрытия пеной до 50 кв. м',
          'Технический специалист без аниматора',
          'Профессиональная колонка с современными треками',
        ],
      },
      {
        title: 'Пакет Премиум',
        meta: '220 литров пены · 50 минут',
        items: [
          'Профессиональная пенная пушка с выбросом пены до 8 метров мягкими воздушными облаками',
          'Площадь покрытия пеной до 50 кв. м',
          'Ведущий-аниматор пенной дискотеки',
          'Профессиональная колонка с современными треками',
          'Надувные игрушки: круги, пончики, фламинго, надувные мячи и другие',
        ],
      },
      {
        title: 'Пакет VIP',
        meta: '500 литров пены · 80 минут',
        items: [
          'Профессиональная пенная пушка с выбросом пены до 8 метров мягкими воздушными облаками',
          'Площадь покрытия пеной до 50 кв. м',
          'Два профессиональных ведущих-аниматора пенной дискотеки',
          'Профессиональная колонка с современными треками',
          'Надувные игрушки: круги, пончики, фламинго, надувные мячи и другие',
          'Водные бластеры',
          'Конкурсы и игры для участников дискотеки',
        ],
      },
    ],
  }),
};

export const services: readonly OfferingEntity[] = rawServices.map(normalizeOffering);
export const extras: readonly OfferingEntity[] = rawExtras.map(normalizeOffering);
export const moments: readonly MomentEntity[] = rawMoments.map(normalizeMoment);

export const reviewProofs: readonly ReviewProofEntity[] = [
  {
    id: 'review-corporate',
    author: 'Отзыв с Avito',
    eventType: 'Корпоративное мероприятие',
    quote:
      'Спасибо за аккуратную организацию и очень красивую подачу. Гости быстро втянулись, а сама зона выглядела очень уместно в пространстве.',
    ratingLabel: '5.0',
  },
  {
    id: 'review-family',
    author: 'Отзыв с Avito',
    eventType: 'Семейный праздник',
    quote:
      'Понравилось, что всё выглядело спокойно и без суеты, а по ощущениям праздник сразу стал ярче и вкуснее. Отдельно отметили подачу и общение с гостями.',
    ratingLabel: '5.0',
  },
  {
    id: 'review-kids',
    author: 'Отзыв с Avito',
    eventType: 'Детское событие',
    quote:
      'Очень живой формат, красиво оформлено и удобно по коммуникации. Родители и дети были вовлечены весь вечер, а фотографии получились отличные.',
    ratingLabel: '5.0',
  },
] as const;

export function findServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}

export function findExtraBySlug(slug: string) {
  return extras.find((extra) => extra.slug === slug);
}

export function getOfferingPath(offering: Pick<OfferingEntity, 'kind' | 'slug'>) {
  return offering.kind === 'service' ? `/services/${offering.slug}` : `/extras/${offering.slug}`;
}

export function getAllOfferingUrls() {
  return [...services, ...extras].map(getOfferingPath);
}
