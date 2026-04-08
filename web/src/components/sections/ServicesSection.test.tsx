import { fireEvent, render, screen, within } from '@testing-library/react';
import { services } from '../../data/catalogContent';
import { ServicesSection } from './ServicesSection';

test('renders the services catalog as a revealable menu showcase', () => {
  render(<ServicesSection />);

  const section = screen.getByTestId('section-services');
  expect(within(section).getByRole('heading', { level: 2, name: 'Услуги' })).toBeInTheDocument();

  const catalog = screen.getByTestId('services-catalog');
  const cards = within(catalog).getAllByTestId('service-card');

  expect(cards).toHaveLength(8);
  expect(within(catalog).getByRole('heading', { level: 3, name: services[0].name })).toBeInTheDocument();
  expect(within(catalog).getByText(services[0].shortDescription)).toBeInTheDocument();
  expect(within(catalog).queryByRole('heading', { level: 3, name: services[10].name })).not.toBeInTheDocument();

  const revealButton = screen.getByTestId('services-reveal-button');
  expect(revealButton).toHaveTextContent('Показать ещё');

  fireEvent.click(revealButton);
  expect(within(catalog).getAllByTestId('service-card')).toHaveLength(services.length);
  expect(within(catalog).getByRole('heading', { level: 3, name: services[10].name })).toBeInTheDocument();
  expect(revealButton).toHaveTextContent('Скрыть часть меню');
});

test('routes each card to its dedicated internal service page', () => {
  render(<ServicesSection allowReveal={false} />);

  const catalog = screen.getByTestId('services-catalog');
  const firstLink = within(catalog).getByRole('link', { name: `Открыть страницу услуги ${services[0].name}` });

  expect(firstLink).toHaveAttribute('href', `/services/${services[0].slug}`);
});
