import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { siteConfig } from './content';
import { AppRoutes } from './AppRoutes';

const services = siteConfig.services;

test('renders dedicated privacy page route', () => {
  render(
    <MemoryRouter initialEntries={['/privacy']}>
      <AppRoutes />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { level: 1, name: 'Политика конфиденциальности' })).toBeInTheDocument();
});

test('renders dedicated offer page route', () => {
  render(
    <MemoryRouter initialEntries={['/offer']}>
      <AppRoutes />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { level: 1, name: 'Договор-оферта' })).toBeInTheDocument();
});

test('renders dedicated cookies page route', () => {
  render(
    <MemoryRouter initialEntries={['/cookies']}>
      <AppRoutes />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { level: 1, name: 'Политика использования cookie' })).toBeInTheDocument();
});

test('renders service and extra internal pages', () => {
  const { unmount } = render(
    <MemoryRouter initialEntries={[`/services/${services[0].slug}`]}>
      <AppRoutes />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { level: 1, name: services[0].name })).toBeInTheDocument();
  unmount();

  render(
    <MemoryRouter initialEntries={['/extras/branded-cart']}>
      <AppRoutes />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { level: 1, name: 'Брендирование тележки для кейтеринга' })).toBeInTheDocument();
  unmount();

  render(
    <MemoryRouter initialEntries={['/extras/cart-rental']}>
      <AppRoutes />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { level: 1, name: 'Аренда тележек' })).toBeInTheDocument();
});

test('renders articles index route', () => {
  render(
    <MemoryRouter initialEntries={['/articles']}>
      <AppRoutes />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { level: 1, name: 'Статьи' })).toBeInTheDocument();
});

test('renders a dedicated Russian not found page for unknown routes', () => {
  render(
    <MemoryRouter initialEntries={['/missing-page']}>
      <AppRoutes />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { level: 1, name: /Страница не найдена/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Вернуться на главную/i })).toHaveAttribute('href', '/');
});

test('renders not found page for unknown offering slugs and removed extra routes', () => {
  const firstRender = render(
    <MemoryRouter initialEntries={['/services/no-such-service']}>
      <AppRoutes />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { level: 1, name: /Страница не найдена/i })).toBeInTheDocument();
  firstRender.unmount();

  const secondRender = render(
    <MemoryRouter initialEntries={['/extras/no-such-extra']}>
      <AppRoutes />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { level: 1, name: /Страница не найдена/i })).toBeInTheDocument();
  secondRender.unmount();

  const thirdRender = render(
    <MemoryRouter initialEntries={['/extras/plov-station']}>
      <AppRoutes />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { level: 1, name: /Страница не найдена/i })).toBeInTheDocument();
  thirdRender.unmount();
});
