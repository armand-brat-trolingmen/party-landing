import { act, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { useLeadForm } from './useLeadForm';

const { submitLeadMock } = vi.hoisted(() => ({
  submitLeadMock: vi.fn(),
}));

vi.mock('./api', async () => {
  const actual = await vi.importActual<typeof import('./api')>('./api');

  return {
    ...actual,
    submitLead: submitLeadMock,
  };
});

function LeadFormHarness() {
  const leadForm = useLeadForm();

  return (
    <form onSubmit={leadForm.handleSubmit}>
      <label>
        Имя
        <input aria-label="Имя" value={leadForm.values.name} onChange={leadForm.handleNameChange} />
      </label>
      <label>
        Телефон
        <input aria-label="Телефон" value={leadForm.values.phone} onChange={leadForm.handlePhoneChange} />
      </label>
      <button type="submit">{leadForm.status === 'success' ? 'Успешно' : 'Заказать'}</button>
      <output data-testid="lead-form-status">{leadForm.status}</output>
    </form>
  );
}

test('keeps the success state for thirty seconds before resetting the CTA button', async () => {
  vi.useFakeTimers();
  submitLeadMock.mockResolvedValue({
    ok: true,
    id: 1,
    message: 'Ваша заявка успешно отправлена.',
  });

  render(<LeadFormHarness />);

  fireEvent.change(screen.getByLabelText('Имя'), { target: { value: 'Иван' } });
  fireEvent.change(screen.getByLabelText('Телефон'), { target: { value: '9991234567' } });
  fireEvent.submit(screen.getByRole('button', { name: 'Заказать' }).closest('form')!);

  await act(async () => {
    await Promise.resolve();
  });

  expect(screen.getByTestId('lead-form-status')).toHaveTextContent('success');

  act(() => {
    vi.advanceTimersByTime(29_000);
  });

  expect(screen.getByTestId('lead-form-status')).toHaveTextContent('success');

  act(() => {
    vi.advanceTimersByTime(1_000);
  });

  expect(screen.getByTestId('lead-form-status')).toHaveTextContent('idle');
  expect(screen.getByRole('button', { name: 'Заказать' })).toBeInTheDocument();

  vi.useRealTimers();
});

test('submits anti-spam metadata together with the lead payload', async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-04-18T12:00:00.000Z'));
  submitLeadMock.mockResolvedValue({
    ok: true,
    id: 2,
    message: 'saved',
  });

  render(<LeadFormHarness />);

  const [nameInput, phoneInput] = document.querySelectorAll('input');
  fireEvent.change(nameInput, { target: { value: 'Anna' } });
  fireEvent.change(phoneInput, { target: { value: '9991234567' } });
  fireEvent.submit(document.querySelector('form')!);

  await act(async () => {
    await Promise.resolve();
  });

  expect(submitLeadMock).toHaveBeenCalledWith(
    expect.objectContaining({
      company: '',
      form_started_at: String(new Date('2026-04-18T12:00:00.000Z').getTime()),
      smartcaptcha_token: '',
    }),
  );

  vi.useRealTimers();
});
