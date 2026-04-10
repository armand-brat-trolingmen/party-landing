import type { NavigationItem } from './types';

export const navigation = [
  { id: 'about', label: 'О нас' },
  { id: 'services', label: 'Услуги' },
  { id: 'extras', label: 'Доп. услуги' },
  { id: 'testimonials', label: 'Отзывы' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Контакты' },
] as const satisfies readonly NavigationItem[];
