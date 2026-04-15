import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { siteConfig } from '../../content';
import { OrderModalProvider } from '../cta/OrderModalContext';
import { SiteHeader } from './SiteHeader';

const navItems = siteConfig.navigation;

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

function createRect({
  left = 0,
  top = 0,
  width = 0,
  height = 0,
}: {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
}) {
  return {
    x: left,
    y: top,
    top,
    left,
    width,
    height,
    right: left + width,
    bottom: top + height,
    toJSON: () => undefined,
  } as DOMRect;
}

test('shows desktop navigation with a dedicated order button on the homepage', () => {
  mockViewport(true);
  renderHeader();

  const header = screen.getByTestId('site-header');
  const navigation = within(header).getByRole('navigation');
  const orderButton = within(header).getByTestId('header-order-button');

  expect(header).toHaveAttribute('data-header-route', 'home');
  expect(within(header).getByRole('link', { name: siteConfig.brand.name })).toHaveAttribute('href', '#hero');
  expect(within(header).getByText(siteConfig.brand.name)).toBeInTheDocument();
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

test('mobile rest header keeps the measured text shift reset while the brand title stays hidden', () => {
  mockViewport(false);

  const rectSpy = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function mockRect(this: Element) {
    const element = this as HTMLElement;

    if (element.dataset.testid === 'brand-plate') {
      return createRect({ left: 8, top: 8, width: 62, height: 62 });
    }

    if (element.dataset.testid === 'donut-logo') {
      return createRect({ left: -18, top: -6, width: 122, height: 122 });
    }

    if (element.dataset.testid === 'menu-button') {
      return createRect({ left: 304, top: 18, width: 44, height: 44 });
    }

    if (element.tagName === 'SPAN' && element.textContent === siteConfig.brand.name) {
      return createRect({ left: 110, top: 20, width: 180, height: 20 });
    }

    return createRect({ left: 0, top: 0, width: 0, height: 0 });
  });

  try {
    renderHeader();

    const header = screen.getByTestId('site-header');
    fireEvent(window, new Event('resize'));

    expect(Number.parseFloat(header.style.getPropertyValue('--mobile-brand-text-shift'))).toBe(0);
  } finally {
    rectSpy.mockRestore();
  }
});

test('mobile compact header measures a text shift so the brand title stays centered between the logo and menu button', () => {
  mockViewport(false);

  const rectSpy = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function mockRect(this: Element) {
    const element = this as HTMLElement;

    if (element.dataset.testid === 'brand-plate') {
      return createRect({ left: 14, top: 10, width: 50, height: 50 });
    }

    if (element.dataset.testid === 'donut-logo') {
      return createRect({ left: 2, top: 2, width: 74, height: 74 });
    }

    if (element.dataset.testid === 'menu-button') {
      return createRect({ left: 308, top: 14, width: 40, height: 40 });
    }

    if (element.tagName === 'SPAN' && element.textContent === siteConfig.brand.name) {
      return createRect({ left: 104, top: 22, width: 166, height: 18 });
    }

    return createRect({ left: 0, top: 0, width: 0, height: 0 });
  });

  try {
    renderHeader(['/services/cotton-candy']);

    const header = screen.getByTestId('site-header');
    fireEvent(window, new Event('resize'));

    expect(header).toHaveAttribute('data-header-state', 'compact');
    expect(Number.parseFloat(header.style.getPropertyValue('--mobile-brand-text-shift'))).not.toBe(0);
  } finally {
    rectSpy.mockRestore();
  }
});

test('hides order CTA in legal mode and routes links back to the homepage', () => {
  mockViewport(true);
  renderHeader(['/privacy'], true);

  const navigation = screen.getByRole('navigation');
  expect(screen.queryByTestId('header-order-button')).not.toBeInTheDocument();
  expect(within(navigation).getByRole('link', { name: 'Контакты' })).toHaveAttribute('href', '/#contact');
});
