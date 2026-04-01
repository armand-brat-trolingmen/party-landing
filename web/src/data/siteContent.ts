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
  { id: 'cotton-candy', label: 'Сладкая вата', accent: 'pink' },
  {
    id: 'chocolate-fountain',
    label: 'Шоколадный фонтан',
    accent: 'chocolate',
  },
] as const;

export const heroSceneCenter = {
  label: 'Фудтраки',
  accent: 'cream',
};
