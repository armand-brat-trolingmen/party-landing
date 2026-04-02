import { render, screen, within } from '@testing-library/react';
import { ReviewsSection } from './ReviewsSection';

test('renders review stories as four editorial-style cards with badges, titles, summaries, and meta lines', () => {
  render(<ReviewsSection />);

  const section = screen.getByTestId('section-reviews');
  const sectionQueries = within(section);

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'Отзывы' })).toBeInTheDocument();
  expect(sectionQueries.getByText('Четыре живых сюжета о том, как Party выглядит в кадре и ощущается на площадке.')).toBeInTheDocument();

  const images = sectionQueries.getAllByRole('img');
  expect(images).toHaveLength(4);
  expect(sectionQueries.getAllByTestId('review-story-card')).toHaveLength(4);

  expect(sectionQueries.getByText('Аниматоры')).toBeInTheDocument();
  expect(sectionQueries.getByText('Когда праздник сразу оживает')).toBeInTheDocument();
  expect(sectionQueries.getByText('Дед Мороз и Снегурочка появляются вовремя, ловят настроение зала и быстро делают праздник общим.')).toBeInTheDocument();
  expect(sectionQueries.getByText('Зимний праздник для гостей и детей')).toBeInTheDocument();

  expect(sectionQueries.getByText('Фудтрак')).toBeInTheDocument();
  expect(sectionQueries.getByText('Очередь, которая только радует')).toBeInTheDocument();

  expect(sectionQueries.getByText('Сладкая вата')).toBeInTheDocument();
  expect(sectionQueries.getByText('Немного магии в каждом кадре')).toBeInTheDocument();

  expect(sectionQueries.getByText('Шоколадный фонтан')).toBeInTheDocument();
  expect(sectionQueries.getByText('Тот самый десертный вау-эффект')).toBeInTheDocument();
});
