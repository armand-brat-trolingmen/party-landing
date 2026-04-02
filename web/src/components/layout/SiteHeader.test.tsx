import { fireEvent, render, screen, within } from '@testing-library/react';
import { navItems } from '../../data/siteContent';
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

test('shows desktop navigation links without menu button', () => {
  mockViewport(true);
  render(<SiteHeader />);

  const navigation = screen.getByRole('navigation');

  expect(screen.queryByRole('button', { name: 'Меню' })).not.toBeInTheDocument();

  navItems.forEach((item) => {
    expect(within(navigation).getByRole('link', { name: item.label })).toHaveAttribute('href', `#${item.id}`);
  });
});

test('keeps mobile navigation collapsed by default', () => {
  mockViewport(false);
  render(<SiteHeader />);

  const menuButton = screen.getByRole('button', { name: 'Меню' });

  expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
});

test('reveals and collapses mobile navigation via menu button and links', () => {
  mockViewport(false);
  render(<SiteHeader />);

  const menuButton = screen.getByRole('button', { name: 'Меню' });

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
