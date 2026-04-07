export const avitoProfileUrl = 'https://www.avito.ru/brands/i82014135/all';

export const navItems = [
  { id: 'about', label: 'О нас' },
  { id: 'services', label: 'Услуги' },
  { id: 'reviews', label: 'Лента моментов' },
  { id: 'faq', label: 'Частые вопросы' },
  { id: 'contact', label: 'Контакты' },
] as const;

export const siteContent = {
  brand: 'Party Everyday',
  tagline: 'Почувствуй атмосферу праздника с нашей помощью!',
  heroDescription:
    'Фудтраки, сладкая вата и шоколадный фонтан для событий, которые хочется не просто провести, а красиво прожить.',
} as const;

export const heroSceneItems = [
  { id: 'cotton-candy', label: 'Сладкая вата', image: '/images/hero/cotton-candy-card.svg' },
  { id: 'food-trucks', label: 'Фудтраки', image: '/images/hero/food-truck-card.svg' },
  {
    id: 'chocolate-fountain',
    label: 'Шоколадный фонтан',
    image: '/images/hero/chocolate-fountain-card.svg',
  },
] as const;

export const aboutAtelierScene = {
  eyebrow: 'Как мы собираем атмосферу',
  description:
    'Party Everyday не просто привозит красивые точки, а собирает вкус, подачу и настроение в один цельный кадр праздника.',
  manifest:
    'Мы собираем красивую атмосферу вручную: подбираем вкус, ритм и подачу так, чтобы праздник ощущался тёплым, цельным и по-настоящему вашим.',
} as const;

export const aboutAtelierLayers = [
  {
    id: 'taste',
    label: 'Вкус',
    description: 'Сладкие акценты, к которым гости возвращаются без лишних приглашений.',
  },
  {
    id: 'staging',
    label: 'Подача',
    description: 'Каждая зона выглядит как часть общей красивой сцены, а не случайный набор стоек.',
  },
  {
    id: 'mood',
    label: 'Настроение',
    description: 'Собираем свет, цвет и ритм так, чтобы праздник сразу чувствовался живым.',
  },
] as const;

export const aboutAccents = [
  {
    id: 'warm-entry',
    title: 'Входим мягко, а запоминаемся надолго',
    text: 'Сначала создаём ощущение уюта, а потом включаем тот самый вау-эффект, который гости обсуждают уже после праздника.',
  },
  {
    id: 'editorial-view',
    title: 'Смотрим на праздник как на красивую историю',
    text: 'Каждый формат должен не только работать, но и выглядеть так, будто его здесь ждали с самого начала.',
  },
  {
    id: 'calm-production',
    title: 'Выстраиваем процесс так, чтобы площадка работала спокойно',
    text: 'Заранее продумываем подготовку и координацию, поэтому для гостей и заказчика всё проходит аккуратно, без суеты и с понятным таймингом.',
  },
] as const;

export const services = [
  {
    id: 'food-trucks',
    name: 'Фудтраки',
    image: '/images/hero/food-truck-card.svg',
    description: 'Горячая точка внимания, возле которой гости знакомятся, шутят и задерживаются дольше.',
  },
  {
    id: 'cotton-candy',
    name: 'Сладкая вата',
    image: '/images/hero/cotton-candy-card.svg',
    description: 'Нежный десертный акцент, который добавляет празднику лёгкости и фотографируется без уговоров.',
  },
  {
    id: 'chocolate-fountain',
    name: 'Шоколадный фонтан',
    image: '/images/hero/chocolate-fountain-card-static.svg',
    description: 'Тёплый десертный магнит, который собирает вокруг себя гостей и держит красивый ритм вечера.',
  },
] as const;

export const momentFeedSectionCopy = {
  eyebrow: 'Лента моментов',
  description: 'Живые кадры, в которых наши форматы работают не только на вкус, но и на атмосферу всего события.',
} as const;

export const momentFeedItems = [
  {
    id: 'moment-truck',
    label: 'Фудтрак',
    title: 'Фудтрак, возле которого гости собираются сами собой.',
    image: '/images/reviews/review-truck-1.png',
    alt: 'Фудтрак Party Everyday на выездном событии',
    objectPosition: '50% 50%',
    tone: 'gold',
  },
  {
    id: 'moment-cotton',
    label: 'Сладкая вата',
    title: 'Сладкая вата, которую сначала фотографируют, а потом просят повторить.',
    image: '/images/reviews/review-cotton-1.png',
    alt: 'Стойка сладкой ваты Party Everyday на празднике',
    objectPosition: '50% 42%',
    tone: 'rose',
  },
  {
    id: 'moment-fountain',
    label: 'Шоколадный фонтан',
    title: 'Шоколадный фонтан, к которому гости возвращаются за добавкой весь вечер.',
    image: '/images/reviews/review-fountain-2.jpg',
    alt: 'Шоколадный фонтан Party Everyday в десертной зоне',
    objectPosition: '50% 56%',
    tone: 'chocolate',
  },
] as const;

