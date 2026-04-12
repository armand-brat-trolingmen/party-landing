import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { OrderModal } from '../cta/OrderModal';
import { OrderModalProvider } from '../cta/OrderModalContext';
import { FoodTrucksSection } from './FoodTrucksSection';

test('renders the food trucks section with gallery assets, pricing, and CTA modal trigger', () => {
  render(
    <MemoryRouter>
      <OrderModalProvider>
        <FoodTrucksSection />
        <OrderModal />
      </OrderModalProvider>
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
  expect(sectionQueries.getByText('Посуточная аренда от 15.000 ₽ в сутки')).toBeInTheDocument();
  expect(sectionQueries.getByText('Месячная аренда от 80.000 ₽ в месяц')).toBeInTheDocument();

  const images = sectionQueries.getAllByTestId('food-truck-gallery-image');
  expect(images).toHaveLength(6);
  expect(images[0]).toHaveAttribute('src', '/images/food-trucks/food-truck-1.webp');
  expect(images[5]).toHaveAttribute('src', '/images/food-trucks/food-truck-4.webp');

  fireEvent.click(sectionQueries.getByRole('button', { name: 'Узнать условия' }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});
