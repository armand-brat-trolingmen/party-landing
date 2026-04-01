import { render, screen, within } from '@testing-library/react';
import { HeroSection } from './HeroSection';
import { siteContent } from '../../data/siteContent';

test('renders the approved Russian hero copy without a CTA and shows the fan-style hero scene order', () => {
  render(<HeroSection />);

  expect(screen.getByText(siteContent.brand)).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1, name: siteContent.tagline })).toBeInTheDocument();
  expect(screen.getByText(siteContent.heroDescription)).toBeInTheDocument();

  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Наши форматы' })).not.toBeInTheDocument();

  const scene = screen.getByTestId('hero-scene');
  const frame = within(scene).getByTestId('hero-scene-frame');
  const cards = within(frame).getAllByTestId('hero-scene-card');

  expect(cards).toHaveLength(3);
  expect(within(cards[0]).getByRole('img', { name: 'Сладкая вата' })).toBeInTheDocument();
  expect(within(cards[1]).getByRole('img', { name: 'Фудтраки' })).toBeInTheDocument();
  expect(within(cards[2]).getByRole('img', { name: 'Шоколадный фонтан' })).toBeInTheDocument();

  const truck = within(cards[1]).getByRole('img', { name: 'Фудтраки' });
  const cottonCandy = within(cards[0]).getByRole('img', { name: 'Сладкая вата' });
  const chocolateFountain = within(cards[2]).getByRole('img', { name: 'Шоколадный фонтан' });

  expect(within(frame).getByText('Сладкая вата')).toBeInTheDocument();
  expect(within(frame).getByText('Фудтраки')).toBeInTheDocument();
  expect(within(frame).getByText('Шоколадный фонтан')).toBeInTheDocument();
  expect(truck).toHaveAttribute('src', expect.stringContaining('.svg'));
  expect(cottonCandy).toHaveAttribute('src', expect.stringContaining('.svg'));
  expect(chocolateFountain).toHaveAttribute('src', expect.stringContaining('.svg'));
});
