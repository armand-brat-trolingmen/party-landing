import { fireEvent, render, screen, within } from '@testing-library/react';
import { siteConfig } from '../../content';
import { ExtrasSection } from './ExtrasSection';

const extras = siteConfig.extras;

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

test('renders extras inside the wide canvas without a framed outer surface', () => {
  mockViewport(false);
  render(<ExtrasSection />);

  const section = screen.getByTestId('section-extras');
  const sectionQueries = within(section);

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'Доп. услуги' })).toBeInTheDocument();
  expect(section).not.toHaveAttribute('data-section-tone');
  expect(sectionQueries.getByTestId('extras-track')).toHaveAttribute('data-extras-style', 'continuation-grid');
  expect(sectionQueries.getByTestId('extras-track')).toHaveAttribute('data-mobile-layout', 'grid');
  expect(sectionQueries.queryByTestId('extras-slider-progress')).not.toBeInTheDocument();
  expect(sectionQueries.getByRole('link', { name: `Открыть страницу услуги ${extras[0].name}` })).toHaveAttribute(
    'data-link-appearance',
    'button',
  );
});

test('switches extras to a single-card mobile slider with a swipe progress indicator', () => {
  mockViewport(true);
  render(<ExtrasSection />);

  const track = screen.getByTestId('extras-track');
  const firstLink = within(track).getByRole('link', { name: `Открыть страницу услуги ${extras[0].name}` });
  const progress = screen.getByTestId('extras-slider-progress');

  expect(track).toHaveAttribute('data-mobile-layout', 'slider-single');
  expect(firstLink).toHaveAttribute('data-link-appearance', 'card');
  expect(progress).toHaveAttribute('role', 'progressbar');
  expect(progress).toHaveAttribute('aria-valuenow', '0');

  Object.defineProperties(track, {
    clientWidth: { configurable: true, value: 320 },
    scrollWidth: { configurable: true, value: 640 },
  });

  Object.defineProperty(track, 'scrollLeft', {
    configurable: true,
    writable: true,
    value: 160,
  });

  fireEvent.scroll(track);
  expect(progress).toHaveAttribute('aria-valuenow', '50');
});
