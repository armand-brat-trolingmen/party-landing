import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { navItems, siteContent } from '../../data/siteContent';
import { OrderModalProvider } from '../cta/OrderModalContext';
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

function renderHeader(initialEntries: string[] = ['/'], legalMode = false) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <OrderModalProvider>
        <SiteHeader legalMode={legalMode} />
      </OrderModalProvider>
    </MemoryRouter>,
  );
}

test('shows desktop navigation with a dedicated order button on the homepage', () => {
  mockViewport(true);
  renderHeader();

  const header = screen.getByTestId('site-header');
  const navigation = within(header).getByRole('navigation');
  const orderButton = within(header).getByTestId('header-order-button');

  expect(header).toHaveAttribute('data-header-route', 'home');
  expect(within(header).getByRole('link', { name: siteContent.brand })).toHaveAttribute('href', '#hero');
  expect(within(header).getByText(siteContent.brand)).toBeInTheDocument();
  expect(orderButton).toBeInTheDocument();
  expect(within(orderButton).getByTestId('header-order-button-arrow')).toHaveAttribute('aria-hidden', 'true');
  expect(screen.getByTestId('nav-active-indicator')).toBeInTheDocument();

  navItems.forEach((item) => {
    expect(within(navigation).getByRole('link', { name: item.label })).toHaveAttribute('href', `#${item.id}`);
  });
});

test('keeps route-aware links on internal pages', () => {
  mockViewport(true);
  renderHeader(['/services/cotton-candy']);

  expect(screen.getByTestId('site-header')).toHaveAttribute('data-header-route', 'inner');
  const navigation = screen.getByRole('navigation');

  expect(within(navigation).getByRole('link', { name: 'О нас' })).toHaveAttribute('href', '/#about');
  expect(within(navigation).getByRole('link', { name: 'Услуги' })).toHaveAttribute('href', '#services');
  expect(within(navigation).getByRole('link', { name: 'Доп. услуги' })).toHaveAttribute('href', '#extras');
  expect(within(navigation).getByRole('link', { name: 'Отзывы' })).toHaveAttribute('href', '#testimonials');
});

test('keeps mobile navigation collapsed by default and moves order CTA into the menu', () => {
  mockViewport(false);
  renderHeader();

  const menuButton = screen.getByTestId('menu-button');
  expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByTestId('header-order-button')).not.toBeInTheDocument();
  expect(screen.queryByRole('navigation')).not.toBeInTheDocument();

  fireEvent.click(menuButton);
  expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('navigation')).toBeInTheDocument();
  expect(screen.getByTestId('mobile-menu-order-button')).toBeInTheDocument();
});

test('hides order CTA in legal mode and routes links back to the homepage', () => {
  mockViewport(true);
  renderHeader(['/privacy'], true);

  const navigation = screen.getByRole('navigation');
  expect(screen.queryByTestId('header-order-button')).not.toBeInTheDocument();
  expect(within(navigation).getByRole('link', { name: 'Контакты' })).toHaveAttribute('href', '/#contact');
});
