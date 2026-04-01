import { render, screen } from '@testing-library/react';
import { HeroSection } from './HeroSection';
import { siteContent } from '../../data/siteContent';

test('renders the approved Russian hero copy without a CTA and shows the food truck scene', () => {
  render(<HeroSection />);

  expect(screen.getByRole('heading', { level: 1, name: siteContent.brand })).toBeInTheDocument();
  expect(screen.getByText(siteContent.tagline)).toBeInTheDocument();
  expect(screen.getByText(siteContent.heroDescription)).toBeInTheDocument();

  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Наши форматы' })).not.toBeInTheDocument();

  expect(screen.getByRole('img', { name: 'Фудтраки' })).toBeInTheDocument();
  expect(screen.getByText('Сладкая вата')).toBeInTheDocument();
  expect(screen.getByText('Шоколадный фонтан')).toBeInTheDocument();
});
