import { render, screen, within } from '@testing-library/react';
import { AboutSection } from './AboutSection';

test('renders a compact manifesto-driven about section with three compact facts', () => {
  render(<AboutSection />);

  const section = screen.getByTestId('section-about');
  const sectionQueries = within(section);
  const surface = section.querySelector('[data-section-surface="canvas"][data-section-tone="rose"]');

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'О нас' })).toBeInTheDocument();
  expect(surface).not.toBeNull();
  expect(sectionQueries.getByTestId('about-layout')).toHaveAttribute('data-about-layout', 'manifest-strip');
  expect(sectionQueries.getByTestId('about-manifest')).toBeInTheDocument();
  expect(sectionQueries.getByTestId('about-facts')).toBeInTheDocument();
  expect(sectionQueries.getAllByTestId('about-fact')).toHaveLength(3);
  expect(sectionQueries.getByText('7+')).toBeInTheDocument();
  expect(sectionQueries.getByText('300+')).toBeInTheDocument();
  expect(sectionQueries.getByText('1000+')).toBeInTheDocument();
  expect(sectionQueries.queryByTestId('about-atmosphere-stage')).not.toBeInTheDocument();
});
