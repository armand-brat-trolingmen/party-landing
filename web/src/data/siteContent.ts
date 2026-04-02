export const navItems = [
  { id: 'about', label: 'О нас' },
  { id: 'services', label: 'Услуги' },
  { id: 'reviews', label: 'Отзывы' },
  { id: 'faq', label: 'Частые вопросы' },
  { id: 'contact', label: 'Контакты' },
] as const;

export const siteContent = {
  brand: 'Party',
  tagline: 'Почувствуй атмосферу праздника с нашей помощью!',
  heroDescription:
    'Яркие фудтраки, сладкая вата, шоколадный фонтан и аниматоры для событий, которые хочется запомнить.',
};

export const aboutStories = [
  {
    id: 'brand-story',
    text: 'Собираем праздник как редакционную историю бренда.',
    image: '/images/illustrations/about-brand-story.svg',
    alt: 'Иллюстрация редакционной истории бренда Party',
  },
  {
    id: 'stagecraft',
    text: 'Продумываем свет, фактуры и сервировку до мелочей.',
    image: '/images/illustrations/about-stagecraft.svg',
    alt: 'Иллюстрация постановки света и сервировки для события Party',
  },
  {
    id: 'timing',
    text: 'Работаем бережно к площадке и вашему таймингу.',
    image: '/images/illustrations/about-timing.svg',
    alt: 'Иллюстрация точного тайминга и бережной работы на площадке Party',
  },
] as const;

export const heroSceneItems = [
  { id: 'cotton-candy', label: 'Сладкая вата', image: '/images/hero/cotton-candy-card.svg' },
  { id: 'food-trucks', label: 'Фудтраки', image: '/images/hero/food-truck-card.svg' },
  {
    id: 'chocolate-fountain',
    label: 'Шоколадный фонтан',
    image: '/images/hero/chocolate-fountain-card.svg',
  },
] as const;

export const services = [
  {
    id: 'food-trucks',
    name: 'Фудтраки',
    image: '/images/hero/food-truck-card.svg',
    description:
      'Собираем меню под вас: горячо, красиво, и гости просят добавку весь вечер.',
  },
  {
    id: 'cotton-candy',
    name: 'Сладкая вата',
    image: '/images/hero/cotton-candy-card.svg',
    description:
      'Легкие облака сладкой ваты добавляют кадрам магию и вам чуть больше флирта.',
  },
  {
    id: 'chocolate-fountain',
    name: 'Шоколадный фонтан',
    image: '/images/hero/chocolate-fountain-card-static.svg',
    description:
      'Текучий шоколад, фрукты и вау-эффект: к столу тянутся даже самые серьезные.',
  },
  {
    id: 'animators',
    name: 'Аниматоры',
    image: '/images/illustrations/animators-brothers.svg',
    description:
      'Аниматоры держат ритм праздника, вовлекают гостей и снимают неловкость с первых минут.',
  },
] as const;

export const activeReviewVariant = 'stories' as const;
export const activeFaqVariant = 'accordion' as const;

export const reviewSectionCopy = {
  gallery: {
    eyebrow: 'Живые кадры',
    description: 'Кадры с наших событий Party: эмоции, детали и вкусные акценты.',
  },
  stories: {
    eyebrow: 'Истории Party',
    description: 'Четыре живых сюжета о том, как Party выглядит в кадре и ощущается на площадке.',
  },
} as const;

export const reviewPhotos = [
  {
    id: 'review-party',
    title: 'Аниматоры',
    image: '/images/reviews/review-party-1.png',
    alt: 'Гости и Дед Мороз на празднике Party',
    objectPosition: '42% 28%',
  },
  {
    id: 'review-truck',
    title: 'Фудтрак',
    image: '/images/reviews/review-truck-1.png',
    alt: 'Фудтрак Party на выездном событии',
    objectPosition: '50% 50%',
  },
  {
    id: 'review-cotton',
    title: 'Сладкая вата',
    image: '/images/reviews/review-cotton-1.png',
    alt: 'Стойка сладкой ваты Party на празднике',
    objectPosition: '50% 42%',
  },
  {
    id: 'review-fountain',
    title: 'Шоколадный фонтан',
    image: '/images/reviews/review-fountain-1.png',
    alt: 'Шоколадный фонтан Party в десертной зоне',
    objectPosition: '50% 48%',
  },
] as const;

