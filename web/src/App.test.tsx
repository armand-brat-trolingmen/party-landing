import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the one-page anchor shell', () => {
  render(<App />);

  expect(screen.getByRole('banner')).toBeInTheDocument();
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: 'Основная навигация' })).toBeInTheDocument();
  expect(screen.getByTestId('section-hero')).toBeInTheDocument();
  expect(screen.getByTestId('section-services')).toBeInTheDocument();
  expect(screen.getByTestId('section-about')).toBeInTheDocument();
  expect(screen.getByTestId('section-gallery')).toBeInTheDocument();
  expect(screen.getByTestId('section-reviews')).toBeInTheDocument();
  expect(screen.getByTestId('section-faq')).toBeInTheDocument();
  expect(screen.getByLabelText('Частые вопросы')).toBeInTheDocument();
  expect(screen.getByTestId('section-contact')).toBeInTheDocument();
});
