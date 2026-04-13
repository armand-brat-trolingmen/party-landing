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
  objectPosition?: string;
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

const HOME_SERVICE_CARD_IMAGE_MAP: Record<string, HomeCardImage> = {
  'cotton-candy': {
    src: '/images/services-home/cotton-candy.webp',
    fallbackSrc: '/images/services-home/cotton-candy.webp',
    width: 1024,
    height: 1024,
    sizes: '(max-width: 720px) 34vw, (max-width: 1120px) 44vw, 29vw',
  },
  popcorn: {
    src: '/images/services-home/popcorn.webp',
    fallbackSrc: '/images/services-home/popcorn.webp',
    width: 1024,
    height: 1024,
    sizes: '(max-width: 720px) 34vw, (max-width: 1120px) 44vw, 29vw',
  },
  'cotton-candy-popcorn': {
    src: '/images/services-home/cotton-candy-popcorn.webp',
    fallbackSrc: '/images/services-home/cotton-candy-popcorn.webp',
    width: 1024,
    height: 1024,
    sizes: '(max-width: 720px) 34vw, (max-width: 1120px) 44vw, 29vw',
  },
  'roll-ice-cream': {
    src: '/images/services-home/roll-ice-cream.webp',
    fallbackSrc: '/images/services-home/roll-ice-cream.webp',
    width: 1024,
    height: 1024,
    sizes: '(max-width: 720px) 34vw, (max-width: 1120px) 44vw, 29vw',
  },
  'scoop-ice-cream': {
    src: '/images/services-home/scoop-ice-cream.webp',
    fallbackSrc: '/images/services-home/scoop-ice-cream.webp',
    width: 1024,
    height: 1024,
    sizes: '(max-width: 720px) 34vw, (max-width: 1120px) 44vw, 29vw',
  },
  'nitro-ice-cream': {
    src: '/images/services-home/nitro-ice-cream.webp',
    fallbackSrc: '/images/services-home/nitro-ice-cream.webp',
    width: 1024,
    height: 1024,
    sizes: '(max-width: 720px) 34vw, (max-width: 1120px) 44vw, 29vw',
  },
  'chocolate-fountain': {
    src: '/images/services-home/chocolate-fountain.webp',
    fallbackSrc: '/images/services-home/chocolate-fountain.webp',
    width: 1024,
    height: 1024,
    sizes: '(max-width: 720px) 34vw, (max-width: 1120px) 44vw, 29vw',
  },
  'french-hot-dog': {
    src: '/images/services-home/french-hot-dog.webp',
    fallbackSrc: '/images/services-home/french-hot-dog.webp',
    width: 1024,
    height: 1024,
    sizes: '(max-width: 720px) 34vw, (max-width: 1120px) 44vw, 29vw',
  },
  'danish-hot-dog': {
    src: '/images/services-home/danish-hot-dog.webp',
    fallbackSrc: '/images/services-home/danish-hot-dog.webp',
    width: 1024,
    height: 1024,
    sizes: '(max-width: 720px) 34vw, (max-width: 1120px) 44vw, 29vw',
  },
  burgers: {
    src: '/images/services-home/burgers.webp',
    fallbackSrc: '/images/services-home/burgers.webp',
    width: 1024,
    height: 1024,
    sizes: '(max-width: 720px) 34vw, (max-width: 1120px) 44vw, 29vw',
  },
  'belgian-waffles': {
    src: '/images/services-home/belgian-waffles.webp',
    fallbackSrc: '/images/services-home/belgian-waffles.webp',
    width: 1024,
    height: 1024,
    sizes: '(max-width: 720px) 34vw, (max-width: 1120px) 44vw, 29vw',
  },
  pancakes: {
    src: '/images/services-home/pancakes.webp',
    fallbackSrc: '/images/services-home/pancakes.webp',
    width: 1024,
    height: 1024,
    sizes: '(max-width: 720px) 34vw, (max-width: 1120px) 44vw, 29vw',
  },
  'champagne-pyramid': {
    src: '/images/services-home/champagne-pyramid.webp',
    fallbackSrc: '/images/services-home/champagne-pyramid.webp',
    width: 1024,
    height: 1024,
    sizes: '(max-width: 720px) 34vw, (max-width: 1120px) 44vw, 29vw',
  },
  'craft-lemonade': {
    src: '/images/services-home/craft-lemonade.webp',
    fallbackSrc: '/images/services-home/craft-lemonade.webp',
    width: 1024,
    height: 1024,
    sizes: '(max-width: 720px) 34vw, (max-width: 1120px) 44vw, 29vw',
  },
  'bubble-tea': {
    src: '/images/services-home/bubble-tea.webp',
    fallbackSrc: '/images/services-home/bubble-tea.webp',
    width: 1024,
    height: 1024,
    sizes: '(max-width: 720px) 34vw, (max-width: 1120px) 44vw, 29vw',
  },
  'foam-cannon': {
    src: '/images/services-home/foam-cannon.webp',
    fallbackSrc: '/images/services-home/foam-cannon.webp',
    width: 1024,
    height: 1024,
    sizes: '(max-width: 720px) 34vw, (max-width: 1120px) 44vw, 29vw',
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
      'Праздник каждый день делает фуд-станции частью атмосферы мероприятия: подбираем формат под сценарий, держим подачу аккуратной и оставляем у гостей ощущение цельного красивого праздника.',
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
    name: 'Сладкая вата + попкорн',
    shortDescription: 'Комбинированная сладкая зона для событий, где хочется закрыть сразу два понятных гостям формата.',
    fullDescription:
      'Комбо из сладкой ваты и попкорна удобно использовать на мероприятиях с активным потоком гостей, когда нужна сразу более насыщенная сладкая точка. Такой формат помогает сделать зону визуально богаче и даёт гостям быстрый выбор без перегруза.',
    priceFrom: 'от 21.000',
    included: ['Две точки выдачи', 'Базовые ингредиенты', 'Работа персонала'],
    ctaLabel: 'Заказать сладкую вату и попкорн',
    tone: 'berry',
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
    shortDescription: 'Более насыщенный формат хот-дога для событий, где нужен узнаваемый street-food акцент.',
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
    shortDescription: 'Эффектный welcome-формат для мероприятий, где важно красивое первое впечатление.',
    fullDescription:
      'Пирамида из шампанского подходит для welcome-сценариев, торжественных открытий и событий, где важен выразительный старт. Этот формат работает как визуальный акцент и помогает задать мероприятию более праздничный тон с первых минут.',
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
      'Крафтовый лимонад хорошо подходит для тёплых сезонов, welcome-зон и мероприятий с активным потоком гостей, где нужен освежающий напиточный акцент. Формат помогает сделать гастрономическую часть легче и визуально более воздушной.',
    priceFrom: 'от 15.000',
    included: ['Напиточная стойка', 'Базовые вкусы лимонада', 'Стаканы и подача'],
    ctaLabel: 'Заказать крафтовый лимонад',
    tone: 'mint',
  }),
  createService({
    slug: 'bubble-tea',
    name: 'Бабл ти',
    shortDescription: 'Современный напиточный формат для мероприятий, где хочется добавить трендовый и фотогеничный акцент.',
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
      image: '/images/extras/branding.webp',
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
      image: '/images/extras/equipment.webp',
      emoji: '',
      tone: 'sky',
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
