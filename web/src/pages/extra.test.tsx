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

  const hero = screen.getByTestId('offering-extra-hero');

  expect(screen.getByRole('heading', { level: 1, name: 'Брендирование тележки для кейтеринга' })).toBeInTheDocument();
  expect(hero).toHaveTextContent('от 7.000 ₽');
  expect(screen.getByTestId('offering-extra-included')).toHaveTextContent('Адаптация оформления тележки');
  expect(screen.getByTestId('offering-extra-visual-source-webp')).toHaveAttribute('srcset', '/images/extras/branding.webp');
  expect(screen.getByTestId('offering-extra-visual-image')).toHaveAttribute('src', '/images/extras/branding-ui.png');
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

  const hero = screen.getByTestId('offering-extra-hero');

  expect(screen.getByRole('heading', { level: 1, name: 'Аренда оборудования' })).toBeInTheDocument();
  expect(hero).toHaveTextContent('от 6.000 ₽');
  expect(screen.getByTestId('offering-extra-visual-source-webp')).toHaveAttribute('srcset', '/images/extras/equipment-ui.webp');
  expect(screen.getByTestId('offering-extra-visual-image')).toHaveAttribute('src', '/images/extras/equipment-ui.png');
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
  expect(screen.getByTestId('offering-extra-included')).toHaveTextContent('Подготовка гастрозоны к работе');
  expect(screen.getByTestId('offering-extra-visual-source-webp')).toHaveAttribute('srcset', '/images/extras/plov-ui.webp');
  expect(screen.getByTestId('offering-extra-visual-image')).toHaveAttribute('src', '/images/extras/plov-ui.png');
  expect(screen.queryByTestId('offering-extra-visual-blank')).not.toBeInTheDocument();
});
