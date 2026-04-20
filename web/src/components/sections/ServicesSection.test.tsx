import { fireEvent, render, screen, within } from '@testing-library/react';
import { siteConfig } from '../../content';
import { ServicesSection } from './ServicesSection';

const services = siteConfig.services;
const firstService = services[0];

function mockViewport(width: number, options?: { coarsePointer?: boolean }) {
  const coarsePointer = options?.coarsePointer ?? false;

  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  });

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches:
        (query.includes('max-width: 720px') ? width <= 720 : true) &&
        (query.includes('pointer: coarse') ? coarsePointer : true),
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
  const images = within(catalog).getAllByTestId('service-card-media-image');

  expect(within(section).getByRole('heading', { level: 2, name: siteConfig.homepage.services.title })).toBeInTheDocument();
  expect(catalog).toHaveAttribute('data-showcase-style', 'premium-grid');
  expect(cards).toHaveLength(services.length);
  expect(screen.queryByTestId('services-reveal-button')).not.toBeInTheDocument();
  expect(within(catalog).getByRole('heading', { level: 3, name: services[services.length - 1].name })).toBeInTheDocument();
  expect(firstImage).toBeInTheDocument();
  expect(firstWebpSource).toHaveAttribute('srcset', expect.stringContaining(firstService.homeCardImage?.src ?? ''));
  expect(firstImage).toHaveAttribute('src', expect.stringContaining(firstService.homeCardImage?.fallbackSrc ?? ''));
  expect(firstImage).toHaveAttribute('loading', 'eager');
  expect(firstImage).toHaveAttribute('fetchpriority', 'high');
  expect(firstImage).toHaveAttribute('width', '1024');
  expect(firstImage).toHaveAttribute('height', '1024');
  expect(firstImage).toHaveAttribute(
    'sizes',
    '(max-width: 720px) calc(100vw - 2.3rem), (max-width: 1079px) 46vw, 31vw',
  );
  expect(images.every((image) => image.getAttribute('loading') === 'eager')).toBe(true);
  expect(within(firstCard).getByTestId('service-card-description')).toHaveTextContent(firstService.cardDescription ?? firstService.shortDescription);
  expect(within(firstCard).getByText(firstService.price?.display ?? firstService.priceFrom)).toBeInTheDocument();
  expect(within(firstCard).queryByText(firstService.shortDescription)).not.toBeInTheDocument();
});

test('routes each desktop card to its dedicated internal service page', () => {
  mockViewport(1280);
  render(<ServicesSection />);

  const catalog = screen.getByTestId('services-catalog');
  const firstLink = within(catalog)
    .getAllByRole('link')
    .find((link) => link.getAttribute('href') === `/services/${services[0].slug}/`);

  expect(firstLink).toHaveAttribute('href', `/services/${services[0].slug}/`);
  expect(firstLink).toHaveAccessibleName(expect.stringContaining(services[0].name));
  expect(firstLink).toHaveAccessibleName(expect.stringContaining(services[0].price?.display ?? services[0].priceFrom));
});

test('keeps the mobile slider with a swipe progress indicator while rendering the full catalog', () => {
  mockViewport(390, { coarsePointer: true });
  render(<ServicesSection />);

  const catalog = screen.getByTestId('services-catalog');
  const firstCard = within(catalog).getAllByTestId('service-card')[0] as HTMLElement;
  const firstMeta = within(firstCard).getByTestId('service-card-meta');
  const progress = screen.getByTestId('services-slider-progress');
  const images = within(catalog).getAllByTestId('service-card-media-image');

  expect(within(catalog).getAllByTestId('service-card')).toHaveLength(services.length);
  expect(screen.queryByTestId('services-reveal-button')).not.toBeInTheDocument();
  expect(images.length).toBeGreaterThan(0);
  expect(within(firstCard).getByTestId('service-card-media-source-webp')).toHaveAttribute(
    'srcset',
    expect.stringContaining(firstService.homeCardImage?.src ?? ''),
  );
  expect(firstMeta).toBeInTheDocument();
  expect(within(firstCard).getByTestId('service-card-description')).toHaveTextContent(firstService.cardDescription ?? firstService.shortDescription);
  expect(images[0]).toHaveAttribute('src', expect.stringContaining(firstService.homeCardImage?.fallbackSrc ?? ''));
  expect(within(firstCard).getByText(firstService.price?.display ?? firstService.priceFrom)).toBeInTheDocument();
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

test('keeps deep mobile slider images eager so fast swipes do not show blank cards', () => {
  mockViewport(390, { coarsePointer: true });
  render(<ServicesSection />);

  const catalog = screen.getByTestId('services-catalog');
  const images = within(catalog).getAllByTestId('service-card-media-image');

  expect(images.length).toBe(services.length);
  expect(images[0]).toHaveAttribute('loading', 'eager');
  expect(images[1]).toHaveAttribute('loading', 'eager');
  expect(images[2]).toHaveAttribute('loading', 'eager');
  expect(images[3]).toHaveAttribute('loading', 'eager');
  expect(images[6]).toHaveAttribute('loading', 'eager');
  expect(images[11]).toHaveAttribute('loading', 'eager');
  expect(images[0]).toHaveAttribute('fetchpriority', 'high');
  expect(images[1]).toHaveAttribute('fetchpriority', 'high');
  expect(images[2]).toHaveAttribute('fetchpriority', 'auto');
  expect(images[6]).toHaveAttribute('fetchpriority', 'auto');
  expect(catalog.querySelector('[data-service-image-slug="foam-cannon"]')).toHaveStyle({ objectFit: 'contain' });
});

test('keeps narrow fine-pointer laptops in the grid flow instead of enabling the mobile slider', () => {
  mockViewport(700, { coarsePointer: false });
  render(<ServicesSection />);

  const catalog = screen.getByTestId('services-catalog');
  const progress = screen.getByTestId('services-slider-progress');
  const images = within(catalog).getAllByTestId('service-card-media-image');

  expect(catalog).toHaveAttribute('data-mobile-layout', 'grid');
  expect(images[0]).toHaveAttribute('loading', 'eager');
  expect(images[1]).toHaveAttribute('loading', 'eager');
  expect(images[2]).toHaveAttribute('loading', 'eager');
  expect(images[3]).toHaveAttribute('loading', 'eager');
  expect(images[10]).toHaveAttribute('loading', 'eager');

  Object.defineProperties(catalog, {
    clientWidth: { configurable: true, value: 320 },
    scrollWidth: { configurable: true, value: 640 },
  });

  Object.defineProperty(catalog, 'scrollLeft', {
    configurable: true,
    writable: true,
    value: 160,
  });

  fireEvent.scroll(catalog);
  expect(progress).toHaveAttribute('aria-valuenow', '0');
});
