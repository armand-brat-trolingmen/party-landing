import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';
import { OrderModal } from './OrderModal';
import { OrderModalProvider } from './OrderModalContext';
import { useOrderModal } from './useOrderModal';

const useLeadFormMock = vi.fn();

vi.mock('../../features/leads/useLeadForm', () => ({
  useLeadForm: () => useLeadFormMock(),
}));

function createLeadFormState(overrides: Record<string, unknown> = {}) {
  return {
    values: { name: '', phone: '' },
    errors: {},
    status: 'idle',
    hasGeneralError: false,
    statusMessage: '',
    submitLabel: 'Заказать',
    isSubmitDisabled: false,
    handleNameChange: vi.fn(),
    handlePhoneChange: vi.fn(),
    handleSubmit: vi.fn(),
    resetForm: vi.fn(),
    ...overrides,
  };
}

function OpenHarness() {
  const { openModal } = useOrderModal();

  return (
    <button type="button" onClick={openModal}>
      open
    </button>
  );
}

test('opens the shared modal with compact fields, capped name length, and privacy consent link', () => {
  useLeadFormMock.mockReturnValue(createLeadFormState());

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

test('shows an error button state and fallback help text in the modal when submit fails', () => {
  useLeadFormMock.mockReturnValue(
    createLeadFormState({
      status: 'error',
      submitLabel: 'Заказать',
      statusMessage: 'Свяжитесь с нами через контакты на сайте, и мы быстро поможем с оформлением.',
      hasGeneralError: true,
    }),
  );

  render(
    <MemoryRouter>
      <OrderModalProvider>
        <OpenHarness />
        <OrderModal />
      </OrderModalProvider>
    </MemoryRouter>,
  );

  fireEvent.click(screen.getByRole('button', { name: 'open' }));

  const errorButton = screen.getByRole('button', { name: /Неуспешно/i });

  expect(errorButton).toHaveTextContent('Неуспешно');
  expect(screen.getByTestId('order-modal-submit-error-icon')).toBeInTheDocument();
  expect(screen.getByText('Свяжитесь с нами через контакты на сайте, и мы быстро поможем с оформлением.')).toBeInTheDocument();
});
