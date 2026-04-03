import { render, screen, within } from '@testing-library/react';
import { HeroSection } from './HeroSection';
import { siteContent } from '../../data/siteContent';

test('renders hero as a poster screen with Party Time above the accent line and no CTA', () => {
  render(<HeroSection />);

  const hero = screen.getByTestId('section-hero');
  expect(hero).toHaveAttribute('data-hero-style', 'poster');
  expect(within(hero).getByText(siteContent.brand)).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1, name: siteContent.tagline })).toBeInTheDocument();
  expect(screen.getByText(siteContent.heroDescription)).toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();

  const scene = screen.getByTestId('hero-scene');
  const frame = within(scene).getByTestId('hero-scene-frame');
  const sceneImages = within(frame).getAllByRole('img');
  const imageNames = sceneImages.map((image) => image.getAttribute('alt'));

  expect(sceneImages).toHaveLength(3);
  expect(imageNames).toEqual(['Сладкая вата', 'Фудтраки', 'Шоколадный фонтан']);
});
