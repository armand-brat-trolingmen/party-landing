import { fireEvent, render, screen, within } from '@testing-library/react';
import { ReviewsSection } from './ReviewsSection';

test('renders moment feed as one large manual scene with arrows and an Avito proof link', () => {
  render(<ReviewsSection />);

  const section = screen.getByTestId('section-reviews');
  const sectionQueries = within(section);

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'Лента моментов' })).toBeInTheDocument();
  expect(sectionQueries.getByTestId('moment-feed-slider')).toHaveAttribute('data-slider-mode', 'manual');
  expect(sectionQueries.getByTestId('moment-feed-slider')).toHaveAttribute('data-slider-layout', 'single-scene');
  expect(sectionQueries.getByTestId('moment-feed-slider')).toHaveAttribute('data-slider-transition', 'soft-swap');
  expect(sectionQueries.getAllByTestId('moment-feed-slide')).toHaveLength(1);
  expect(sectionQueries.getByTestId('moment-feed-slide')).toHaveAttribute('data-slide-transition', 'soft-swap');
  expect(
    sectionQueries.queryByText('Листайте руками или кнопками — как на телефоне, так и на десктопе.'),
  ).not.toBeInTheDocument();
  expect(sectionQueries.queryByText('01 / 03')).not.toBeInTheDocument();
  expect(sectionQueries.getByRole('button', { name: 'Предыдущий момент' })).toBeDisabled();
  expect(sectionQueries.getByRole('button', { name: 'Следующий момент' })).toBeEnabled();
  expect(sectionQueries.getByText('Фудтрак, возле которого гости собираются сами собой.')).toBeInTheDocument();
  expect(sectionQueries.getByRole('link', { name: 'Отзывы можно прочитать тут!' })).toHaveAttribute(
    'href',
    'https://www.avito.ru/brands/i82014135/all',
  );

  fireEvent.click(sectionQueries.getByRole('button', { name: 'Следующий момент' }));
  expect(sectionQueries.getByTestId('moment-feed-slider')).toHaveAttribute('data-active-slide', '1');
  expect(sectionQueries.getByTestId('moment-feed-slide')).toHaveAttribute('data-slide-direction', 'next');
  expect(
    sectionQueries.getByText('Сладкая вата, которую сначала фотографируют, а потом просят повторить.'),
  ).toBeInTheDocument();
  expect(sectionQueries.getByRole('button', { name: 'Предыдущий момент' })).toBeEnabled();
});
