import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AppRoutes } from './AppRoutes';

test('renders dedicated privacy page route', () => {
  render(
    <MemoryRouter initialEntries={['/privacy']}>
      <AppRoutes />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { level: 1, name: 'Политика конфиденциальности' })).toBeInTheDocument();
});

test('renders dedicated terms page route', () => {
  render(
    <MemoryRouter initialEntries={['/terms']}>
      <AppRoutes />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { level: 1, name: 'Пользовательское соглашение' })).toBeInTheDocument();
});

test('renders dedicated consent page route', () => {
  render(
    <MemoryRouter initialEntries={['/consent']}>
      <AppRoutes />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { level: 1, name: 'Согласие на обработку персональных данных' })).toBeInTheDocument();
});

test('renders service and extra internal pages', () => {
  const { unmount } = render(
    <MemoryRouter initialEntries={['/services/food-trucks']}>
      <AppRoutes />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { level: 1, name: 'Фудтраки' })).toBeInTheDocument();
  unmount();

  render(
    <MemoryRouter initialEntries={['/extras/branded-serving']}>
      <AppRoutes />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { level: 1, name: 'Брендированная подача' })).toBeInTheDocument();
});
