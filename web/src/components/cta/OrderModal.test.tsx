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

test('opens the shared modal with compact fields, capped name length, and privacy consent link', () => {
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
  expect(screen.getByRole('textbox', { name: 'Имя' })).toHaveAttribute('maxlength', '16');
  expect(screen.getByRole('textbox', { name: 'Телефон' })).toBeInTheDocument();
  expect(screen.queryByRole('textbox', { name: /Комментарий/i })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'политикой конфиденциальности' })).toHaveAttribute('href', '/privacy');
  expect(screen.queryByRole('link', { name: /договор-оферта/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /cookie/i })).not.toBeInTheDocument();
});
