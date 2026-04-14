import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import ExtraPage from './extra';

test('renders extra-service page content from route params', () => {
  render(
    <MemoryRouter initialEntries={['/extras/branded-cart']}>
      <Routes>
        <Route path="/extras/:slug" element={<ExtraPage />} />
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { level: 1, name: 'Брендирование тележки для кейтеринга' })).toBeInTheDocument();
  expect(screen.getByText('от 7.000 ₽')).toBeInTheDocument();
  expect(screen.getByTestId('offering-extra-visual-image')).toHaveAttribute('src', '/images/extras/branding.webp');
  expect(screen.queryByTestId('offering-extra-visual-blank')).not.toBeInTheDocument();
  expect(screen.getByTestId('section-offering-cta')).toHaveAttribute('data-cta-variant', 'home');
});

test('renders equipment rental extra page with its equipment image', () => {
  render(
    <MemoryRouter initialEntries={['/extras/equipment-rental']}>
      <Routes>
        <Route path="/extras/:slug" element={<ExtraPage />} />
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { level: 1, name: 'Аренда оборудования' })).toBeInTheDocument();
  expect(screen.getByText('от 6.000 ₽')).toBeInTheDocument();
  expect(screen.getByTestId('offering-extra-visual-image')).toHaveAttribute('src', '/images/extras/equipment.png');
  expect(screen.queryByTestId('offering-extra-visual-blank')).not.toBeInTheDocument();
});

test('renders plov station extra page with its visual', () => {
  render(
    <MemoryRouter initialEntries={['/extras/plov-station']}>
      <Routes>
        <Route path="/extras/:slug" element={<ExtraPage />} />
      </Routes>
    </MemoryRouter>,
  );

  const intro = screen.getByTestId('section-offering-intro');

  expect(screen.getByRole('heading', { level: 1, name: 'Станция плова' })).toBeInTheDocument();
  expect(intro).toHaveTextContent('от 10.000 ₽');
  expect(screen.getByTestId('offering-extra-visual-image')).toHaveAttribute('src', '/images/extras/plov.png');
  expect(screen.queryByTestId('offering-extra-visual-blank')).not.toBeInTheDocument();
});
