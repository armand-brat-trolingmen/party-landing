import { render, screen, within } from '@testing-library/react';
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
  expect(within(sectionQueries.getByTestId('extras-track')).getAllByRole('article')).toHaveLength(2);
  expect(sectionQueries.getByRole('heading', { level: 3, name: 'Брендирование тележки для кейтеринга' })).toBeInTheDocument();
  expect(sectionQueries.getByRole('heading', { level: 3, name: 'Аренда оборудования' })).toBeInTheDocument();
  expect(sectionQueries.queryByText(/от \d/i)).not.toBeInTheDocument();
  const visualSlots = sectionQueries.queryAllByTestId('extra-visual-blank');
  const brandingImage = sectionQueries.getByRole('img', { name: /Брендирование тележки для кейтеринга/ });
  const equipmentImage = sectionQueries.getByRole('img', { name: /Аренда оборудования/ });

  expect(visualSlots).toHaveLength(0);
  expect(brandingImage).toHaveAttribute('src', '/images/extras/branding.webp');
  expect(equipmentImage).toHaveAttribute('src', '/images/extras/equipment.webp');
  expect(brandingImage).toHaveAttribute('loading', 'eager');
  expect(equipmentImage).toHaveAttribute('loading', 'eager');
  expect(sectionQueries.getByRole('link', { name: `Открыть страницу услуги ${extras[0].name}` })).toHaveAttribute(
    'data-link-appearance',
    'button',
  );
});

test('switches extras to a compact mobile slider without a swipe progress indicator', () => {
  mockViewport(true);
  render(<ExtrasSection />);

  const track = screen.getByTestId('extras-track');
  const firstLink = within(track).getByRole('link', { name: `Открыть страницу услуги ${extras[0].name}` });

  expect(track).toHaveAttribute('data-mobile-layout', 'slider-compact');
  expect(firstLink).toHaveAttribute('data-link-appearance', 'card');
  expect(screen.queryByTestId('extras-slider-progress')).not.toBeInTheDocument();
});
