import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
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
      <input data-testid="name-input" value={leadForm.values.name} onChange={leadForm.handleNameChange} />
      <input data-testid="phone-input" value={leadForm.values.phone} onChange={leadForm.handlePhoneChange} />
      <button type="submit">{leadForm.status === 'success' ? 'Success' : 'Submit'}</button>
      <output data-testid="lead-form-status">{leadForm.status}</output>
    </form>
  );
}

afterEach(() => {
  submitLeadMock.mockReset();
  delete window.ym;
  vi.useRealTimers();
});

test('keeps the success state for thirty seconds before resetting the CTA button', async () => {
  vi.useFakeTimers();
  window.ym = vi.fn();
  submitLeadMock.mockResolvedValue({
    ok: true,
    accepted: true,
    id: 1,
    message: 'saved',
  });

  render(<LeadFormHarness />);

  fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Ivan' } });
  fireEvent.change(screen.getByTestId('phone-input'), { target: { value: '9991234567' } });
  fireEvent.submit(screen.getByRole('button', { name: 'Submit' }).closest('form')!);

  await act(async () => {
    await Promise.resolve();
  });

  expect(screen.getByTestId('lead-form-status')).toHaveTextContent('success');
  expect(window.ym).toHaveBeenCalledWith(108614702, 'reachGoal', 'form_submit');

  act(() => {
    vi.advanceTimersByTime(29_000);
  });

  expect(screen.getByTestId('lead-form-status')).toHaveTextContent('success');

  act(() => {
    vi.advanceTimersByTime(1_000);
  });

  expect(screen.getByTestId('lead-form-status')).toHaveTextContent('idle');
  expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
});

test('submits anti-spam metadata together with the lead payload', async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-04-18T12:00:00.000Z'));
  submitLeadMock.mockResolvedValue({
    ok: true,
    accepted: true,
    id: 2,
    message: 'saved',
  });

  render(<LeadFormHarness />);

  fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Anna' } });
  fireEvent.change(screen.getByTestId('phone-input'), { target: { value: '9991234567' } });
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
});

test('does not send the Metrika goal when backend did not accept the lead', async () => {
  window.ym = vi.fn();
  submitLeadMock.mockResolvedValue({
    ok: true,
    accepted: false,
    message: 'saved',
  });

  render(<LeadFormHarness />);

  fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Ivan' } });
  fireEvent.change(screen.getByTestId('phone-input'), { target: { value: '9991234567' } });
  fireEvent.submit(screen.getByRole('button', { name: 'Submit' }).closest('form')!);

  await act(async () => {
    await Promise.resolve();
  });

  expect(screen.getByTestId('lead-form-status')).toHaveTextContent('success');
  expect(window.ym).not.toHaveBeenCalled();
});
