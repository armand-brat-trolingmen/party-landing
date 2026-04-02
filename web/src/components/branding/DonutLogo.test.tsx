import { render, screen } from '@testing-library/react';
import { DonutLogo } from './DonutLogo';

test('renders a semi-real layered donut logo structure', () => {
  render(<DonutLogo size={44} />);

  const logo = screen.getByTestId('donut-logo');
  const icingStrands = logo.querySelectorAll('[data-layer="icing-strand"]');
  const sprinkles = logo.querySelectorAll('[data-layer="sprinkle"]');

  expect(logo).toHaveAttribute('viewBox', '0 0 64 64');
  expect(logo.querySelector('[data-layer="donut-body"]')).toBeInTheDocument();
  expect(logo.querySelector('[data-layer="donut-icing"]')).toBeInTheDocument();
  expect(logo.querySelector('[data-layer="donut-hole"]')).toBeInTheDocument();
  expect(icingStrands.length).toBeGreaterThanOrEqual(5);
  expect(sprinkles.length).toBeGreaterThanOrEqual(12);
});
