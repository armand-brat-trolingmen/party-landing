import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { FoodTrucksSection } from './FoodTrucksSection';

test('renders the catering food trucks section with gallery assets and story copy', () => {
  render(
    <MemoryRouter>
      <FoodTrucksSection />
    </MemoryRouter>,
  );

  const section = screen.getByTestId('section-food-trucks');
  const sectionQueries = within(section);

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'Кейтеринг на фудтраках' })).toBeInTheDocument();
  expect(
    sectionQueries.getByText(
      'Стритфуд от профессионалов — это настоящее гастрономическое шоу, где каждая деталь превращает уличную еду в яркий и незабываемый праздник вкуса.',
    ),
  ).toBeInTheDocument();
  expect(sectionQueries.getByRole('heading', { level: 3, name: 'Почему клиенты доверяют нам?' })).toBeInTheDocument();
  expect(sectionQueries.queryByText('Посуточная аренда от 15.000 ₽ в сутки')).not.toBeInTheDocument();
  expect(sectionQueries.queryByText('Месячная аренда от 80.000 ₽ в месяц')).not.toBeInTheDocument();

  const images = sectionQueries.getAllByTestId('food-truck-gallery-image');
  expect(images).toHaveLength(6);
  expect(images[0]).toHaveAttribute('src', '/images/food-trucks/food-truck-1.webp');
  expect(images[4]).toHaveAttribute('alt', 'Фудтрак для кейтеринга на выездном мероприятии, фото 6');
  expect(images[5]).toHaveAttribute('src', '/images/food-trucks/food-truck-4.webp');
  expect(images.every((image) => !image.getAttribute('alt')?.includes('?'))).toBe(true);
});
