import { fireEvent, render, screen, within } from '@testing-library/react';
import { services } from '../../data/catalogContent';
import { ServicesSection } from './ServicesSection';

function mockViewport(isMobile: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('max-width: 720px') ? isMobile : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

test('renders the services catalog as a revealable centered showcase without helper chips', () => {
  mockViewport(false);
  render(<ServicesSection />);

  const section = screen.getByTestId('section-services');
  const heading = within(section).getByRole('heading', { level: 2, name: 'Услуги' });

  expect(heading).toBeInTheDocument();
  expect(heading.closest('[data-heading-align]')).toHaveAttribute('data-heading-align', 'center');
  expect(section).not.toHaveAttribute('data-section-tone');
  expect(screen.queryByTestId('services-chip-row')).not.toBeInTheDocument();
  expect(screen.getByTestId('services-catalog')).toHaveAttribute('data-showcase-style', 'premium-grid');
  expect(screen.getByTestId('services-catalog')).toHaveAttribute('data-mobile-layout', 'grid');
  expect(screen.queryByTestId('services-slider-progress')).not.toBeInTheDocument();

  const catalog = screen.getByTestId('services-catalog');
  const cards = within(catalog).getAllByTestId('service-card');

  expect(cards).toHaveLength(8);
  expect(within(catalog).getByRole('heading', { level: 3, name: services[0].name })).toBeInTheDocument();
  expect(within(catalog).getByText(services[0].shortDescription)).toBeInTheDocument();
  expect(within(catalog).queryByRole('heading', { level: 3, name: services[10].name })).not.toBeInTheDocument();

  const revealButton = screen.getByTestId('services-reveal-button');
  expect(revealButton).toHaveTextContent('Показать ещё');

  fireEvent.click(revealButton);
  expect(within(catalog).getAllByTestId('service-card')).toHaveLength(services.length);
  expect(within(catalog).getByRole('heading', { level: 3, name: services[10].name })).toBeInTheDocument();
  expect(revealButton).toHaveTextContent('Скрыть часть меню');
});

test('routes each desktop card to its dedicated internal service page through a button-like link', () => {
  mockViewport(false);
  render(<ServicesSection allowReveal={false} />);

  const catalog = screen.getByTestId('services-catalog');
  const firstLink = within(catalog).getByRole('link', { name: `Открыть страницу услуги ${services[0].name}` });

  expect(firstLink).toHaveAttribute('href', `/services/${services[0].slug}`);
  expect(firstLink).toHaveAttribute('data-link-appearance', 'button');
});

test('switches to a mobile trio slider with a swipe progress indicator', () => {
  mockViewport(true);
  render(<ServicesSection />);

  const catalog = screen.getByTestId('services-catalog');
  const firstLink = within(catalog).getByRole('link', { name: `Открыть страницу услуги ${services[0].name}` });
  const progress = screen.getByTestId('services-slider-progress');

  expect(catalog).toHaveAttribute('data-mobile-layout', 'slider-trio');
  expect(within(catalog).getAllByTestId('service-card')).toHaveLength(services.length);
  expect(screen.queryByTestId('services-reveal-button')).not.toBeInTheDocument();
  expect(firstLink).toHaveAttribute('data-link-appearance', 'card');
  expect(progress).toHaveAttribute('role', 'progressbar');
  expect(progress).toHaveAttribute('aria-valuenow', '0');

  Object.defineProperties(catalog, {
    clientWidth: { configurable: true, value: 290 },
    scrollWidth: { configurable: true, value: 580 },
  });

  Object.defineProperty(catalog, 'scrollLeft', {
    configurable: true,
    writable: true,
    value: 145,
  });

  fireEvent.scroll(catalog);
  expect(progress).toHaveAttribute('aria-valuenow', '50');
});
