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

export const aboutPoints = [
  'Собираем праздник как редакционную историю бренда.',
  'Продумываем свет, фактуры и сервировку до мелочей.',
  'Работаем бережно к площадке и вашему таймингу.',
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
    image: '/images/reference/animators-placeholder.svg',
    description:
      'Аниматоры держат ритм праздника, вовлекают гостей и снимают неловкость с первых минут.',
  },
] as const;

export const reviewPhotos = [
  {
    id: 'review-party-left',
    image: '/images/reviews/review-party-1.png',
    alt: 'Гости и Дед Мороз на празднике Party',
    objectPosition: '42% 28%',
  },
  {
    id: 'review-party-center',
    image: '/images/reviews/review-party-1.png',
    alt: 'Гости на праздничном фото Party',
    objectPosition: '50% 46%',
  },
  {
    id: 'review-party-right',
    image: '/images/reviews/review-party-1.png',
    alt: 'Снегурочка и гости на празднике Party',
    objectPosition: '70% 34%',
  },
] as const;
