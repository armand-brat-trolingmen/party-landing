import { render, screen, within } from '@testing-library/react';
import { ReviewsSection } from './ReviewsSection';

test('renders moments as an editorial photo strip without manual carousel controls', () => {
  render(<ReviewsSection />);

  const section = screen.getByTestId('section-moments');
  const sectionQueries = within(section);

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'Красивые кадры с реальных событий' })).toBeInTheDocument();
  expect(section).not.toHaveAttribute('data-section-tone');
  expect(sectionQueries.getByTestId('moment-feed-gallery')).toHaveAttribute('data-gallery-style', 'editorial-mosaic');
  expect(sectionQueries.getAllByTestId('moment-feed-card')).toHaveLength(3);
  expect(sectionQueries.queryByRole('link', { name: /Avito/i })).not.toBeInTheDocument();
  expect(sectionQueries.queryByRole('button', { name: 'Предыдущий момент' })).not.toBeInTheDocument();
  expect(sectionQueries.queryByRole('button', { name: 'Следующий момент' })).not.toBeInTheDocument();
});
