import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { CookieBanner } from './CookieBanner';

afterEach(() => {
  cleanup();
  document.cookie = 'party_cookie_consent=; Max-Age=0; path=/';
  vi.restoreAllMocks();
});

test('shows collapsed consent copy, expands details, and links to privacy and cookie policy pages', () => {
  render(<CookieBanner />);

  expect(screen.getByText(/Пользуясь сайтом, вы соглашаетесь с использованием cookies/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /политикой конфиденциальности/i })).toHaveAttribute('href', '/privacy');
  expect(
    screen.queryByText(/Продолжая использовать сайт, Вы соглашаетесь с использованием cookies/i),
  ).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Подробнее/i }));

  expect(screen.getByRole('link', { name: /политикой использования cookie/i })).toHaveAttribute('href', '/cookies');
  expect(
    screen.getByText(/Продолжая использовать сайт, Вы соглашаетесь с использованием cookies/i),
  ).toBeInTheDocument();
});

test('hides permanently after accept until browser cookies are cleared', () => {
  const { rerender } = render(<CookieBanner />);

  fireEvent.click(screen.getByRole('button', { name: /Хорошо/i }));

  expect(screen.queryByRole('dialog', { name: /использование cookies/i })).not.toBeInTheDocument();
  expect(document.cookie).toContain('party_cookie_consent=accepted');

  rerender(<CookieBanner />);

  expect(screen.queryByRole('dialog', { name: /использование cookies/i })).not.toBeInTheDocument();
});
