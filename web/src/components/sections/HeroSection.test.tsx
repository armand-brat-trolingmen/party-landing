import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';
import { HeroSection } from './HeroSection';

test('renders the editorial hero with a poster carousel and no supporting tag pill', () => {
  render(
    <MemoryRouter>
      <HeroSection />
    </MemoryRouter>,
  );

  const hero = screen.getByTestId('section-hero');

  expect(hero).toHaveAttribute('data-hero-style', 'editorial-poster');
  expect(screen.getByTestId('hero-title-line-1')).toHaveTextContent('Фуд-станции');
  expect(screen.getByTestId('hero-title-line-2')).toHaveTextContent('на ваше');
  expect(screen.getByTestId('hero-title-line-3')).toHaveTextContent('мероприятие');
  expect(screen.getByRole('heading', { level: 1, name: 'Фуд-станции на ваше мероприятие' })).toBeInTheDocument();
  expect(screen.queryByText(/москва и область/i)).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Заказать' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'В каталог' })).toBeInTheDocument();
  expect(screen.getByTestId('hero-poster-carousel')).toBeInTheDocument();
  expect(screen.getByTestId('hero-poster-frame')).toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'Шоколадный фонтан на премиальной фуд-станции' })).toBeInTheDocument();
  expect(within(hero).queryByText('Праздник каждый день')).not.toBeInTheDocument();
  expect(screen.queryByTestId('hero-scene')).not.toBeInTheDocument();
});

test('scrolls to the homepage CTA from the hero primary action', () => {
  const originalMatchMedia = window.matchMedia;
  const scrollIntoView = vi.fn();
  const ctaTarget = document.createElement('div');

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockReturnValue({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });

  ctaTarget.id = 'cta';
  ctaTarget.scrollIntoView = scrollIntoView;
  document.body.appendChild(ctaTarget);

  render(
    <MemoryRouter>
      <HeroSection />
    </MemoryRouter>,
  );

  fireEvent.click(screen.getByRole('button', { name: 'Заказать' }));

  expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });

  ctaTarget.remove();
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: originalMatchMedia,
  });
});
