import { render, screen, within } from '@testing-library/react';
import { AboutSection } from './AboutSection';

test('renders about section as one large atmosphere stage with three accent notes', () => {
  render(<AboutSection />);

  const section = screen.getByTestId('section-about');
  const sectionQueries = within(section);

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'О нас' })).toBeInTheDocument();
  expect(sectionQueries.getByTestId('about-atmosphere-stage')).toHaveAttribute('data-about-layout', 'atelier');
  expect(sectionQueries.getByTestId('about-brand-manifest')).toBeInTheDocument();
  expect(sectionQueries.getAllByTestId('about-accent')).toHaveLength(3);
  expect(sectionQueries.getByText('Выстраиваем процесс так, чтобы площадка работала спокойно')).toBeInTheDocument();
});
