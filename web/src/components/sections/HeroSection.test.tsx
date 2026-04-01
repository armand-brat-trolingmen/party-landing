import { render, screen, within } from '@testing-library/react';
import { HeroSection } from './HeroSection';
import { siteContent } from '../../data/siteContent';

test('renders hero copy without a CTA and keeps a single frame scene with fan order', () => {
  render(<HeroSection />);

  expect(screen.getByText(siteContent.brand)).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1, name: siteContent.tagline })).toBeInTheDocument();
  expect(screen.getByText(siteContent.heroDescription)).toBeInTheDocument();

  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Наши форматы' })).not.toBeInTheDocument();

  const scene = screen.getByTestId('hero-scene');
  const frame = within(scene).getByTestId('hero-scene-frame');
  const sceneImages = within(frame).getAllByRole('img');
  const imageNames = sceneImages.map((image) => image.getAttribute('alt'));

  expect(sceneImages).toHaveLength(3);
  expect(imageNames).toEqual(['Сладкая вата', 'Фудтраки', 'Шоколадный фонтан']);
  expect(within(frame).queryByTestId('hero-scene-card')).not.toBeInTheDocument();

  const [cottonCandy, truck, chocolateFountain] = sceneImages;

  expect(within(frame).queryByText('Сладкая вата')).not.toBeInTheDocument();
  expect(within(frame).queryByText('Фудтраки')).not.toBeInTheDocument();
  expect(within(frame).queryByText('Шоколадный фонтан')).not.toBeInTheDocument();
  expect(truck).toHaveAttribute('src', expect.stringContaining('.svg'));
  expect(cottonCandy).toHaveAttribute('src', expect.stringContaining('.svg'));
  expect(chocolateFountain).toHaveAttribute('src', expect.stringContaining('.svg'));
});
