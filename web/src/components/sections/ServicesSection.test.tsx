import { act, fireEvent, render, screen, within } from '@testing-library/react';
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

test('renders the services catalog as a revealable centered showcase without helper chips', async () => {
  vi.useFakeTimers();

  try {
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
    const firstCard = cards[0] as HTMLElement;
    const firstImage = within(firstCard).getByTestId('service-card-media-image');
    const firstWebpSource = within(firstCard).getByTestId('service-card-media-source-webp');

    expect(cards).toHaveLength(9);
    expect(within(catalog).getByRole('heading', { level: 3, name: 'Сахарная вата' })).toBeInTheDocument();
    expect(firstImage).toBeInTheDocument();
    expect(firstWebpSource).toHaveAttribute('srcset', expect.stringContaining('/images/services-home/cotton-candy.webp'));
    expect(firstImage).toHaveAttribute('src', expect.stringContaining('/images/services-home-fallback/cotton-candy.png'));
    expect(firstImage).toHaveAttribute('loading', 'lazy');
    expect(firstImage).toHaveAttribute('width', '1024');
    expect(firstImage).toHaveAttribute('height', '1024');
    expect(firstImage).toHaveAttribute('sizes', '(max-width: 720px) 34vw, (max-width: 1120px) 44vw, 29vw');
    expect(within(firstCard).getByText('от 12.000 ₽')).toBeInTheDocument();
    expect(within(catalog).queryByText(services[0].shortDescription)).not.toBeInTheDocument();
    expect(within(catalog).queryByRole('heading', { level: 3, name: 'Пенная пушка' })).not.toBeInTheDocument();

    const revealButton = screen.getByTestId('services-reveal-button');
    expect(revealButton).toHaveTextContent('Показать ещё');

    fireEvent.click(revealButton);

    expect(within(catalog).getAllByTestId('service-card')).toHaveLength(services.length);
    expect(within(catalog).getByRole('heading', { level: 3, name: 'Пенная пушка' })).toBeInTheDocument();
    expect(within(catalog).getAllByTestId('service-card')[9]).toHaveAttribute('data-reveal-enter', 'true');
    expect(revealButton).toHaveTextContent('Свернуть');

    fireEvent.click(revealButton);

    expect(within(catalog).getAllByTestId('service-card')).toHaveLength(services.length);
    expect(within(catalog).getAllByTestId('service-card')[9]).toHaveAttribute('data-reveal-exit', 'true');
    expect(catalog).toHaveAttribute('data-services-collapsing', 'true');

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(within(catalog).getAllByTestId('service-card')).toHaveLength(9);
    expect(catalog).toHaveAttribute('data-services-expanded', 'false');
    expect(catalog).toHaveAttribute('data-services-collapsing', 'false');
    expect(revealButton).toHaveTextContent('Показать ещё');
  } finally {
    vi.useRealTimers();
  }
});

test('routes each desktop card to its dedicated internal service page through a button-like link', () => {
  mockViewport(false);
  render(<ServicesSection allowReveal={false} />);

  const catalog = screen.getByTestId('services-catalog');
  const firstLink = within(catalog).getByRole('link', { name: 'Открыть страницу услуги Сахарная вата' });

  expect(firstLink).toHaveAttribute('href', '/services/cotton-candy');
  expect(firstLink).toHaveAttribute('data-link-appearance', 'button');
});

test('switches to a mobile trio slider with a swipe progress indicator', () => {
  mockViewport(true);
  render(<ServicesSection />);

  const catalog = screen.getByTestId('services-catalog');
  const firstCard = within(catalog).getAllByTestId('service-card')[0] as HTMLElement;
  const firstLink = within(catalog).getByRole('link', { name: 'Открыть страницу услуги Сахарная вата' });
  const progress = screen.getByTestId('services-slider-progress');

  expect(catalog).toHaveAttribute('data-mobile-layout', 'slider-trio');
  expect(within(catalog).getAllByTestId('service-card')).toHaveLength(services.length);
  expect(screen.queryByTestId('services-reveal-button')).not.toBeInTheDocument();
  expect(firstLink).toHaveAttribute('data-link-appearance', 'card');
  const images = within(catalog).getAllByTestId('service-card-media-image');
  expect(images.length).toBeGreaterThan(0);
  expect(within(firstCard).getByTestId('service-card-media-source-webp')).toHaveAttribute(
    'srcset',
    expect.stringContaining('/images/services-home/cotton-candy.webp'),
  );
  expect(images[0]).toHaveAttribute('src', expect.stringContaining('/images/services-home-fallback/cotton-candy.png'));
  expect(within(firstCard).getByText('от 12.000 ₽')).toBeInTheDocument();
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
