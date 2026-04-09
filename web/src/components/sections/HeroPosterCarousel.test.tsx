import { act, render, screen } from '@testing-library/react';
import { HeroPosterCarousel, type HeroPosterSlide } from './HeroPosterCarousel';

const slides: HeroPosterSlide[] = [
  {
    id: 'main',
    image: '/images/hero/hero-main.png',
    alt: 'Шоколадный фонтан на премиальной фуд-станции',
  },
  {
    id: 'cotton',
    image: '/images/hero/hero-cotton.jpg',
    alt: 'Сладкая вата в выездном премиальном формате',
  },
  {
    id: 'truck',
    image: '/images/hero/hero-truck.jpg',
    alt: 'Фудтрак как часть кейтеринг-сцены мероприятия',
  },
];

test('autoplays through one premium poster frame at a time without manual controls', () => {
  vi.useFakeTimers();

  render(<HeroPosterCarousel slides={slides} />);

  expect(screen.getByRole('img', { name: slides[0].alt })).toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();

  act(() => {
    vi.advanceTimersByTime(5200);
  });

  expect(screen.getByRole('img', { name: slides[1].alt })).toBeInTheDocument();

  act(() => {
    vi.advanceTimersByTime(5200);
  });

  expect(screen.getByRole('img', { name: slides[2].alt })).toBeInTheDocument();

  vi.useRealTimers();
});
