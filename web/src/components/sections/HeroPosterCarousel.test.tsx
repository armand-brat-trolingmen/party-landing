import { act, render, screen } from '@testing-library/react';
import { HeroPosterCarousel, type HeroPosterSlide } from './HeroPosterCarousel';

const slides: HeroPosterSlide[] = [
  {
    id: 'main',
    image: '/images/hero/hero-main.png',
    fallbackImage: '/images/hero/hero-main.png',
    imageWebpSrcSet:
      '/images/hero/hero-main-480.webp 480w, /images/hero/hero-main-720.webp 720w, /images/hero/hero-main-960.webp 960w',
    sizes: '(max-width: 900px) 100vw, 31rem',
    width: 1258,
    height: 2048,
    alt: 'Шоколадный фонтан на премиальной фуд-станции',
  } as HeroPosterSlide,
  {
    id: 'cotton',
    image: '/images/hero/hero-cotton.jpg',
    fallbackImage: '/images/hero/hero-cotton.jpg',
    imageWebpSrcSet:
      '/images/hero/hero-cotton-480.webp 480w, /images/hero/hero-cotton-720.webp 720w, /images/hero/hero-cotton-960.webp 960w',
    sizes: '(max-width: 900px) 100vw, 31rem',
    width: 2560,
    height: 1920,
    alt: 'Сладкая вата в выездном премиальном формате',
  } as HeroPosterSlide,
  {
    id: 'truck',
    image: '/images/hero/hero-truck.jpg',
    fallbackImage: '/images/hero/hero-truck.jpg',
    imageWebpSrcSet:
      '/images/hero/hero-truck-480.webp 480w, /images/hero/hero-truck-720.webp 720w, /images/hero/hero-truck-960.webp 960w',
    sizes: '(max-width: 900px) 100vw, 31rem',
    width: 960,
    height: 1280,
    alt: 'Фудтрак как часть кейтеринг-сцены мероприятия',
  } as HeroPosterSlide,
];

test('autoplays through one premium poster frame at a time without manual controls', () => {
  vi.useFakeTimers();

  render(<HeroPosterCarousel slides={slides} />);

  expect(screen.getByRole('img', { name: slides[0].alt })).toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();

  act(() => {
    vi.advanceTimersByTime(3000);
  });

  expect(screen.getByRole('img', { name: slides[1].alt })).toBeInTheDocument();

  act(() => {
    vi.advanceTimersByTime(3000);
  });

  expect(screen.getByRole('img', { name: slides[2].alt })).toBeInTheDocument();

  vi.useRealTimers();
});

test('renders responsive hero media with explicit dimensions and priority only on the first slide', () => {
  render(<HeroPosterCarousel slides={slides} />);

  const images = screen.getAllByRole('img', { hidden: true });
  const firstImage = screen.getByRole('img', { name: slides[0].alt });
  const firstWebpSource = screen.getAllByTestId('hero-poster-source-webp')[0];

  expect(images).toHaveLength(slides.length);
  expect(firstWebpSource).toHaveAttribute('srcset', expect.stringContaining('/images/hero/hero-main-480.webp'));
  expect(firstWebpSource).toHaveAttribute('sizes', '(max-width: 900px) 100vw, 31rem');
  expect(firstImage).toHaveAttribute('width', '1258');
  expect(firstImage).toHaveAttribute('height', '2048');
  expect(firstImage).toHaveAttribute('loading', 'eager');
  expect(firstImage).toHaveAttribute('fetchpriority', 'high');
  expect(images[1]).toHaveAttribute('loading', 'lazy');
  expect(images[2]).toHaveAttribute('loading', 'lazy');
});
