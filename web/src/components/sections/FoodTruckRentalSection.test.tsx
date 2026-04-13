import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { OrderModal } from '../cta/OrderModal';
import { OrderModalProvider } from '../cta/OrderModalContext';
import { FoodTruckRentalSection } from './FoodTruckRentalSection';

test('renders the food truck rental section with models, equipment, pricing, and CTA modal trigger', () => {
  render(
    <MemoryRouter>
      <OrderModalProvider>
        <FoodTruckRentalSection />
        <OrderModal />
      </OrderModalProvider>
    </MemoryRouter>,
  );

  const section = screen.getByTestId('section-food-truck-rental');
  const sectionQueries = within(section);

  expect(sectionQueries.getByRole('heading', { level: 2, name: 'Аренда фудтраков' })).toBeInTheDocument();
  expect(sectionQueries.getByText(/Фудтрак можно взять на краткосрочный или долгосрочный срок/)).toBeInTheDocument();
  expect(sectionQueries.getByText('MobiTruck SL-7')).toBeInTheDocument();
  expect(sectionQueries.getByText('MobiTruck SL-5')).toBeInTheDocument();
  expect(sectionQueries.getByText('SpaceBox 5')).toBeInTheDocument();
  expect(sectionQueries.getByText(/роликовые грили, фритюрницы и жарочные поверхности/)).toBeInTheDocument();
  expect(sectionQueries.getByText('Посуточная аренда от 15.000 ₽ в сутки')).toBeInTheDocument();
  expect(sectionQueries.getByText('Месячная аренда от 80.000 ₽ в месяц')).toBeInTheDocument();

  const images = sectionQueries.getAllByTestId('food-truck-rental-image');
  expect(images).toHaveLength(3);
  expect(images[0]).toHaveAttribute('src', '/images/food-truck-rental/rental-food-truck-1.webp');
  expect(images[2]).toHaveAttribute('src', '/images/food-truck-rental/rental-food-truck-3.webp');

  fireEvent.click(sectionQueries.getByRole('button', { name: 'Узнать условия' }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});
