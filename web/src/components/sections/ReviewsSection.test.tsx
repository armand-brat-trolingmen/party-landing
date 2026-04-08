import { fireEvent, render, screen, within } from '@testing-library/react';
import { ReviewsSection } from './ReviewsSection';

test('renders moments as a separate manual gallery before testimonials', () => {
  render(<ReviewsSection />);

  const section = screen.getByTestId('section-moments');
  const sectionQueries = within(section);
  const surface = section.querySelector('[data-section-surface="canvas"][data-section-tone="milk"]');

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'Красивые кадры с реальных событий' })).toBeInTheDocument();
  expect(surface).not.toBeNull();
  expect(sectionQueries.getByTestId('moment-feed-slider')).toHaveAttribute('data-slider-mode', 'manual');
  expect(sectionQueries.getAllByTestId('moment-feed-slide')).toHaveLength(1);
  expect(sectionQueries.queryByRole('link', { name: /Avito/i })).not.toBeInTheDocument();
  expect(sectionQueries.getByRole('button', { name: 'Предыдущий момент' })).toBeDisabled();
  expect(sectionQueries.getByRole('button', { name: 'Следующий момент' })).toBeEnabled();

  fireEvent.click(sectionQueries.getByRole('button', { name: 'Следующий момент' }));
  expect(sectionQueries.getByTestId('moment-feed-slider')).toHaveAttribute('data-active-slide', '1');
});
