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

export type OfferingEntity = {
  kind: 'service' | 'extra';
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  priceFrom: string;
  included: string[];
  ctaLabel: string;
  seoTitle: string;
  seoDescription: string;
  visual: CatalogVisual;
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

const OFFERING_EMOJI_MAP: Record<string, string> = {
  'food-trucks': '🚚',
  'cotton-candy': '☁️',
  'chocolate-fountain': '🍫',
  'fondue-station': '🍓',
  'bubble-waffles': '🧇',
  'hot-dogs': '🌭',
  'fried-ice-cream': '🍨',
  'donut-station': '🍩',
  'lemonade-bar': '🥤',
  'popcorn-station': '🍿',
  'pancake-station': '🥞',
  'fruit-dessert-zone': '🍓',
  'branded-serving': '✨',
  'decor-setup': '🎀',
  'guest-welcome-point': '🎉',
  'extended-service': '🕒',
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
  const included =
    offering.slug === 'branded-serving'
      ? ['Адаптация подачи', 'Согласование визуальных акцентов', 'Интеграция в общую концепцию']
      : offering.included;

  return {
    ...offering,
    included,
    seoTitle: buildOfferingSeoTitle(offering),
    seoDescription: buildOfferingSeoDescription(offering),
    visual: {
      ...offering.visual,
      emoji: OFFERING_EMOJI_MAP[offering.slug] ?? offering.visual.emoji,
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
    initialVisibleCount: 8,
    revealLabel: 'Показать ещё',
    collapseLabel: 'Скрыть часть меню',
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
  {
    kind: 'service',
    slug: 'food-trucks',
    name: 'Фудтраки',
    shortDescription:
      'Выездной формат, который быстро становится центром притяжения гостей и задаёт живой ритм всему мероприятию.',
    fullDescription:
      'Фудтрак — заметная и удобная гастрозона, которая сразу собирает вокруг себя гостей. Такой формат объединяет подачу, эмоцию и удобство обслуживания в одном выразительном решении.',
    priceFrom: 'от 49 000 ₽',
    included: ['Выезд и установка зоны', 'Оформление точки', 'Работа персонала', 'Базовая подача и сервис'],
    ctaLabel: 'Заказать фудтрак',
    seoTitle: 'Фудтраки на мероприятие — Праздник каждый день',
    seoDescription:
      'Фудтраки Праздник каждый день для частных, детских и корпоративных событий. Выездной формат с красивой подачей и живой атмосферой.',
    visual: {
      image: '/images/hero/food-truck-card.svg',
      alt: 'Иллюстрация услуги «Фудтраки» — Праздник каждый день',
      width: 360,
      height: 280,
      emoji: '🚚',
      tone: 'gold',
    },
  },
  {
    kind: 'service',
    slug: 'cotton-candy',
    name: 'Сладкая вата',
    shortDescription:
      'Воздушный десертный акцент, который хочется фотографировать ещё до первого укуса.',
    fullDescription:
      'Станция сладкой ваты хорошо работает там, где хочется добавить мероприятию нежности, цвета и лёгкого детского восторга. Формат быстро привлекает внимание и красиво вписывается в атмосферу праздника.',
    priceFrom: 'от 7 500 ₽',
    included: ['Станция и базовый сетап', 'Работа кондитера', 'Порционная подача', 'Подготовка к подключению'],
    ctaLabel: 'Заказать сладкую вату',
    seoTitle: 'Сладкая вата на праздник — Праздник каждый день',
    seoDescription:
      'Станция сладкой ваты Праздник каждый день для праздников и мероприятий. Аккуратная подача, работа кондитера и выразительная атмосфера.',
    visual: {
      image: '/images/hero/cotton-candy-card.svg',
      alt: 'Иллюстрация услуги «Сладкая вата» — Праздник каждый день',
      width: 220,
      height: 260,
      emoji: '☁️',
      tone: 'rose',
    },
  },
  {
    kind: 'service',
    slug: 'chocolate-fountain',
    name: 'Шоколадный фонтан',
    shortDescription:
      'Тёплая десертная точка, к которой гости возвращаются весь вечер за ещё одной порцией эмоции.',
    fullDescription:
      'Шоколадный фонтан помогает создать на площадке ощущение щедрого и визуально богатого десертного формата. Он работает как центральный сладкий акцент и усиливает общий ритм зоны.',
    priceFrom: 'от 27 900 ₽',
    included: ['Фонтан и подготовка', 'Шоколад и базовые компоненты', 'Обслуживание', 'Контроль подачи на площадке'],
    ctaLabel: 'Заказать шоколадный фонтан',
    seoTitle: 'Шоколадный фонтан на мероприятие — Праздник каждый день',
    seoDescription:
      'Шоколадный фонтан Праздник каждый день для мероприятий в Москве и области. Эффектная десертная зона с обслуживанием и красивой подачей.',
    visual: {
      image: '/images/hero/chocolate-fountain-card-static.svg',
      alt: 'Иллюстрация услуги «Шоколадный фонтан» — Праздник каждый день',
      width: 220,
      height: 260,
      emoji: '🍫',
      tone: 'chocolate',
    },
  },
  {
    kind: 'service',
    slug: 'fondue-station',
    name: 'Станция фондю',
    shortDescription:
      'Роскошное фондю с фруктами, печеньем и орехами, которое собирает гостей вокруг красивой десертной сцены.',
    fullDescription:
      'Станция фондю — более изысканный десертный формат для событий, где важны мягкая роскошь, тёплая подача и ощущение красивого выбора. Мы собираем её так, чтобы она выглядела цельно и обслуживалась спокойно и аккуратно.',
    priceFrom: 'от 24 000 ₽',
    included: ['Фондю-сетап', 'Фрукты и десертные компоненты', 'Работа кондитера', 'Сервис на площадке'],
    ctaLabel: 'Заказать станцию фондю',
    seoTitle: 'Станция фондю на праздник — Праздник каждый день',
    seoDescription:
      'Станция фондю Праздник каждый день для частных и корпоративных событий. Десертный формат с красивой подачей и обслуживанием на площадке.',
    visual: {
      emoji: '🍓',
      tone: 'berry',
    },
  },
  {
    kind: 'service',
    slug: 'bubble-waffles',
    name: 'Гонконгские вафли',
    shortDescription:
      'Выразительный десертный формат с узнаваемой подачей, который выглядит современно и аппетитно.',
    fullDescription:
      'Гонконгские вафли хорошо подходят для событий, где нужна живая, современная и фотогеничная десертная станция. Формат смотрится эффектно и легко воспринимается гостями любого возраста.',
    priceFrom: 'от 13 500 ₽',
    included: ['Вафельная станция', 'Начинки и топпинги', 'Подача порциями', 'Работа персонала'],
    ctaLabel: 'Заказать гонконгские вафли',
    seoTitle: 'Гонконгские вафли на мероприятие — Праздник каждый день',
    seoDescription:
      'Станция гонконгских вафель Праздник каждый день для праздников и мероприятий. Современный десертный формат с красивой подачей.',
    visual: {
      emoji: '🧇',
      tone: 'mint',
    },
  },
  {
    kind: 'service',
    slug: 'hot-dogs',
    name: 'Хот-доги',
    shortDescription:
      'Понятный и любимый всеми street-food формат, который быстро включается в ритм мероприятия.',
    fullDescription:
      'Хот-доги — удобная гастрозона для событий, где важны понятный вкус, быстрый сервис и живая подача. Формат легко работает как самостоятельная точка или как часть более большой линейки услуг.',
    priceFrom: 'от 19 900 ₽',
    included: ['Станция выдачи', 'Базовый набор ингредиентов', 'Работа персонала', 'Подача на месте'],
    ctaLabel: 'Заказать хот-доги',
    seoTitle: 'Хот-доги на мероприятие — Праздник каждый день',
    seoDescription:
      'Хот-доги Праздник каждый день для частных и корпоративных мероприятий. Удобный street-food формат с быстрым обслуживанием и аккуратной подачей.',
    visual: {
      emoji: '🌭',
      tone: 'caramel',
    },
  },
  {
    kind: 'service',
    slug: 'fried-ice-cream',
    name: 'Жареное мороженое',
    shortDescription:
      'Эффектный десертный формат, который сразу добавляет вау-эффект и живое взаимодействие с гостями.',
    fullDescription:
      'Жареное мороженое хорошо подходит для событий, где важен эффект приготовления прямо на глазах гостей. Такой формат добавляет шоу-элемент и делает десертную зону более динамичной.',
    priceFrom: 'от 16 500 ₽',
    included: ['Мороженая станция', 'Базовые вкусы и топпинги', 'Работа мастера', 'Порционная выдача'],
    ctaLabel: 'Заказать жареное мороженое',
    seoTitle: 'Жареное мороженое на праздник — Праздник каждый день',
    seoDescription:
      'Жареное мороженое Праздник каждый день для мероприятий. Эффектная десертная станция с приготовлением на глазах у гостей.',
    visual: {
      emoji: '🍨',
      tone: 'sky',
    },
  },
  {
    kind: 'service',
    slug: 'donut-station',
    name: 'Станция донатов',
    shortDescription:
      'Яркая сладкая точка с понятной подачей и дружелюбным настроением для частных и корпоративных событий.',
    fullDescription:
      'Станция донатов помогает добавить в праздник тёплый и понятный десертный сценарий. Такой формат легко воспринимается гостями, хорошо фотографируется и работает в разных типах событий.',
    priceFrom: 'от 14 500 ₽',
    included: ['Сетап станции', 'Ассортимент донатов', 'Оформление выкладки', 'Поддержка на площадке'],
    ctaLabel: 'Заказать станцию донатов',
    seoTitle: 'Станция донатов на мероприятие — Праздник каждый день',
    seoDescription:
      'Станция донатов Праздник каждый день для праздников и мероприятий. Яркая десертная подача с аккуратной выкладкой и обслуживанием.',
    visual: {
      emoji: '🍩',
      tone: 'rose',
    },
  },
  {
    kind: 'service',
    slug: 'lemonade-bar',
    name: 'Лимонад-бар',
    shortDescription:
      'Свежий напиточный формат, который делает подачу легче и помогает освежить общий сценарий праздника.',
    fullDescription:
      'Лимонад-бар хорошо подходит как отдельная напиточная станция или как дополнение к сладким форматам. Он делает картинку более воздушной и помогает поддерживать комфортный ритм события.',
    priceFrom: 'от 12 900 ₽',
    included: ['Напиточный бар', 'Ассортимент лимонадов', 'Стаканы и сервировка', 'Работа персонала'],
    ctaLabel: 'Заказать лимонад-бар',
    seoTitle: 'Лимонад-бар на мероприятие — Праздник каждый день',
    seoDescription:
      'Лимонад-бар Праздник каждый день для праздников и мероприятий. Освежающая напиточная станция с красивой подачей и удобным сервисом.',
    visual: {
      emoji: '🥤',
      tone: 'mint',
    },
  },
  {
    kind: 'service',
    slug: 'popcorn-station',
    name: 'Попкорн-станция',
    shortDescription:
      'Лёгкий формат с понятным вкусом и узнаваемым настроением, который быстро вовлекает гостей.',
    fullDescription:
      'Попкорн-станция помогает добавить мероприятию лёгкость и дружелюбную атмосферу. Это удобная точка для частных и детских событий, а также для неформальных корпоративных встреч.',
    priceFrom: 'от 11 900 ₽',
    included: ['Станция попкорна', 'Базовые вкусы', 'Выдача порциями', 'Поддержка персонала'],
    ctaLabel: 'Заказать попкорн-станцию',
    seoTitle: 'Попкорн-станция на праздник — Праздник каждый день',
    seoDescription:
      'Попкорн-станция Праздник каждый день для мероприятий. Лёгкий гастроформат с понятной подачей и удобным обслуживанием.',
    visual: {
      emoji: '🍿',
      tone: 'gold',
    },
  },
  {
    kind: 'service',
    slug: 'pancake-station',
    name: 'Блинная станция',
    shortDescription:
      'Тёплый формат с домашним ощущением и красивой подачей, который одинаково нравится взрослым и детям.',
    fullDescription:
      'Блинная станция создаёт более уютный и понятный гастрономический сценарий. Она подходит для семейных и корпоративных событий, где важны тёплый вкус, спокойный ритм и аккуратная подача.',
    priceFrom: 'от 17 000 ₽',
    included: ['Блинная станция', 'Начинки и топпинги', 'Работа персонала', 'Порционная подача'],
    ctaLabel: 'Заказать блинную станцию',
    seoTitle: 'Блинная станция на мероприятие — Праздник каждый день',
    seoDescription:
      'Блинная станция Праздник каждый день для праздников и мероприятий. Тёплый формат с красивой подачей и комфортным сервисом.',
    visual: {
      emoji: '🥞',
      tone: 'caramel',
    },
  },
  {
    kind: 'service',
    slug: 'fruit-dessert-zone',
    name: 'Фруктово-десертная зона',
    shortDescription:
      'Собранная десертная композиция с фруктами и сладкими акцентами, которая делает подачу визуально богаче.',
    fullDescription:
      'Фруктово-десертная зона хорошо подходит как спокойный, но визуально насыщенный формат. Она усиливает ощущение щедрой подачи и позволяет гостям выбирать удобный для себя темп десерта.',
    priceFrom: 'от 21 000 ₽',
    included: ['Подбор десертных компонентов', 'Фруктовая подача', 'Оформление зоны', 'Сервис на площадке'],
    ctaLabel: 'Заказать фруктово-десертную зону',
    seoTitle: 'Фруктово-десертная зона на мероприятие — Праздник каждый день',
    seoDescription:
      'Фруктово-десертная зона Праздник каждый день для мероприятий. Визуально богатая сладкая подача с фруктами и аккуратным оформлением.',
    visual: {
      emoji: '🍓',
      tone: 'berry',
    },
  },
] as const;

const rawExtras: readonly OfferingEntity[] = [
  {
    kind: 'extra',
    slug: 'branded-serving',
    name: 'Брендированная подача',
    shortDescription:
      'Помогаем сделать станцию ближе к айдентике события и собрать более цельное визуальное впечатление.',
    fullDescription:
      'Брендированная подача нужна, когда важно аккуратно встроить станцию в коммуникацию бренда или в общую стилистику мероприятия. Это дополнительный слой, который делает формат более собранным и уместным.',
    priceFrom: 'от 7 000 ₽',
    included: ['Адаптация подачи', 'Согласование визуальных акцентов', 'Интеграция в общую концепцию'],
    ctaLabel: 'Заказать брендированную подачу',
    seoTitle: 'Брендированная подача для мероприятия — Праздник каждый день',
    seoDescription:
      'Брендированная подача Праздник каждый день для мероприятий. Адаптируем станцию под фирменный стиль, сценарий и визуальную концепцию события.',
    visual: {
      emoji: '✨',
      tone: 'gold',
    },
  },
  {
    kind: 'extra',
    slug: 'decor-setup',
    name: 'Декор и сетап зоны',
    shortDescription:
      'Дополнительная настройка внешнего вида станции, чтобы она точнее работала в общей сценографии события.',
    fullDescription:
      'Декор и сетап помогают аккуратно встроить станцию в пространство: смягчить переходы, усилить стиль и сделать визуальную подачу более цельной. Это полезно для событий, где картинка особенно важна.',
    priceFrom: 'от 8 500 ₽',
    included: ['Настройка композиции', 'Декоративные акценты', 'Сборка на площадке'],
    ctaLabel: 'Заказать декор зоны',
    seoTitle: 'Декор и сетап зоны — Праздник каждый день',
    seoDescription:
      'Декор и сетап зоны Праздник каждый день для мероприятий. Улучшаем композицию станции и аккуратно встраиваем её в общую атмосферу события.',
    visual: {
      emoji: '🎀',
      tone: 'rose',
    },
  },
  {
    kind: 'extra',
    slug: 'guest-welcome-point',
    name: 'Welcome-зона',
    shortDescription:
      'Дополнительная точка встречи гостей, которая задаёт правильное первое ощущение ещё до основной программы.',
    fullDescription:
      'Welcome-зона помогает мягко начать взаимодействие с гостями и связать вход в мероприятие с общей подачей. Это дополнительный формат для событий, где важен красивый входной сценарий.',
    priceFrom: 'от 10 000 ₽',
    included: ['Мини-сетап зоны', 'Welcome-компоненты', 'Адаптация под сценарий события'],
    ctaLabel: 'Заказать welcome-зону',
    seoTitle: 'Welcome-зона на мероприятие — Праздник каждый день',
    seoDescription:
      'Welcome-зона Праздник каждый день для мероприятий. Дополнительный формат для красивой встречи гостей и мягкого старта события.',
    visual: {
      emoji: '🎉',
      tone: 'sky',
    },
  },
  {
    kind: 'extra',
    slug: 'extended-service',
    name: 'Продлённое обслуживание',
    shortDescription:
      'Расширяем время работы станции, если событию нужен более длинный и спокойный темп обслуживания.',
    fullDescription:
      'Продлённое обслуживание полезно, когда хочется растянуть работу формата по времени и не создавать ощущения спешки. Это дополнительная опция для более длинных и насыщенных по сценарию событий.',
    priceFrom: 'от 6 000 ₽',
    included: ['Увеличенное время работы', 'Дополнительная координация', 'Поддержание зоны в рабочем состоянии'],
    ctaLabel: 'Заказать продлённое обслуживание',
    seoTitle: 'Продлённое обслуживание станции — Праздник каждый день',
    seoDescription:
      'Продлённое обслуживание Праздник каждый день для мероприятий. Увеличиваем время работы станции и сохраняем спокойный ритм подачи.',
    visual: {
      emoji: '🕒',
      tone: 'chocolate',
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
