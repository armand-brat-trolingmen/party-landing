import { render, screen, within } from '@testing-library/react';
import { AboutSection } from './AboutSection';

test('renders about as an editorial ladder with three highlighted facts', () => {
  render(<AboutSection />);

  const section = screen.getByTestId('section-about');
  const sectionQueries = within(section);

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'О нас' })).toBeInTheDocument();
  expect(section).toHaveAttribute('data-section-tone', 'rose');
  expect(section.querySelector('[data-section-surface]')).toBeNull();
  expect(sectionQueries.getByTestId('about-layout')).toHaveAttribute('data-about-layout', 'editorial-ladder');
  expect(sectionQueries.getByTestId('about-manifest')).toBeInTheDocument();
  expect(sectionQueries.getByTestId('about-facts')).toBeInTheDocument();
  expect(sectionQueries.getAllByTestId('about-fact')).toHaveLength(3);
  expect(sectionQueries.getByText('7+')).toBeInTheDocument();
  expect(sectionQueries.getByText('300+')).toBeInTheDocument();
  expect(sectionQueries.getByText('1000+')).toBeInTheDocument();
});
