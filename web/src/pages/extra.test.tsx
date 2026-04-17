import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import ExtraPage from './extra';

test('extra pages keep service schema but skip duplicated faq schema', () => {
  render(
    <MemoryRouter initialEntries={['/extras/branded-cart']}>
      <Routes>
        <Route path="/extras/:slug" element={<ExtraPage />} />
      </Routes>
    </MemoryRouter>,
  );

  const structuredData = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    .map((node) => node.textContent ?? '')
    .join(' ');

  expect(structuredData).toContain('BreadcrumbList');
  expect(structuredData).not.toContain('FAQPage');
});

test('renders branded cart extra page with prices block and moments gallery', () => {
  render(
    <MemoryRouter initialEntries={['/extras/branded-cart']}>
      <Routes>
        <Route path="/extras/:slug" element={<ExtraPage />} />
      </Routes>
    </MemoryRouter>,
  );

  const hero = screen.getByTestId('offering-extra-hero');
  const included = screen.getByTestId('offering-extra-included');
  const gallery = screen.getByTestId('offering-gallery');

  expect(screen.getByRole('heading', { level: 1, name: 'Брендирование тележки для кейтеринга' })).toBeInTheDocument();
  expect(hero).not.toHaveTextContent('Дополнительная услуга');
  expect(screen.queryByTestId('offering-extra-price')).not.toBeInTheDocument();
  expect(within(included).getByRole('heading', { level: 2, name: 'Цены' })).toBeInTheDocument();
  expect(included).toHaveTextContent('Наклейка');
  expect(included).toHaveTextContent('3.000 ₽');
  expect(included).toHaveTextContent('Изготовление крыши с вашим дизайном');
  expect(included).toHaveTextContent('4.500 ₽');
  expect(included).toHaveTextContent('Брендирование стаканчиков');
  expect(included).toHaveTextContent('от 15 ₽ за штуку');
  expect(within(gallery).getAllByTestId('offering-gallery-slide')).toHaveLength(6);
  expect(within(gallery).getAllByTestId('offering-gallery-image')).toHaveLength(6);
  expect(screen.getByTestId('offering-extra-visual-source-webp')).toHaveAttribute('srcset', '/images/extras/branding.webp');
  expect(screen.getByTestId('offering-extra-visual-image')).toHaveAttribute('src', '/images/extras/branding-ui.png');
  expect(screen.queryByTestId('offering-extra-visual-blank')).not.toBeInTheDocument();
  expect(screen.getByTestId('section-offering-cta')).toHaveAttribute('data-cta-variant', 'home');
});

test('renders equipment rental extra page with updated price list', () => {
  render(
    <MemoryRouter initialEntries={['/extras/equipment-rental']}>
      <Routes>
        <Route path="/extras/:slug" element={<ExtraPage />} />
      </Routes>
    </MemoryRouter>,
  );

  const included = screen.getByTestId('offering-extra-included');

  expect(screen.getByRole('heading', { level: 1, name: 'Аренда оборудования' })).toBeInTheDocument();
  expect(screen.queryByTestId('offering-extra-price')).not.toBeInTheDocument();
  expect(within(included).getByRole('heading', { level: 2, name: 'Цены' })).toBeInTheDocument();
  expect(included).toHaveTextContent('Аренда Шоколадного фонтана');
  expect(included).toHaveTextContent('от 3.500 ₽');
  expect(included).toHaveTextContent('Аренда Аппарата сахарной ваты ТТМ Карнавал');
  expect(included).toHaveTextContent('от 5.500 ₽');
  expect(included).toHaveTextContent('Аренда Аппарата для изготовления попкорна');
  expect(included).toHaveTextContent('от 4.000 ₽');
  expect(included).toHaveTextContent('Аренда Звукового оборудования с микрофонами');
  expect(included).toHaveTextContent('от 8.500 ₽');
  expect(screen.getByTestId('offering-extra-visual-source-webp')).toHaveAttribute('srcset', '/images/extras/equipment-ui.webp');
  expect(screen.getByTestId('offering-extra-visual-image')).toHaveAttribute('src', '/images/extras/equipment-ui.png');
  expect(screen.queryByTestId('offering-gallery')).not.toBeInTheDocument();
  expect(screen.queryByTestId('offering-extra-visual-blank')).not.toBeInTheDocument();
});

test('renders cart rental extra page with its dedicated visual', () => {
  render(
    <MemoryRouter initialEntries={['/extras/cart-rental']}>
      <Routes>
        <Route path="/extras/:slug" element={<ExtraPage />} />
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { level: 1, name: 'Аренда тележек' })).toBeInTheDocument();
  expect(screen.queryByTestId('offering-extra-price')).not.toBeInTheDocument();
  expect(within(screen.getByTestId('offering-extra-included')).getByRole('heading', { level: 2, name: 'Цены' })).toBeInTheDocument();
  expect(screen.getByTestId('offering-extra-included')).toHaveTextContent('Аренда тележки без оборудования и сотрудника');
  expect(screen.getByTestId('offering-extra-included')).toHaveTextContent('5.500 ₽');
  expect(screen.getByTestId('offering-extra-visual-source-webp')).toHaveAttribute('srcset', '/images/extras/cart-rental-ui.webp');
  expect(screen.getByTestId('offering-extra-visual-image')).toHaveAttribute('src', '/images/extras/cart-rental-ui.png');
  expect(screen.queryByTestId('offering-gallery')).not.toBeInTheDocument();
  expect(screen.queryByTestId('offering-extra-visual-blank')).not.toBeInTheDocument();
});
