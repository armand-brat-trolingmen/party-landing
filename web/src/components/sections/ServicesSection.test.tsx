import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { siteConfig } from '../../content';
import { ServicesSection } from './ServicesSection';

const services = siteConfig.services;

function mockViewport(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  });

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('max-width: 720px') ? width <= 720 : false,
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

test('renders the full services catalog on desktop without hiding cards behind a reveal toggle', () => {
  mockViewport(1280);
  render(<ServicesSection />);

  const section = screen.getByTestId('section-services');
  const catalog = screen.getByTestId('services-catalog');
  const cards = within(catalog).getAllByTestId('service-card');
  const firstCard = cards[0] as HTMLElement;
  const firstImage = within(firstCard).getByTestId('service-card-media-image');
  const firstWebpSource = within(firstCard).getByTestId('service-card-media-source-webp');

  expect(within(section).getByRole('heading', { level: 2, name: siteConfig.homepage.services.title })).toBeInTheDocument();
  expect(catalog).toHaveAttribute('data-showcase-style', 'premium-grid');
  expect(cards).toHaveLength(services.length);
  expect(screen.queryByTestId('services-reveal-button')).not.toBeInTheDocument();
  expect(within(catalog).getByRole('heading', { level: 3, name: services[services.length - 1].name })).toBeInTheDocument();
  expect(firstImage).toBeInTheDocument();
  expect(firstWebpSource).toHaveAttribute('srcset', expect.stringContaining('/images/services-home/cotton-candy.webp'));
  expect(firstImage).toHaveAttribute('src', expect.stringContaining('/images/services-home/cotton-candy.webp'));
  expect(firstImage).toHaveAttribute('loading', 'eager');
  expect(firstImage).toHaveAttribute('fetchpriority', 'high');
  expect(firstImage).toHaveAttribute('width', '1024');
  expect(firstImage).toHaveAttribute('height', '1024');
  expect(firstImage).toHaveAttribute(
    'sizes',
    '(max-width: 720px) calc(100vw - 2.3rem), (max-width: 960px) 44vw, (max-width: 1320px) 29vw, 22vw',
  );
  expect(within(firstCard).getByText(services[0].price?.display ?? services[0].priceFrom)).toBeInTheDocument();
  expect(within(catalog).queryByText(services[0].shortDescription)).not.toBeInTheDocument();
});

test('routes each desktop card to its dedicated internal service page', () => {
  mockViewport(1280);
  render(<ServicesSection />);

  const catalog = screen.getByTestId('services-catalog');
  const firstLink = within(catalog)
    .getAllByRole('link')
    .find((link) => link.getAttribute('href') === '/services/cotton-candy');

  expect(firstLink).toHaveAttribute('href', '/services/cotton-candy');
});

test('keeps the mobile slider with a swipe progress indicator while rendering the full catalog', () => {
  mockViewport(390);
  render(<ServicesSection />);

  const catalog = screen.getByTestId('services-catalog');
  const firstCard = within(catalog).getAllByTestId('service-card')[0] as HTMLElement;
  const progress = screen.getByTestId('services-slider-progress');
  const images = within(catalog).getAllByTestId('service-card-media-image');

  expect(within(catalog).getAllByTestId('service-card')).toHaveLength(services.length);
  expect(screen.queryByTestId('services-reveal-button')).not.toBeInTheDocument();
  expect(images.length).toBeGreaterThan(0);
  expect(within(firstCard).getByTestId('service-card-media-source-webp')).toHaveAttribute(
    'srcset',
    expect.stringContaining('/images/services-home/cotton-candy.webp'),
  );
  expect(images[0]).toHaveAttribute('src', expect.stringContaining('/images/services-home/cotton-candy.webp'));
  expect(within(firstCard).getByText(services[0].price?.display ?? services[0].priceFrom)).toBeInTheDocument();
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

test('progressively unlocks more mobile slider images after scrolling so cards do not stay blank', async () => {
  mockViewport(390);
  render(<ServicesSection />);

  const catalog = screen.getByTestId('services-catalog');
  const images = within(catalog).getAllByTestId('service-card-media-image');
  const deferredImage = images[6];

  expect(images.length).toBe(services.length);
  expect(images[0]).toHaveAttribute('loading', 'eager');
  expect(images[1]).toHaveAttribute('loading', 'eager');
  expect(images[2]).toHaveAttribute('loading', 'eager');
  expect(images[3]).toHaveAttribute('loading', 'eager');
  expect(deferredImage).toHaveAttribute('loading', 'lazy');
  expect(images[0]).toHaveAttribute('fetchpriority', 'high');
  expect(deferredImage).toHaveAttribute('fetchpriority', 'low');

  Object.defineProperties(catalog, {
    clientWidth: { configurable: true, value: 320 },
    scrollWidth: { configurable: true, value: 320 * services.length },
  });

  Object.defineProperty(catalog, 'scrollLeft', {
    configurable: true,
    writable: true,
    value: 320 * 4,
  });

  fireEvent.scroll(catalog);

  await act(async () => {
    await Promise.resolve();
  });

  expect(within(catalog).getAllByTestId('service-card-media-image')[6]).toHaveAttribute('loading', 'eager');
  expect(catalog.querySelector('[data-service-image-slug="foam-cannon"]')).toHaveStyle({ objectFit: 'contain' });
});
