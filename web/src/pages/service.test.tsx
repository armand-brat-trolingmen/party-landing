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

test('renders foam cannon packages in a three-column desktop-ready grid and keeps included items stacked', () => {
  render(
    <MemoryRouter initialEntries={['/services/foam-cannon']}>
      <Routes>
        <Route path="/services/:slug" element={<ServicePage />} />
      </Routes>
    </MemoryRouter>,
  );

  const intro = screen.getByTestId('section-offering-intro');
  const included = within(intro).getByTestId('offering-included');
  const packageGrid = intro.querySelector('[data-package-count="3"]');

  expect(packageGrid).toBeInTheDocument();
  expect(within(intro).getAllByText('Пакет Стандарт').length).toBeGreaterThan(0);
  expect(within(intro).getByText('220 литров пены · 30 минут')).toBeInTheDocument();
  expect(within(intro).getByText('Водные бластеры')).toBeInTheDocument();
  expect(included.querySelectorAll('li')).toHaveLength(4);
});

test('renders the redesigned service-only page structure with tariffs and delivery', () => {
  render(
    <MemoryRouter initialEntries={['/services/cotton-candy']}>
      <Routes>
        <Route path="/services/:slug" element={<ServicePage />} />
      </Routes>
    </MemoryRouter>,
  );

  const main = document.querySelector('main');
  const intro = screen.getByTestId('section-offering-intro');
  const otherServices = screen.getByTestId('section-offering-other-services');

  expect(main).not.toHaveAttribute('data-motion-path', 'story-trail');
  expect(within(intro).queryByText('Основная услуга')).not.toBeInTheDocument();
  expect(within(intro).queryByTestId('offering-hero-placeholder')).not.toBeInTheDocument();
  expect(within(intro).getByTestId('offering-hero-image')).toHaveAttribute('src', '/images/services-home/cotton-candy.webp');
  expect(within(intro).getByTestId('offering-duration')).toHaveTextContent('от 1 часа');
  expect(within(intro).getByTestId('offering-age')).toHaveTextContent('от 3 лет');
  expect(within(intro).getByTestId('offering-special-note')).toHaveTextContent('Цветная сахарная вата +1.000 ₽ к стоимости');
  expect(
    within(intro).getByTestId('offering-duration').compareDocumentPosition(
      within(intro).getByRole('button', { name: 'Заказать' }),
    ) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
  expect(within(intro).getByTestId('offering-included')).toHaveTextContent('Монтаж и демонтаж');
  expect(within(intro).getByRole('heading', { level: 2, name: 'Доставка' })).toBeInTheDocument();
  expect(within(intro).getByTestId('offering-delivery')).toHaveTextContent('Москва — 3.500 ₽');
  expect(within(intro).getByTestId('offering-delivery-box')).toHaveTextContent('Москва — 3.500 ₽');
  expect(within(intro).getByTestId('offering-delivery-box')).not.toHaveTextContent(/^Доставка/);
  expect(within(intro).getByTestId('offering-tariffs')).toHaveTextContent('2 часа');
  expect(within(intro).getByTestId('offering-tariffs')).toHaveTextContent('12.000 ₽');
  expect(within(intro).getByTestId('offering-tariffs')).not.toHaveTextContent('Цветная сахарная вата +1.000 ₽');
  expect(within(intro).getByTestId('offering-tariffs')).not.toHaveTextContent('Монтаж и демонтаж');
  expect(otherServices.querySelector('[data-service-slug="cotton-candy"]')).not.toBeInTheDocument();
  expect(otherServices.querySelector('.site-reveal')).not.toBeInTheDocument();
  expect(within(otherServices).getByTestId('section-services')).toHaveAttribute('id', 'services');
  expect(screen.getByTestId('section-extras')).toBeInTheDocument();
});

test('renders chocolate fountain package details and combo badge', () => {
  render(
    <MemoryRouter initialEntries={['/services/chocolate-fountain']}>
      <Routes>
        <Route path="/services/:slug" element={<ServicePage />} />
      </Routes>
    </MemoryRouter>,
  );

  const intro = screen.getByTestId('section-offering-intro');

  expect(within(intro).getByTestId('offering-combo-badge')).toHaveTextContent('Комбо −20%');
  expect(within(intro).getByTestId('offering-tariffs')).toHaveTextContent('Стандарт');
  expect(within(intro).getByTestId('offering-tariffs')).toHaveTextContent('11.500 ₽');
  expect(within(intro).getByTestId('offering-tariffs')).toHaveTextContent('VIP');
  expect(within(intro).getByTestId('offering-tariffs')).toHaveTextContent('14.500 ₽');
  expect(within(intro).getByText('Пакет Стандарт')).toBeInTheDocument();
  expect(within(intro).getByText('2.5 кг бельгийского шоколада Barry Callebaut')).toBeInTheDocument();
  expect(within(intro).getAllByText('Клубника +2.000 ₽ за 1 кг')).toHaveLength(2);
});

test('renders champagne pyramid details with adult age and free MKAD delivery', () => {
  render(
    <MemoryRouter initialEntries={['/services/champagne-pyramid']}>
      <Routes>
        <Route path="/services/:slug" element={<ServicePage />} />
      </Routes>
    </MemoryRouter>,
  );

  const intro = screen.getByTestId('section-offering-intro');

  expect(within(intro).getByTestId('offering-age')).toHaveTextContent('18+ 😂');
  expect(within(intro).getByTestId('offering-combo-badge')).toHaveTextContent('Комбо −20%');
  expect(within(intro).getByTestId('offering-delivery')).toHaveTextContent('Доставка в пределах МКАД — бесплатно');
  expect(within(intro).getByText('35 бокалов')).toBeInTheDocument();
  expect(within(intro).getByTestId('offering-included')).toHaveTextContent('Качественные бокалы');
  expect(within(intro).getByText('Эффект дыма')).toBeInTheDocument();
  expect(within(intro).getByText('Шампанское предоставляется заказчиком либо закупается барменом')).toBeInTheDocument();
  expect(within(intro).queryByText('В формат включено')).not.toBeInTheDocument();
});

test('renders caramel apples page with preliminary pricing note and new icon', () => {
  render(
    <MemoryRouter initialEntries={['/services/caramel-apples']}>
      <Routes>
        <Route path="/services/:slug" element={<ServicePage />} />
      </Routes>
    </MemoryRouter>,
  );

  const intro = screen.getByTestId('section-offering-intro');

  expect(screen.getByRole('heading', { level: 1, name: 'Карамельные яблоки' })).toBeInTheDocument();
  expect(within(intro).getByTestId('offering-hero-image')).toHaveAttribute('src', '/images/services-home/caramel-apples.png');
  expect(within(intro).getByTestId('offering-included')).toHaveTextContent('Подготовка станции');
  expect(within(intro).getByTestId('offering-tariffs')).toHaveTextContent('Формат под мероприятие');
  expect(within(intro).getByTestId('offering-tariffs')).toHaveTextContent('от 10.000 ₽');
  expect(within(intro).getByText('Тариф сейчас в предварительном формате — финальную смету соберём под вашу площадку и нужный объём.')).toBeInTheDocument();
});
