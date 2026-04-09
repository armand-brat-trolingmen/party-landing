import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { OrderModal } from '../cta/OrderModal';
import { OrderModalProvider } from '../cta/OrderModalContext';
import { HeroSection } from './HeroSection';

test('renders the editorial hero with a poster carousel and no supporting tag pill', () => {
  render(
    <MemoryRouter>
      <OrderModalProvider>
        <HeroSection />
      </OrderModalProvider>
    </MemoryRouter>,
  );

  const hero = screen.getByTestId('section-hero');
  expect(hero).toHaveAttribute('data-hero-style', 'editorial-poster');
  expect(screen.getByTestId('hero-title-line-1')).toHaveTextContent('Фуд-станции');
  expect(screen.getByTestId('hero-title-line-2')).toHaveTextContent('на ваше');
  expect(screen.getByTestId('hero-title-line-3')).toHaveTextContent('мероприятие');
  expect(screen.getByRole('heading', { level: 1, name: 'Фуд-станции на ваше мероприятие' })).toBeInTheDocument();
  expect(screen.queryByText(/москва и область/i)).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Заказать' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'В каталог' })).toBeInTheDocument();
  expect(screen.getByTestId('hero-poster-carousel')).toBeInTheDocument();
  expect(screen.getByTestId('hero-poster-frame')).toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'Шоколадный фонтан на премиальной фуд-станции' })).toBeInTheDocument();
  expect(within(hero).queryByText('Праздник каждый день')).not.toBeInTheDocument();
  expect(screen.queryByTestId('hero-scene')).not.toBeInTheDocument();
});

test('opens the shared order modal from the hero CTA', () => {
  render(
    <MemoryRouter>
      <OrderModalProvider>
        <>
          <HeroSection />
          <OrderModal />
          <div id="services" />
        </>
      </OrderModalProvider>
    </MemoryRouter>,
  );

  fireEvent.click(screen.getByRole('button', { name: 'Заказать' }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});
