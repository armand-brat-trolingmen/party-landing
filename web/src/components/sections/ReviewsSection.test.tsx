import { fireEvent, render, screen, within } from '@testing-library/react';
import { ReviewsSection } from './ReviewsSection';

test('renders moment feed as one large manual scene with optimized media and an Avito proof link', () => {
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

  const image = sectionQueries.getByRole('img', { name: 'Фудтрак Party Everyday на выездном событии' });
  expect(image).toHaveAttribute('loading', 'lazy');
  expect(image).toHaveAttribute('width', '1166');
  expect(image).toHaveAttribute('height', '737');
  expect(image).toHaveAttribute('sizes', '(max-width: 860px) calc(100vw - 3rem), 42rem');
  expect(section.querySelector('source[type="image/webp"]')).toHaveAttribute(
    'srcset',
    '/images/reviews/review-truck-1-960.webp 960w, /images/reviews/review-truck-1-1166.webp 1166w',
  );

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
