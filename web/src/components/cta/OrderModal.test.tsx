import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
    attributionValues: {
      first_visit_at: '2026-04-01T10:00:00.000Z',
      last_visit_at: '2026-04-02T10:00:00.000Z',
      visits_count: '2',
      first_referrer: 'direct',
      last_referrer: 'https://partner.example.com/campaign',
      first_utm_source: 'yandex',
      first_utm_medium: 'cpc',
      first_utm_campaign: 'spring',
      last_utm_source: '',
      last_utm_medium: '',
      last_utm_campaign: '',
    },
    submitLabel: 'Заказать',
    isSubmitDisabled: false,
    handleNameChange: vi.fn(),
    handlePhoneChange: vi.fn(),
    honeypotValue: '',
    handleHoneypotChange: vi.fn(),
    formStartedAt: '1776513600000',
    smartCaptchaToken: '',
    setSmartCaptchaToken: vi.fn(),
    submitWithSmartCaptchaToken: vi.fn(),
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
  expect(document.querySelector('input[name="phone"]')).toHaveAttribute('placeholder', '+7 (999) 999-99-99');
  expect(document.querySelector('input[type="hidden"][name="first_visit_at"]')).toHaveAttribute(
    'value',
    '2026-04-01T10:00:00.000Z',
  );
  expect(document.querySelector('input[type="hidden"][name="last_referrer"]')).toHaveAttribute(
    'value',
    'https://partner.example.com/campaign',
  );
  expect(document.querySelector('input[name="company"]')).toHaveAttribute('tabindex', '-1');
  expect(document.querySelector('input[type="hidden"][name="form_started_at"]')).toHaveAttribute(
    'value',
    '1776513600000',
  );
  expect(document.querySelector('input[type="hidden"][name="smartcaptcha_token"]')).toHaveAttribute('value', '');
  expect(screen.getByRole('textbox', { name: 'Имя' })).toHaveAttribute('maxlength', '16');
  expect(screen.getByRole('textbox', { name: 'Телефон' })).toBeInTheDocument();
  expect(screen.queryByRole('textbox', { name: /Комментарий/i })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'политикой конфиденциальности' })).toHaveAttribute('href', '/privacy');
  expect(screen.queryByRole('link', { name: /договор-оферта/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /cookie/i })).not.toBeInTheDocument();
});

test('renders Yandex SmartCaptcha in invisible mode and submits with its token', async () => {
  const submitWithSmartCaptchaToken = vi.fn();
  const executeSmartCaptcha = vi.fn();
  const renderSmartCaptcha = vi.fn().mockReturnValue(42);
  vi.stubEnv('VITE_SMARTCAPTCHA_SITE_KEY', 'site-key');
  Object.defineProperty(window, 'smartCaptcha', {
    configurable: true,
    value: {
      render: renderSmartCaptcha,
      execute: executeSmartCaptcha,
    },
  });
  useLeadFormMock.mockReturnValue(
    createLeadFormState({
      submitWithSmartCaptchaToken,
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

  await waitFor(() => expect(renderSmartCaptcha).toHaveBeenCalled());

  const options = renderSmartCaptcha.mock.calls[0][1] as {
    callback: (token: string) => void;
    invisible: boolean;
    sitekey: string;
  };
  expect(options.sitekey).toBe('site-key');
  expect(options.invisible).toBe(true);

  fireEvent.submit(document.querySelector('form')!);

  expect(executeSmartCaptcha).toHaveBeenCalledWith(42);

  options.callback('verified-token');

  expect(submitWithSmartCaptchaToken).toHaveBeenCalledWith('verified-token');

  vi.unstubAllEnvs();
  Reflect.deleteProperty(window, 'smartCaptcha');
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
