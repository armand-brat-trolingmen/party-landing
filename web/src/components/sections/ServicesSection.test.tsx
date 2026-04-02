import { render, screen, within } from '@testing-library/react';
import { ServicesSection } from './ServicesSection';
import { services } from '../../data/siteContent';

test('renders the services showcase with horizontal mobile scroll snap', () => {
  render(<ServicesSection />);

  expect(screen.getByRole('heading', { level: 2, name: 'Услуги' })).toBeInTheDocument();

  const strip = screen.getByTestId('services-strip');

  expect(strip).toHaveAttribute('data-scroll-snap', 'x');

  const stripQueries = within(strip);

  services.forEach((service) => {
    expect(stripQueries.getByText(service.name)).toBeInTheDocument();
    expect(stripQueries.getByText(service.description)).toBeInTheDocument();
  });

  expect(stripQueries.getByRole('img', { name: 'Шоколадный фонтан' })).toHaveAttribute(
    'src',
    expect.stringContaining('/images/hero/chocolate-fountain-card-static.svg'),
  );

  expect(stripQueries.getByRole('img', { name: 'Аниматоры' })).toHaveAttribute(
    'src',
    expect.stringContaining('/images/illustrations/animators-brothers.svg'),
  );
});
