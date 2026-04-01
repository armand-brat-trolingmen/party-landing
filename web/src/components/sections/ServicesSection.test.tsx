import { render, screen, within } from '@testing-library/react';
import { ServicesSection } from './ServicesSection';

test('renders the services showcase with horizontal mobile scroll snap', () => {
  render(<ServicesSection />);

  expect(screen.getByRole('heading', { level: 2, name: 'Услуги' })).toBeInTheDocument();

  const strip = screen.getByTestId('services-strip');

  expect(strip).toHaveAttribute('data-scroll-snap', 'x');

  const stripQueries = within(strip);

  expect(stripQueries.getByText('Фудтраки')).toBeInTheDocument();
  expect(stripQueries.getByText('Сладкая вата')).toBeInTheDocument();
  expect(stripQueries.getByText('Шоколадный фонтан')).toBeInTheDocument();
  expect(stripQueries.getByText('Аниматоры')).toBeInTheDocument();
});
