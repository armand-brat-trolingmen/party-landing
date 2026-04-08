import { render, screen } from '@testing-library/react';
import { DonutLogo } from './DonutLogo';

test('renders the uploaded brand logo asset as the site mark', () => {
  render(<DonutLogo size={44} />);

  const logo = screen.getByTestId('donut-logo');

  expect(logo.tagName).toBe('IMG');
  expect(logo).toHaveAttribute('src', '/brand-logo.png');
  expect(logo).toHaveAttribute('width', '44');
  expect(logo).toHaveAttribute('height', '44');
  expect(logo).toHaveAttribute('alt', '');
});
