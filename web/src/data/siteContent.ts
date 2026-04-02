export const navItems = [
  { id: 'services', label: 'Услуги' },
  { id: 'about', label: 'О нас' },
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
    image: '/images/hero/chocolate-fountain-card.svg',
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
