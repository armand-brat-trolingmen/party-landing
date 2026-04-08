import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import App from './App';

test('renders the homepage as a catalog hub inside the shared site shell', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  const header = screen.getByTestId('site-header');
  const main = screen.getByRole('main');
  const footer = screen.getByRole('contentinfo');

  expect(header).toBeInTheDocument();
  expect(within(header).getByRole('link', { name: 'Праздник каждый день' })).toBeInTheDocument();
  expect(within(header).getByRole('button', { name: 'Заказать' })).toBeInTheDocument();
  expect(main).toHaveAttribute('data-motion-path', 'story-trail');
  expect(footer).toBeInTheDocument();
  expect(within(footer).queryByText('Праздник каждый день')).not.toBeInTheDocument();
  expect(within(footer).getByRole('link', { name: 'Политика конфиденциальности' })).toHaveAttribute('href', '/privacy');

  const sectionOrder = Array.from(main.querySelectorAll<HTMLElement>('[data-testid^="section-"]')).map((section) =>
    section.dataset.testid,
  );

  expect(sectionOrder).toEqual([
    'section-hero',
    'section-about',
    'section-services',
    'section-extras',
    'section-cta',
    'section-moments',
    'section-testimonials',
    'section-faq',
    'section-contact',
  ]);
});

test('renders hub-specific actions and split moments/reviews sections', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  expect(screen.getByRole('button', { name: 'В каталог' })).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: 'Заказать' }).length).toBeGreaterThanOrEqual(3);
  expect(screen.getByTestId('section-moments')).toBeInTheDocument();
  expect(screen.getByTestId('section-testimonials')).toBeInTheDocument();
  expect(screen.getByTestId('moment-feed-slider')).toHaveAttribute('data-slider-mode', 'manual');
  expect(screen.getByTestId('testimonials-grid')).toBeInTheDocument();
});
