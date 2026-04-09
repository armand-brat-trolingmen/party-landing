import { render, screen, within } from '@testing-library/react';
import { AboutSection } from './AboutSection';

test('renders about as a compact premium manifest with a horizontal proof strip', () => {
  render(<AboutSection />);

  const section = screen.getByTestId('section-about');
  const sectionQueries = within(section);

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'О нас' })).toBeInTheDocument();
  expect(section).not.toHaveAttribute('data-section-tone');
  expect(sectionQueries.getByTestId('about-layout')).toHaveAttribute('data-about-layout', 'manifest-band');
  expect(sectionQueries.getByTestId('about-manifest')).toBeInTheDocument();
  expect(sectionQueries.getByTestId('about-proof-strip')).toBeInTheDocument();
  expect(sectionQueries.getAllByTestId('about-fact')).toHaveLength(3);
  expect(sectionQueries.getByText('7+')).toBeInTheDocument();
  expect(sectionQueries.getByText('300+')).toBeInTheDocument();
  expect(sectionQueries.getByText('1000+')).toBeInTheDocument();
});
