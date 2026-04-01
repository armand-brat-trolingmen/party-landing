export const navItems = [
  { id: 'about', label: 'О нас' },
  { id: 'services', label: 'Услуги' },
  { id: 'gallery', label: 'Галерея' },
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

export const heroSceneCards = [
  { id: 'cotton-candy', label: 'Сладкая вата', image: '/images/hero/cotton-candy-card.svg' },
  {
    id: 'chocolate-fountain',
    label: 'Шоколадный фонтан',
    image: '/images/hero/chocolate-fountain-card.svg',
  },
] as const;

export const heroSceneCenter = {
  label: 'Фудтраки',
  image: '/images/hero/food-truck-card.svg',
};

export const services = [
  {
    id: 'food-trucks',
    name: 'Фудтраки',
    image: '/images/hero/food-truck-card.svg',
  },
  {
    id: 'cotton-candy',
    name: 'Сладкая вата',
    image: '/images/hero/cotton-candy-card.svg',
  },
  {
    id: 'chocolate-fountain',
    name: 'Шоколадный фонтан',
    image: '/images/hero/chocolate-fountain-card.svg',
  },
  {
    id: 'animators',
    name: 'Аниматоры',
    image: '/images/reference/animators-placeholder.svg',
  },
] as const;
