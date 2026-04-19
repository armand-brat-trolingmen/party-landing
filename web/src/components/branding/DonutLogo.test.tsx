import { render, screen } from '@testing-library/react';
import { DonutLogo } from './DonutLogo';

test('renders the uploaded brand logo asset as the site mark', () => {
  render(<DonutLogo size={44} />);

  const logo = screen.getByTestId('donut-logo');
  const source = logo.closest('picture')?.querySelector('source');

  expect(logo.tagName).toBe('IMG');
  expect(source).toHaveAttribute('type', 'image/webp');
  expect(source).toHaveAttribute('srcset', '/brand-logo-ui.webp 384w, /brand-logo.webp 1024w');
  expect(source).toHaveAttribute('sizes', '44px');
  expect(logo).toHaveAttribute('src', '/brand-logo-ui.png');
  expect(logo).toHaveAttribute('srcset', '/brand-logo-ui.png 384w, /brand-logo.png 1024w');
  expect(logo).toHaveAttribute('sizes', '44px');
  expect(logo).toHaveAttribute('width', '44');
  expect(logo).toHaveAttribute('height', '44');
  expect(logo).toHaveAttribute('alt', '');
});
