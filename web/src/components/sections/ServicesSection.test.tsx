import { render, screen, within } from '@testing-library/react';
import { ServicesSection } from './ServicesSection';
import { services } from '../../data/siteContent';

test('renders the services showcase with horizontal mobile scroll snap and micro-scene motion hooks', () => {
  render(<ServicesSection />);

  const section = screen.getByTestId('section-services');
  expect(within(section).getByRole('heading', { level: 2 })).toBeInTheDocument();

  const strip = screen.getByTestId('services-strip');
  expect(strip).toHaveAttribute('data-scroll-snap', 'x');

  const stripQueries = within(strip);

  services.forEach((service) => {
    expect(stripQueries.getByText(service.name)).toBeInTheDocument();
    expect(stripQueries.getByText(service.description)).toBeInTheDocument();
  });

  const cards = strip.querySelectorAll('[data-motion-service="micro-scene"]');
  expect(cards).toHaveLength(4);

  const motionLayers = strip.querySelectorAll('[data-motion-image="true"]');
  expect(motionLayers).toHaveLength(4);

  expect(strip.querySelector('[data-service-id="food-trucks"]')).toBeTruthy();
  expect(strip.querySelector('[data-service-scene="cotton-candy"]')).toBeTruthy();
  expect(strip.querySelector('[data-service-id="chocolate-fountain"]')).toBeTruthy();
  expect(strip.querySelector('[data-service-id="animators"]')).toBeTruthy();

  expect(stripQueries.getAllByRole('img')).toHaveLength(4);
});
