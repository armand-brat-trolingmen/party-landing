import { render, screen, within } from '@testing-library/react';
import { siteConfig } from '../../content';
import { ExtrasSection } from './ExtrasSection';

const extras = siteConfig.extras;
const firstExtra = extras[0];
function toLooseNamePattern(value: string) {
  return new RegExp(value.split(/\s+/).join('\\s*'), 'i');
}

function mockViewport(isMobile: boolean, options?: { coarsePointer?: boolean }) {
  const coarsePointer = options?.coarsePointer ?? isMobile;

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches:
        (query.includes('max-width: 720px') ? isMobile : false) &&
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

test('renders extras inside the wide canvas without a framed outer surface', () => {
  mockViewport(false);
  render(<ExtrasSection />);

  const section = screen.getByTestId('section-extras');
  const sectionQueries = within(section);
  const track = sectionQueries.getByTestId('extras-track');
  const extraArticles = within(track).getAllByRole('article');
  const extraLinks = within(track).getAllByRole('link');
  const brandingImage = sectionQueries.getByRole('img', { name: new RegExp(firstExtra.name, 'i') });
  const equipmentImage = sectionQueries.getByRole('img', { name: new RegExp(extras[1].name, 'i') });
  const cartRentalImage = sectionQueries.getByRole('img', { name: new RegExp(extras[2].name, 'i') });
  const sources = sectionQueries.getAllByTestId('extra-visual-source-webp');

  expect(sectionQueries.getByRole('heading', { level: 2, name: siteConfig.homepage.extras.title })).toBeInTheDocument();
  expect(section).not.toHaveAttribute('data-section-tone');
  expect(track).toHaveAttribute('data-extras-style', 'continuation-grid');
  expect(track).toHaveAttribute('data-mobile-layout', 'grid');
  expect(sectionQueries.queryByTestId('extras-slider-progress')).not.toBeInTheDocument();
  expect(extraArticles).toHaveLength(3);
  expect(sectionQueries.getByRole('heading', { level: 3, name: toLooseNamePattern(firstExtra.name) })).toBeInTheDocument();
  expect(sectionQueries.getByRole('heading', { level: 3, name: toLooseNamePattern(extras[1].name) })).toBeInTheDocument();
  expect(sectionQueries.getByRole('heading', { level: 3, name: toLooseNamePattern(extras[2].name) })).toBeInTheDocument();
  expect(sectionQueries.queryByText(/\u043e\u0442 \d/i)).not.toBeInTheDocument();
  expect(sectionQueries.queryAllByTestId('extra-visual-blank')).toHaveLength(0);
  expect(brandingImage).toHaveAttribute('src', '/images/extras/branding-ui.png');
  expect(equipmentImage).toHaveAttribute('src', '/images/extras/equipment-ui.png');
  expect(cartRentalImage).toHaveAttribute('src', '/images/extras/cart-rental-ui.png');
  expect(sources).toHaveLength(3);
  expect(sources[0]).toHaveAttribute('srcset', '/images/extras/branding-ui.webp');
  expect(sources[1]).toHaveAttribute('srcset', '/images/extras/equipment-ui.webp');
  expect(sources[2]).toHaveAttribute('srcset', '/images/extras/cart-rental-ui.webp');
  expect(brandingImage).toHaveAttribute('loading', 'eager');
  expect(brandingImage).toHaveAttribute('fetchpriority', 'high');
  expect(equipmentImage).toHaveAttribute('loading', 'lazy');
  expect(equipmentImage).toHaveAttribute('fetchpriority', 'low');
  expect(extraLinks[0]).toHaveAttribute('data-link-appearance', 'button');
  expect(extraLinks[0]).toHaveAccessibleName(expect.stringContaining(firstExtra.name));
  expect(extraLinks[0]).toHaveAccessibleName(expect.stringContaining(firstExtra.shortDescription));
});

test('keeps extras in the grid flow on coarse mobile devices instead of switching to a slider', () => {
  mockViewport(true, { coarsePointer: true });
  render(<ExtrasSection />);

  const track = screen.getByTestId('extras-track');
  const firstLink = within(track).getAllByRole('link')[0];

  expect(track).toHaveAttribute('data-mobile-layout', 'grid');
  expect(firstLink).toHaveAttribute('data-link-appearance', 'button');
  expect(screen.queryByTestId('extras-slider-progress')).not.toBeInTheDocument();
});

test('keeps narrow fine-pointer desktops in the grid layout without device-specific switching', () => {
  mockViewport(true, { coarsePointer: false });
  render(<ExtrasSection />);

  const track = screen.getByTestId('extras-track');
  const firstLink = within(track).getAllByRole('link')[0];

  expect(track).toHaveAttribute('data-mobile-layout', 'grid');
  expect(firstLink).toHaveAttribute('data-link-appearance', 'button');
});

test('renders extra card titles as whole phrases without forced per-line spans', () => {
  mockViewport(false);
  render(<ExtrasSection />);

  const headings = screen.getAllByRole('heading', { level: 3 });

  expect(screen.queryByTestId('extra-card-title-line')).not.toBeInTheDocument();
  expect(headings[0]).toHaveTextContent(/брендирование\s+тележки\s+для\s+кейтеринга/i);
  expect(headings[1]).toHaveTextContent(/аренда\s+оборудования/i);
  expect(headings[2]).toHaveTextContent(/аренда\s+тележек/i);
});

test('can promote only the requested extras images when rendered above the fold', () => {
  mockViewport(false);
  render(<ExtrasSection priorityImageCount={1} />);

  const images = screen.getAllByTestId('extra-visual-image');

  expect(images[0]).toHaveAttribute('loading', 'eager');
  expect(images[0]).toHaveAttribute('fetchpriority', 'high');
  expect(images[1]).toHaveAttribute('loading', 'lazy');
  expect(images[1]).toHaveAttribute('fetchpriority', 'low');
});