export const faqSectionCopy = {
  eyebrow: 'Часто спрашивают',
  description: 'Собрали ответы на частые вопросы, чтобы вам было проще прикинуть формат ещё до звонка.',
} as const;

export const faqItems = [
  {
    id: 'events',
    question: 'Для каких мероприятий подходят ваши форматы?',
    answer:
      'Наши форматы подходят для частных праздников, детских дней рождения, офисных вечеров, корпоративных событий и городских мероприятий — везде, где важно собрать вокруг гостей красивую и живую атмосферу.',
  },
  {
    id: 'services',
    question: 'Какие форматы и услуги можно заказать на праздник?',
    answer:
      'На сайте уже показаны основные форматы Party Everyday: фудтраки, сладкая вата и шоколадный фонтан. Мы подбираем их под характер события, площадку и желаемую атмосферу.',
  },
  {
    id: 'adapt',
    question: 'Можно ли адаптировать формат под сценарий и площадку?',
    answer:
      'Да. Мы спокойно адаптируем формат под ваш сценарий, площадку и количество гостей, чтобы решение выглядело уместно и работало именно под конкретное событие, а не как шаблонная заготовка.',
  },
  {
    id: 'office-kids',
    question: 'Работаете ли вы по Москве и Московской области?',
    answer:
      'Да. Мы выезжаем по Москве и Московской области и работаем как с офисными, так и с семейными, детскими и частными событиями.',
  },
  {
    id: 'venue',
    question: 'Что потребуется от площадки для подключения зон?',
    answer:
      'Это зависит от выбранного формата, но чаще всего для работы зон нужны электричество и вода. Все детали заранее сверяем с площадкой, чтобы в день события всё прошло спокойно и без лишних сюрпризов.',
  },
  {
    id: 'outside-moscow',
    question: 'Можно ли обсудить выезд за пределы Москвы и области?',
    answer:
      'Основной наш радиус — Москва и Московская область, но отдельные выезды мы готовы рассматривать в индивидуальном порядке. Лучше заранее написать нам и обсудить формат, площадку и логистику.',
  },
] as const;

export const contactSectionCopy = {
  eyebrow: 'Связаться с нами',
  description: 'Напишите удобным способом — подскажем по формату, срокам и следующему шагу без лишней переписки.',
} as const;

export const contactActions = [
  {
    id: 'telegram',
    label: 'Telegram',
    href: '#telegram',
    caption: 'Быстрый канал для первого диалога, референсов и уточнений по проекту.',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: '#whatsapp',
    caption: 'Удобно, если хочется обсудить формат короткими сообщениями в течение дня.',
  },
  {
    id: 'avito',
    label: 'Avito',
    href: avitoProfileUrl,
    caption: 'Профиль и живые отзывы, которые помогают быстро проверить наш опыт.',
  },
] as const;

export const contactGuidedCopy = {
  eyebrow: 'Связаться с нами',
  description: 'Напишите удобным способом — подскажем по формату, срокам и следующему шагу без лишней переписки.',
  guideTitle: 'Что удобно написать сразу',
  guideDescription:
    'Так мы быстрее поймём формат события и сможем сразу предложить подходящее решение, а не тратить время на лишние уточнения.',
  exampleMessage:
    'Добрый день! Планируем событие в Москве, ориентир — 60 гостей. Интересны фудтрак и сладкая зона. Подскажите, какие требования к площадке для данных услуг?',
} as const;

export const contactPromptItems = [
  'Дата и ориентир по времени',
  'Формат события и площадка',
  'Количество гостей и желаемые зоны',
] as const;

export const contactActionsGuided = [
  {
    id: 'telegram',
    label: 'Telegram',
    href: '#telegram',
    caption: 'Быстрый канал для первого диалога, референсов и уточнений по проекту.',
    icon: 'telegram',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: '#whatsapp',
    caption: 'Удобно, если хочется обсудить формат короткими сообщениями в течение дня.',
    icon: 'whatsapp',
  },
  {
    id: 'avito',
    label: 'Avito',
    href: avitoProfileUrl,
    caption: 'Профиль и живые отзывы, которые помогают быстро проверить наш опыт.',
    icon: 'avito',
  },
] as const;
