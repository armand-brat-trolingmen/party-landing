import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';
import { OrderModalProvider } from '../cta/OrderModalContext';
import { CtaSection } from './CtaSection';

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

test('renders the homepage CTA as a compact inline form with privacy consent link and capped name length', () => {
  useLeadFormMock.mockReturnValue(createLeadFormState());

  render(
    <MemoryRouter>
      <OrderModalProvider>
        <CtaSection />
      </OrderModalProvider>
    </MemoryRouter>,
  );

  const section = screen.getByTestId('section-cta');
  const sectionQueries = within(section);

  expect(section).toHaveAttribute('data-cta-variant', 'home');
  expect(sectionQueries.getByTestId('cta-surface')).toHaveAttribute('data-cta-surface', 'full-bleed');
  expect(section.querySelector('[data-section-surface]')).toBeNull();
  expect(sectionQueries.getByTestId('cta-inline-form')).toBeInTheDocument();
  expect(sectionQueries.getByLabelText('Имя')).toHaveAttribute('maxlength', '16');
  expect(sectionQueries.getByLabelText('Телефон')).toBeInTheDocument();
  expect(sectionQueries.getByRole('button', { name: 'Заказать' })).toBeInTheDocument();
  expect(sectionQueries.queryByText(/whatsapp в течение 15 минут/i)).not.toBeInTheDocument();
  expect(sectionQueries.getByRole('link', { name: 'политикой конфиденциальности' })).toHaveAttribute('href', '/privacy');
  expect(sectionQueries.queryByRole('link', { name: /договор-оферта/i })).not.toBeInTheDocument();
  expect(sectionQueries.queryByRole('link', { name: /cookie/i })).not.toBeInTheDocument();
});

test('shows a green success button state in the inline CTA after successful submit', () => {
  useLeadFormMock.mockReturnValue(
    createLeadFormState({
      status: 'success',
      submitLabel: 'Успешно',
      isSubmitDisabled: true,
      statusMessage: 'Ваша заявка успешно отправлена.',
    }),
  );

  render(
    <MemoryRouter>
      <OrderModalProvider>
        <CtaSection />
      </OrderModalProvider>
    </MemoryRouter>,
  );

  const successButton = screen.getByRole('button', { name: /Успешно/i });

  expect(successButton).toBeDisabled();
  expect(successButton).toHaveTextContent('Успешно');
  expect(screen.getByTestId('cta-submit-success-icon')).toBeInTheDocument();
  expect(screen.queryByText('Ваша заявка успешно отправлена.')).not.toBeInTheDocument();
});
