import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import ExtraPage from './extra';

test('renders extra-service page content from route params', () => {
  render(
    <MemoryRouter initialEntries={['/extras/branded-serving']}>
      <Routes>
        <Route path="/extras/:slug" element={<ExtraPage />} />
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { level: 1, name: 'Брендированная подача' })).toBeInTheDocument();
  expect(screen.getByTestId('section-offering-cta')).toBeInTheDocument();
});
