import { render, screen, within } from '@testing-library/react';
import { TestimonialsSection } from './TestimonialsSection';

test('renders the testimonials section as an Avito proof box with six review screenshots', () => {
  render(<TestimonialsSection />);

  const section = screen.getByTestId('section-testimonials');
  const sectionQueries = within(section);

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'Отзывы клиентов' })).toBeInTheDocument();
  expect(section).not.toHaveAttribute('data-section-tone');
  expect(sectionQueries.queryByTestId('testimonials-grid')).not.toBeInTheDocument();
  expect(sectionQueries.queryByText('Отзыв с Avito')).not.toBeInTheDocument();
  expect(sectionQueries.queryByText(/Спасибо за аккуратную организацию/i)).not.toBeInTheDocument();

  expect(sectionQueries.getByTestId('testimonials-proof')).toBeInTheDocument();
  expect(sectionQueries.getByRole('link', { name: 'Перейти на Avito' })).toHaveAttribute(
    'href',
    'https://www.avito.ru/brands/i82014135/all',
  );

  const proofWall = sectionQueries.getByTestId('testimonials-proof-wall');
  const screenshotCards = within(proofWall).getAllByTestId('testimonial-screenshot-card');
  const screenshotImages = within(proofWall).getAllByRole('img');

  expect(screenshotCards).toHaveLength(6);
  expect(screenshotImages).toHaveLength(6);
  expect(screenshotImages[0]).toHaveAttribute('src', '/images/reviews-proof/review-1.png');
  expect(screenshotImages[5]).toHaveAttribute('src', '/images/reviews-proof/review-6.png');
});
