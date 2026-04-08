import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { OrderModal } from '../cta/OrderModal';
import { OrderModalProvider } from '../cta/OrderModalContext';
import { HeroSection } from './HeroSection';

test('renders the clean hero with one headline, larger actions, and no decorative scene content', () => {
  render(
    <MemoryRouter>
      <OrderModalProvider>
        <HeroSection />
      </OrderModalProvider>
    </MemoryRouter>,
  );

  const hero = screen.getByTestId('section-hero');
  expect(hero).toHaveAttribute('data-hero-style', 'clean-canvas');
  expect(screen.getByTestId('hero-title-line-1')).toHaveTextContent('Фуд-станции');
  expect(screen.getByTestId('hero-title-line-2')).toHaveTextContent('на ваше');
  expect(screen.getByTestId('hero-title-line-3')).toHaveTextContent('мероприятие');
  expect(screen.getByRole('heading', { level: 1, name: 'Фуд-станции на ваше мероприятие' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Заказать' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'В каталог' })).toBeInTheDocument();
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
