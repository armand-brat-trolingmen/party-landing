import { fireEvent, render, screen, within } from '@testing-library/react';
import { navItems, siteContent } from '../../data/siteContent';
import { SiteHeader } from './SiteHeader';

function mockViewport(isDesktop: boolean) {
  const matchMediaMock = vi.fn().mockImplementation(() => ({
    matches: isDesktop,
    media: '(min-width: 721px)',
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: matchMediaMock,
  });
}

test('shows desktop navigation inside a glass header with only a logo brand trigger', () => {
  mockViewport(true);
  render(<SiteHeader />);

  const navigation = screen.getByRole('navigation');
  const header = screen.getByTestId('site-header');

  expect(screen.queryByTestId('menu-button')).not.toBeInTheDocument();
  expect(header).toHaveAttribute('data-header-state', 'rest');
  expect(header).toHaveAttribute('data-header-material', 'glass');
  expect(screen.getByTestId('nav-active-indicator')).toBeInTheDocument();
  expect(within(header).getByRole('link', { name: siteContent.brand })).toBeInTheDocument();
  expect(within(header).queryByText(siteContent.brand)).not.toBeInTheDocument();
  expect(within(header).queryByText(siteContent.tagline)).not.toBeInTheDocument();

  navItems.forEach((item) => {
    expect(within(navigation).getByRole('link', { name: item.label })).toHaveAttribute('href', `#${item.id}`);
  });
});

test('keeps mobile navigation collapsed by default', () => {
  mockViewport(false);
  render(<SiteHeader />);

  const menuButton = screen.getByTestId('menu-button');

  expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByTestId('brand-plate')).toBeInTheDocument();
  expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
});

test('reveals and collapses mobile navigation via menu button and links', () => {
  mockViewport(false);
  render(<SiteHeader />);

  const menuButton = screen.getByTestId('menu-button');

  fireEvent.click(menuButton);
  expect(menuButton).toHaveAttribute('aria-expanded', 'true');

  const navigation = screen.getByRole('navigation');
  navItems.forEach((item) => {
    expect(within(navigation).getByRole('link', { name: item.label })).toHaveAttribute('href', `#${item.id}`);
  });

  fireEvent.click(within(navigation).getByRole('link', { name: navItems[0].label }));
  expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
});

test('marks a desktop nav item active after clicking its anchor', () => {
  mockViewport(true);
  render(<SiteHeader />);

  const navLinks = within(screen.getByRole('navigation')).getAllByRole('link');
  const aboutLink = navLinks[0];

  fireEvent.click(aboutLink);

  expect(aboutLink).toHaveAttribute('data-active', 'true');
});
