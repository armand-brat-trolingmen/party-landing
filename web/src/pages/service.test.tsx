import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { siteConfig } from '../content';
import ServicePage from './service';

test('service pages keep service schema but skip duplicated faq schema', () => {
  render(
    <MemoryRouter initialEntries={['/services/chocolate-fountain']}>
      <Routes>
        <Route path="/services/:slug" element={<ServicePage />} />
      </Routes>
    </MemoryRouter>,
  );

  const structuredData = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    .map((node) => node.textContent ?? '')
    .join(' ');

  expect(structuredData).toContain('BreadcrumbList');
  expect(structuredData).not.toContain('FAQPage');
});

test('renders service page content from route params', () => {
  render(
    <MemoryRouter initialEntries={['/services/cotton-candy']}>
      <Routes>
        <Route path="/services/:slug" element={<ServicePage />} />
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { level: 1, name: 'Сахарная вата' })).toBeInTheDocument();
  expect(within(screen.getByTestId('offering-hero')).getByRole('button', { name: 'Заказать' })).toBeInTheDocument();
  expect(screen.getAllByTestId('section-offering-cta')).toHaveLength(1);
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
  expect(included.querySelectorAll('li')).toHaveLength(3);
});

test('renders the redesigned service-only page structure with tariffs delivery and in-flow cta', () => {
  const cottonCandy = siteConfig.services.find((service) => service.slug === 'cotton-candy');

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
  const hero = within(intro).getByTestId('offering-hero');
  const gallery = within(intro).getByTestId('offering-gallery');
  const galleryTrack = within(gallery).getByTestId('offering-gallery-track');
  const included = within(intro).getByTestId('offering-included');
  const cta = screen.getByTestId('section-offering-cta');
  const orderButton = within(hero).getByRole('button', { name: 'Заказать' });
  const price = within(intro).getByTestId('offering-price');
  const note = within(intro).getByTestId('offering-special-note');
  const duration = within(intro).getByTestId('offering-duration');

  expect(main).not.toHaveAttribute('data-motion-path', 'story-trail');
  expect(within(intro).queryByText('Основная услуга')).not.toBeInTheDocument();
  expect(within(intro).queryByTestId('offering-hero-placeholder')).not.toBeInTheDocument();
  expect(within(intro).getByTestId('offering-hero-image')).toHaveAttribute(
    'src',
    cottonCandy?.homeCardImage?.fallbackSrc ?? '',
  );
  expect(price).toHaveTextContent('Цена');
  expect(price).toHaveTextContent('от 12.000 ₽');
  expect(duration).toHaveTextContent('от 2 часов');
  expect(within(intro).queryByTestId('offering-age')).not.toBeInTheDocument();
  expect(within(intro).queryByText('Рекомендованный возраст')).not.toBeInTheDocument();
  expect(note).toHaveTextContent('Цветная сахарная вата +1.000 ₽ к стоимости');
  expect(orderButton.compareDocumentPosition(price) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(orderButton.compareDocumentPosition(duration) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(orderButton.compareDocumentPosition(note) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(price.compareDocumentPosition(duration) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(duration.compareDocumentPosition(note) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(gallery).toBeInTheDocument();
  expect(galleryTrack).toBeInTheDocument();
  expect(within(gallery).getAllByTestId('offering-gallery-slide')).toHaveLength(4);
  expect(within(gallery).getAllByTestId('offering-gallery-image')).toHaveLength(4);
  expect(within(gallery).getAllByTestId('offering-gallery-image')[0]).toHaveAttribute('loading', 'lazy');
  expect(hero.compareDocumentPosition(gallery) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(gallery.compareDocumentPosition(included) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(included).toHaveTextContent('Монтаж и демонтаж');
  expect(included).not.toHaveTextContent('Подготовка зоны выдачи');
  expect(within(intro).queryByTestId('offering-materials')).not.toBeInTheDocument();
  expect(within(intro).getByRole('heading', { level: 2, name: 'Доставка' })).toBeInTheDocument();
  expect(within(intro).getByTestId('offering-delivery')).toHaveTextContent('Москва');
  expect(within(intro).getByTestId('offering-delivery-moscow')).toHaveTextContent('3.500 ₽');
  expect(within(intro).getByTestId('offering-delivery-region')).toHaveTextContent('Московская область');
  expect(within(intro).getByTestId('offering-delivery-region')).toHaveTextContent('Рассчитывается индивидуально по удаленности площадки');
  expect(within(intro).getByTestId('offering-tariffs')).toHaveTextContent('2 часа');
  expect(within(intro).getByTestId('offering-tariffs')).toHaveTextContent('12.000 ₽');
  expect(within(intro).getByTestId('offering-tariffs')).not.toHaveTextContent('Цветная сахарная вата +1.000 ₽ к стоимости');
  expect(within(intro).getByTestId('offering-tariffs')).not.toHaveTextContent('Монтаж и демонтаж');
  expect(within(intro).getByTestId('offering-delivery').compareDocumentPosition(cta) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(cta.compareDocumentPosition(otherServices) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(otherServices.querySelector('[data-service-slug="cotton-candy"]')).not.toBeInTheDocument();
  expect(otherServices.querySelector('[data-service-slug="chocolate-fountain"]')).toBeInTheDocument();
  expect(within(otherServices).getAllByTestId('service-card')[0]).toHaveAttribute('data-service-slug', 'chocolate-fountain');
  expect(otherServices.querySelector('.site-reveal')).not.toBeInTheDocument();
  expect(within(otherServices).getByTestId('section-services')).toHaveAttribute('id', 'services');
  expect(screen.getByTestId('section-extras')).toBeInTheDocument();
});

test('renders chocolate fountain package details with the shared discount note instead of combo badge', () => {
  render(
    <MemoryRouter initialEntries={['/services/chocolate-fountain']}>
      <Routes>
        <Route path="/services/:slug" element={<ServicePage />} />
      </Routes>
    </MemoryRouter>,
  );

  const intro = screen.getByTestId('section-offering-intro');

  expect(within(intro).queryByTestId('offering-combo-badge')).not.toBeInTheDocument();
  expect(within(intro).getByTestId('offering-special-note')).toHaveTextContent(
    'При заказе Шоколадного фонтана и Пирамиды из шампанского, действует скидка 20% на услугу "Пирамида из шампанского".',
  );
  expect(within(intro).getByTestId('offering-tariffs')).toHaveTextContent('Стандарт');
  expect(within(intro).getByTestId('offering-tariffs')).toHaveTextContent('11.500 ₽');
  expect(within(intro).getByTestId('offering-tariffs')).toHaveTextContent('VIP');
  expect(within(intro).getByTestId('offering-tariffs')).toHaveTextContent('14.500 ₽');
  expect(within(intro).getByText('Пакет Стандарт')).toBeInTheDocument();
  expect(within(intro).getByText('2.5 кг бельгийского шоколада Barry Callebaut')).toBeInTheDocument();
  expect(within(intro).getAllByText('Клубника +2.000 ₽ за 1 кг')).toHaveLength(2);
});

test('renders champagne pyramid details with manual duration and unified delivery block', () => {
  render(
    <MemoryRouter initialEntries={['/services/champagne-pyramid']}>
      <Routes>
        <Route path="/services/:slug" element={<ServicePage />} />
      </Routes>
    </MemoryRouter>,
  );

  const intro = screen.getByTestId('section-offering-intro');

  expect(within(intro).queryByTestId('offering-age')).not.toBeInTheDocument();
  expect(within(intro).queryByText('Рекомендованный возраст')).not.toBeInTheDocument();
  expect(within(intro).getByTestId('offering-duration')).toHaveTextContent('от 1 часа');
  expect(within(intro).queryByTestId('offering-combo-badge')).not.toBeInTheDocument();
  expect(within(intro).getByTestId('offering-special-note')).toHaveTextContent(
    'При заказе Шоколадного фонтана и Пирамиды из шампанского, действует скидка 20% на услугу "Пирамида из шампанского".',
  );
  expect(within(intro).getByTestId('offering-delivery-moscow')).toHaveTextContent('3.500 ₽');
  expect(within(intro).getByTestId('offering-delivery-region')).toHaveTextContent('Рассчитывается индивидуально');
  expect(within(intro).getByText('35 бокалов')).toBeInTheDocument();
  expect(within(intro).getByTestId('offering-included')).toHaveTextContent('Качественные бокалы');
  expect(within(intro).getByText('Эффект дыма')).toBeInTheDocument();
  expect(within(intro).getByText('Шампанское предоставляется заказчиком либо закупается барменом')).toBeInTheDocument();
  expect(within(intro).queryByText('В формат включено')).not.toBeInTheDocument();
});

test('renders caramel apples page as a full service page with final tariffs and gallery', () => {
  render(
    <MemoryRouter initialEntries={['/services/caramel-apples']}>
      <Routes>
        <Route path="/services/:slug" element={<ServicePage />} />
      </Routes>
    </MemoryRouter>,
  );

  const intro = screen.getByTestId('section-offering-intro');
  const gallery = within(intro).getByTestId('offering-gallery');

  expect(screen.getByRole('heading', { level: 1, name: 'Карамельные яблоки' })).toBeInTheDocument();
  expect(within(intro).getByTestId('offering-hero-image')).toHaveAttribute('src', '/images/services-home/caramel-apples-ui.png');
  expect(within(gallery).getAllByTestId('offering-gallery-slide')).toHaveLength(2);
  expect(within(gallery).getAllByTestId('offering-gallery-image')).toHaveLength(2);
  expect(within(intro).getByTestId('offering-price')).toHaveTextContent('от 15.000 ₽');
  expect(within(intro).getByTestId('offering-included')).not.toHaveTextContent('Подготовка станции');
  expect(within(intro).getByTestId('offering-tariffs')).toHaveTextContent('50 порций');
  expect(within(intro).getByTestId('offering-tariffs')).toHaveTextContent('1 час');
  expect(within(intro).getByTestId('offering-tariffs')).toHaveTextContent('15.000 ₽');
  expect(within(intro).getByTestId('offering-tariffs')).toHaveTextContent('100 порций');
  expect(within(intro).getByTestId('offering-tariffs')).toHaveTextContent('2 часа');
  expect(within(intro).getByTestId('offering-tariffs')).toHaveTextContent('27.000 ₽');
  expect(within(intro).getByTestId('offering-tariffs')).toHaveTextContent('150 порций');
  expect(within(intro).getByTestId('offering-tariffs')).toHaveTextContent('3 часа');
  expect(within(intro).getByTestId('offering-tariffs')).toHaveTextContent('37.500 ₽');
  expect(
    within(intro).queryByText('Тариф сейчас в предварительном формате — финальную смету соберём под вашу площадку и нужный объём.'),
  ).not.toBeInTheDocument();
});

test('renders combo gallery with all cotton candy and popcorn photos', () => {
  render(
    <MemoryRouter initialEntries={['/services/cotton-candy-popcorn']}>
      <Routes>
        <Route path="/services/:slug" element={<ServicePage />} />
      </Routes>
    </MemoryRouter>,
  );

  const intro = screen.getByTestId('section-offering-intro');
  const gallery = within(intro).getByTestId('offering-gallery');

  expect(within(gallery).getAllByTestId('offering-gallery-slide')).toHaveLength(7);
  expect(within(gallery).getAllByTestId('offering-gallery-image')).toHaveLength(7);
});

test('hides service gallery when there are no real photos for the service yet', () => {
  render(
    <MemoryRouter initialEntries={['/services/burgers']}>
      <Routes>
        <Route path="/services/:slug" element={<ServicePage />} />
      </Routes>
    </MemoryRouter>,
  );

  const intro = screen.getByTestId('section-offering-intro');

  expect(within(intro).queryByTestId('offering-gallery')).not.toBeInTheDocument();
});

test('renders tea station page with grouped tariff variants and service gallery', () => {
  render(
    <MemoryRouter initialEntries={['/services/tea-station']}>
      <Routes>
        <Route path="/services/:slug" element={<ServicePage />} />
      </Routes>
    </MemoryRouter>,
  );

  const intro = screen.getByTestId('section-offering-intro');
  const gallery = within(intro).getByTestId('offering-gallery');
  const tariffs = within(intro).getByTestId('offering-tariffs');

  expect(screen.getByRole('heading', { level: 1, name: 'Чайная станция' })).toBeInTheDocument();
  expect(within(intro).getByTestId('offering-price')).toHaveTextContent('от 15.000 ₽');
  expect(within(intro).queryByTestId('offering-duration')).not.toBeInTheDocument();
  expect(within(gallery).getAllByTestId('offering-gallery-slide')).toHaveLength(5);
  expect(tariffs).toHaveTextContent('Сбитень');
  expect(tariffs).toHaveTextContent('100 порций');
  expect(tariffs).toHaveTextContent('20.000 ₽');
  expect(tariffs).toHaveTextContent('Чайная станция "Стандарт"');
  expect(tariffs).toHaveTextContent('15.000 ₽');
  expect(tariffs).toHaveTextContent('Чайная станция с самоваром');
  expect(tariffs).toHaveTextContent('44.000 ₽');
  expect(tariffs).toHaveTextContent('Глинтвейн');
  expect(tariffs).toHaveTextContent('47.000 ₽');
});

test('renders plov station as a regular service page and not as an extra-only route', () => {
  render(
    <MemoryRouter initialEntries={['/services/plov-station']}>
      <Routes>
        <Route path="/services/:slug" element={<ServicePage />} />
      </Routes>
    </MemoryRouter>,
  );

  const intro = screen.getByTestId('section-offering-intro');
  const gallery = within(intro).getByTestId('offering-gallery');
  const tariffs = within(intro).getByTestId('offering-tariffs');

  expect(screen.getByRole('heading', { level: 1, name: 'Станция плова' })).toBeInTheDocument();
  expect(within(intro).getByTestId('offering-price')).toHaveTextContent('от 10.000 ₽');
  expect(within(intro).queryByTestId('offering-duration')).not.toBeInTheDocument();
  expect(within(gallery).getAllByTestId('offering-gallery-slide')).toHaveLength(2);
  expect(tariffs).toHaveTextContent('Индивидуальный расчет');
  expect(tariffs).toHaveTextContent('от 10.000 ₽');
});
