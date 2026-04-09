import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { OrderModal } from './OrderModal';
import { OrderModalProvider } from './OrderModalContext';
import { useOrderModal } from './useOrderModal';

function OpenHarness() {
  const { openModal } = useOrderModal();

  return (
    <button type="button" onClick={openModal}>
      open
    </button>
  );
}

test('opens the shared modal with animated appearance, compact fields, and legal consent links', () => {
  render(
    <MemoryRouter>
      <OrderModalProvider>
        <OpenHarness />
        <OrderModal />
      </OrderModalProvider>
    </MemoryRouter>,
  );

  fireEvent.click(screen.getByRole('button', { name: 'open' }));

  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByTestId('order-modal-overlay')).toHaveAttribute('data-modal-state', 'open');
  expect(screen.getByTestId('order-modal')).toHaveAttribute('data-modal-state', 'open');
  expect(screen.getByRole('textbox', { name: 'Имя' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Телефон' })).toBeInTheDocument();
  expect(screen.queryByRole('textbox', { name: /Комментарий/i })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'политика конфиденциальности' })).toHaveAttribute('href', '/privacy');
  expect(screen.getByRole('link', { name: 'пользовательское соглашение' })).toHaveAttribute('href', '/terms');
  expect(screen.getByRole('link', { name: 'согласие на обработку персональных данных' })).toHaveAttribute('href', '/consent');
});
