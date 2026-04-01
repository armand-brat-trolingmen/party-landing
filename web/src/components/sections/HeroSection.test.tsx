import { render, screen, within } from '@testing-library/react';
import { HeroSection } from './HeroSection';
import { siteContent } from '../../data/siteContent';

test('renders the approved Russian hero copy without a CTA and shows the food truck scene', () => {
  render(<HeroSection />);

  expect(screen.getByText(siteContent.brand)).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1, name: siteContent.tagline })).toBeInTheDocument();
  expect(screen.getByText(siteContent.heroDescription)).toBeInTheDocument();

  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Наши форматы' })).not.toBeInTheDocument();

  const scene = screen.getByTestId('hero-scene');

  expect(within(scene).getByLabelText('Фудтраки')).toBeInTheDocument();
  expect(within(scene).getByText('Сладкая вата')).toBeInTheDocument();
  expect(within(scene).getByText('Шоколадный фонтан')).toBeInTheDocument();
  expect(scene.querySelectorAll('img')).toHaveLength(0);
});
