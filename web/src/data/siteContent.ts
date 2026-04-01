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
  { id: 'cotton-candy', label: 'Сладкая вата', image: '/images/reference/cotton-candy-1.png' },
  {
    id: 'chocolate-fountain',
    label: 'Шоколадный фонтан',
    image: '/images/reference/chocolate-fountain-1.png',
  },
] as const;

export const heroSceneCenter = {
  label: 'Фудтраки',
  image: '/images/reference/food-truck-1.png',
};
