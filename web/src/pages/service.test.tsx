import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import ServicePage from './service';

test('renders service page content from route params', () => {
  render(
    <MemoryRouter initialEntries={['/services/cotton-candy']}>
      <Routes>
        <Route path="/services/:slug" element={<ServicePage />} />
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { level: 1, name: 'Сахарная вата' })).toBeInTheDocument();
  expect(within(screen.getByTestId('section-offering-intro')).getByRole('button', { name: 'Заказать' })).toBeInTheDocument();
  expect(screen.getByTestId('section-offering-cta')).toHaveAttribute('data-cta-variant', 'home');
  expect(screen.getByTestId('cta-surface')).toHaveAttribute('data-cta-surface', 'full-bleed');
});
