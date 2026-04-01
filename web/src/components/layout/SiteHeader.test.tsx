import { render, screen } from '@testing-library/react';
import { SiteHeader } from './SiteHeader';

test('renders primary anchor links', () => {
  render(<SiteHeader />);

  expect(screen.getByRole('link', { name: 'О нас' })).toHaveAttribute('href', '#about');
  expect(screen.getByRole('link', { name: 'Услуги' })).toHaveAttribute('href', '#services');
  expect(screen.queryByRole('link', { name: 'Галерея' })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Отзывы' })).toHaveAttribute('href', '#reviews');
  expect(screen.getByRole('link', { name: 'Частые вопросы' })).toHaveAttribute('href', '#faq');
  expect(screen.getByRole('link', { name: 'Контакты' })).toHaveAttribute('href', '#contact');
});
