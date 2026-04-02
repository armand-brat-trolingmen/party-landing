import { render, screen, within } from '@testing-library/react';
import { reviewPhotos } from '../../data/siteContent';
import { ReviewsSection } from './ReviewsSection';

test('renders a visual reviews section using all available real people photos', () => {
  render(<ReviewsSection />);

  const section = screen.getByTestId('section-reviews');
  const sectionQueries = within(section);

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'Отзывы' })).toBeInTheDocument();

  const images = sectionQueries.getAllByRole('img');

  expect(images).toHaveLength(reviewPhotos.length);
  expect(images).toHaveLength(3);

  reviewPhotos.forEach((photo) => {
    expect(sectionQueries.getByRole('img', { name: photo.alt })).toHaveAttribute(
      'src',
      expect.stringContaining(photo.image),
    );
  });
});
