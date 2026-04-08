import { render, screen, within } from '@testing-library/react';
import { TestimonialsSection } from './TestimonialsSection';

test('renders a separate testimonials proof section with an Avito link', () => {
  render(<TestimonialsSection />);

  const section = screen.getByTestId('section-testimonials');
  const sectionQueries = within(section);
  const surface = section.querySelector('[data-section-surface="canvas"][data-section-tone="blush"]');

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'Отзывы клиентов' })).toBeInTheDocument();
  expect(surface).not.toBeNull();
  expect(sectionQueries.getByTestId('testimonials-grid')).toBeInTheDocument();
  expect(within(sectionQueries.getByTestId('testimonials-grid')).getAllByText('Отзыв с Avito').length).toBeGreaterThan(0);
  expect(sectionQueries.getByRole('link', { name: 'Перейти на Avito' })).toHaveAttribute(
    'href',
    'https://www.avito.ru/brands/i82014135/all',
  );
});
