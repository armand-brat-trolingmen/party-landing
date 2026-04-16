import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { siteConfig } from './content';
import App from './App';

test('renders the homepage as a catalog hub inside the shared site shell', async () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  const header = screen.getByTestId('site-header');
  const main = screen.getByRole('main');
  const footer = screen.getByRole('contentinfo');

  expect(header).toBeInTheDocument();
  expect(within(header).getByRole('link', { name: siteConfig.brand.name })).toBeInTheDocument();
  expect(within(header).getByTestId('header-order-button')).toBeInTheDocument();
  expect(main).toHaveAttribute('data-motion-path', 'canvas-flow');
  expect(main.querySelector('.lazy-section-fallback')).not.toBeInTheDocument();
  expect(footer).toBeInTheDocument();
  expect(footer.querySelector('a[href="/privacy"]')).toBeInTheDocument();

  await screen.findByTestId('section-cta');

  const sectionOrder = Array.from(main.querySelectorAll<HTMLElement>('[data-testid^="section-"]')).map(
    (section) => section.dataset.testid,
  );

  expect(sectionOrder).toEqual([
    'section-hero',
    'section-concept-loop',
    'section-about',
    'section-services',
    'section-extras',
    'section-food-truck-rental',
    'section-food-trucks',
    'section-testimonials',
    'section-faq',
    'section-contact',
    'section-cta',
  ]);
});

test('renders hub-specific actions and keeps the testimonial proof section', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  expect(screen.getByRole('button', { name: siteConfig.homepage.hero.secondaryActionLabel })).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: siteConfig.homepage.hero.primaryActionLabel }).length).toBeGreaterThanOrEqual(1);
  expect(screen.queryByTestId('section-moments')).not.toBeInTheDocument();
  expect(screen.getByTestId('section-food-truck-rental')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: siteConfig.homepage.foodTruckRental.title })).toBeInTheDocument();
  expect(screen.getByTestId('section-food-trucks')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: siteConfig.homepage.foodTrucks.title })).toBeInTheDocument();
  expect(screen.getByTestId('section-testimonials')).toBeInTheDocument();
  expect(screen.queryByTestId('services-reveal-button')).not.toBeInTheDocument();
});
