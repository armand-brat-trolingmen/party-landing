import { render, screen } from '@testing-library/react';
import { SiteHeader } from './SiteHeader';

test('renders primary anchor links', () => {
  render(<SiteHeader />);

  expect(screen.getByRole('link', { name: 'О нас' })).toHaveAttribute('href', '#about');
  expect(screen.getByRole('link', { name: 'Услуги' })).toHaveAttribute('href', '#services');
  expect(screen.getByRole('link', { name: 'Контакты' })).toHaveAttribute('href', '#contact');
});