export const reviewStories = [
  {
    id: 'story-party',
    badge: 'Аниматоры',
    title: 'Когда праздник сразу оживает',
    summary:
      'Дед Мороз и Снегурочка появляются вовремя, ловят настроение зала и быстро делают праздник общим.',
    meta: 'Зимний праздник для гостей и детей',
    image: '/images/reviews/review-party-1.png',
    alt: 'Гости и Дед Мороз на празднике Party',
    objectPosition: '42% 28%',
  },
  {
    id: 'story-truck',
    badge: 'Фудтрак',
    title: 'Очередь, которая только радует',
    summary:
      'Фудтрак красиво встает в кадр, собирает гостей вокруг себя и кормит без суеты даже на большом потоке.',
    meta: 'Корпоративы и выездные события',
    image: '/images/reviews/review-truck-1.png',
    alt: 'Фудтрак Party на выездном событии',
    objectPosition: '50% 50%',
  },
  {
    id: 'story-cotton',
    badge: 'Сладкая вата',
    title: 'Немного магии в каждом кадре',
    summary:
      'Сладкая вата работает и как десерт, и как деталь, ради которой гости снова достают телефоны для фото.',
    meta: 'Детские и семейные праздники',
    image: '/images/reviews/review-cotton-1.png',
    alt: 'Стойка сладкой ваты Party на празднике',
    objectPosition: '50% 42%',
  },
  {
    id: 'story-fountain',
    badge: 'Шоколадный фонтан',
    title: 'Тот самый десертный вау-эффект',
    summary:
      'К фонтану возвращаются по кругу: за клубникой, за эмоцией и просто ещё раз посмотреть, как это красиво.',
    meta: 'Камерные вечера и тёплые события',
    image: '/images/reviews/review-fountain-1.png',
    alt: 'Шоколадный фонтан Party в десертной зоне',
    objectPosition: '50% 48%',
  },
] as const;

export const faqSectionCopy = {
  placeholder: {
    description: undefined,
  },
  accordion: {
    eyebrow: 'Часто спрашивают',
    description: 'Собрали ответы на частые вопросы, чтобы вам было проще прикинуть формат ещё до звонка.',
  },
} as const;

export const faqItems = [
  {
    id: 'events',
    question: 'На какие мероприятия вы выезжаете?',
    answer:
      'От камерных дней рождения до офисных праздников, детских программ и городских событий — мы подключаемся там, где хочется собрать вокруг гостей живую атмосферу, а не просто поставить красивую точку с едой.',
  },
  {
    id: 'services',
    question: 'Что можно арендовать для праздника?',
    answer:
      'Основные форматы уже собраны во вкладке «Услуги»: там можно быстро посмотреть, что лучше откликается именно вашему событию.',
  },
  {
    id: 'adapt',
    question: 'Можно ли адаптировать формат под наш сценарий?',
    answer:
      'Да, и это как раз наш любимый формат работы. Мы растём, пробуем новое и спокойно подстраиваемся под ваши пожелания, чтобы всё выглядело не шаблонно, а действительно в тему вашего события.',
  },
  {
    id: 'office-kids',
    question: 'Работаете ли вы с офисными и детскими праздниками?',
    answer:
      'Да. Мы одинаково уверенно работаем и с офисными праздниками, и с детскими событиями, и готовы приехать в любую точку Москвы и Московской области.',
  },
  {
    id: 'venue',
    question: 'Что потребуется от площадки?',
    answer:
      'Зависит от выбранного формата, но в большинстве случаев нам нужны электричество и вода. Всё остальное заранее сверим с площадкой, чтобы в день события не было лишней суеты.',
  },
  {
    id: 'outside-moscow',
    question: 'Выезжаете ли вы за пределы Москвы и области?',
    answer:
      'Наш основной выезд — Москва и МО. Если площадка дальше, всё равно напишите: некоторые предложения мы готовы рассмотреть в индивидуальном порядке.',
  },
] as const;
