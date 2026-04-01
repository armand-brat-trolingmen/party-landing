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

export const aboutPoints = [
  'Собираем праздник как редакционную историю бренда.',
  'Продумываем свет, фактуры и сервировку до мелочей.',
  'Работаем бережно к площадке и вашему таймингу.',
] as const;

export const galleryItems = [
  {
    id: 'food-truck-neon',
    title: 'Фудтрак в вечернем свете',
    image: '/images/hero/food-truck-card.svg',
    alt: 'Фудтрак с вечерней неоновой вывеской',
  },
  {
    id: 'chocolate-fountain-berries',
    title: 'Шоколадный акцент',
    image: '/images/hero/chocolate-fountain-card.svg',
    alt: 'Шоколадный фонтан с ягодным декором',
  },
  {
    id: 'cotton-candy-pastel',
    title: 'Пастельная сладкая зона',
    image: '/images/hero/cotton-candy-card.svg',
    alt: 'Тележка со сладкой ватой в пастельных тонах',
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
    description: 'Собираем меню под вас: горячо, красиво, и гости просят добавку весь вечер.',
  },
  {
    id: 'cotton-candy',
    name: 'Сладкая вата',
    image: '/images/hero/cotton-candy-card.svg',
    description: 'Легкие облака сладкой ваты добавляют кадрам магию и вам чуть больше флирта.',
  },
  {
    id: 'chocolate-fountain',
    name: 'Шоколадный фонтан',
    image: '/images/hero/chocolate-fountain-card.svg',
    description: 'Текучий шоколад, фрукты и вау-эффект: к столу тянутся даже самые серьезные.',
  },
  {
    id: 'animators',
    name: 'Аниматоры',
    image: '/images/reference/animators-placeholder.svg',
    description: 'Аниматоры держат ритм праздника, вовлекают гостей и снимают неловкость с первых минут.',
  },
] as const;

export const reviewPhotos = [
  {
    id: 'review-party-1',
    image: '/images/reviews/review-party-1.png',
    alt: 'Гости на празднике Party',
  },
] as const;
