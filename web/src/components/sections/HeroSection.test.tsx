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

  const truck = within(scene).getByRole('img', { name: 'Фудтраки' });
  const cottonCandy = within(scene).getByRole('img', { name: 'Сладкая вата' });
  const chocolateFountain = within(scene).getByRole('img', { name: 'Шоколадный фонтан' });

  expect(within(scene).getByText('Сладкая вата')).toBeInTheDocument();
  expect(within(scene).getByText('Шоколадный фонтан')).toBeInTheDocument();
  expect(truck).toHaveAttribute('src', expect.stringContaining('.svg'));
  expect(cottonCandy).toHaveAttribute('src', expect.stringContaining('.svg'));
  expect(chocolateFountain).toHaveAttribute('src', expect.stringContaining('.svg'));
});
