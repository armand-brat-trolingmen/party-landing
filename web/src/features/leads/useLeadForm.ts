import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { getStoredLeadAttribution } from '../trafficSource/attribution';
import { LeadApiError, submitLead } from './api';
import type { LeadAttributionPayload, LeadFieldErrors, LeadFormValues, LeadSubmitStatus } from './types';
import { formatPhoneInput, normalizeName, sanitizeNameInput, validateLeadValues } from './validation';

declare global {
  interface Window {
    ym?: (counterId: number, method: 'reachGoal', target: string) => void;
  }
}

const initialValues: LeadFormValues = {
  name: '',
  phone: '',
};

const successResetDelayMs = 30_000;
const createFormStartedAt = () => String(Date.now());
const defaultSuccessMessage = 'Ваша заявка успешно отправлена.';
const defaultErrorMessage =
  'Если заявка не отправилась, свяжитесь с нами через контакты на сайте — мы быстро поможем с оформлением.';

function omitFieldError(errors: LeadFieldErrors, fieldName: keyof LeadFieldErrors) {
  if (!errors[fieldName]) {
    return errors;
  }

  const nextErrors = { ...errors };
  delete nextErrors[fieldName];
  return nextErrors;
}

const metrikaCounterId = 108614702;
const metrikaFormSubmitGoal = 'form_submit';

function trackSuccessfulLeadSubmit() {
  window.ym?.(metrikaCounterId, 'reachGoal', metrikaFormSubmitGoal);
}

export function useLeadForm() {
  const [values, setValues] = useState<LeadFormValues>(initialValues);
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [status, setStatus] = useState<LeadSubmitStatus>('idle');
  const [hasGeneralError, setHasGeneralError] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [attributionValues, setAttributionValues] = useState<LeadAttributionPayload>(() => getStoredLeadAttribution());
  const [honeypotValue, setHoneypotValue] = useState('');
  // Capture immediately so the server can detect form posts that happen too fast.
  const [formStartedAt, setFormStartedAt] = useState(createFormStartedAt);
  const [smartCaptchaToken, setSmartCaptchaToken] = useState('');

  useEffect(() => {
    if (status !== 'success') {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setStatus('idle');
      setStatusMessage('');
    }, successResetDelayMs);

    return () => window.clearTimeout(timeoutId);
  }, [status]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setStatus('idle');
    setHasGeneralError(false);
    setStatusMessage('');
    setHoneypotValue('');
    setFormStartedAt(createFormStartedAt());
    setSmartCaptchaToken('');
  }, []);

  const clearTransientState = useCallback(() => {
    setHasGeneralError(false);
    setStatusMessage('');

    if (status !== 'idle') {
      setStatus('idle');
    }
  }, [status]);

  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = sanitizeNameInput(event.target.value);
      setValues((current) => ({ ...current, name: nextValue }));
      setErrors((current) => omitFieldError(current, 'name'));
      clearTransientState();
    },
    [clearTransientState],
  );

  const handlePhoneChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = formatPhoneInput(event.target.value);
      setValues((current) => ({ ...current, phone: nextValue }));
      setErrors((current) => omitFieldError(current, 'phone'));
      clearTransientState();
    },
    [clearTransientState],
  );

  const handleHoneypotChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setHoneypotValue(event.target.value);
  }, []);

  const submitCurrentValues = useCallback(
    async (captchaToken = smartCaptchaToken) => {
      const nextValues = {
        name: normalizeName(values.name),
        phone: values.phone.trim(),
      };
      const nextErrors = validateLeadValues(nextValues);

      if (Object.keys(nextErrors).length > 0) {
        setValues(nextValues);
        setErrors(nextErrors);
        setHasGeneralError(false);
        setStatusMessage('');
        setStatus('error');
        return;
      }

      setValues(nextValues);
      const nextAttributionValues = getStoredLeadAttribution();
      setAttributionValues(nextAttributionValues);
      setErrors({});
      setHasGeneralError(false);
      setStatusMessage('');
      setStatus('loading');

      try {
        const result = await submitLead({
          ...nextValues,
          ...nextAttributionValues,
          company: honeypotValue,
          form_started_at: formStartedAt,
          smartcaptcha_token: captchaToken,
        });
        if (result.accepted) {
          trackSuccessfulLeadSubmit();
        }
        setValues(initialValues);
        setHoneypotValue('');
        setFormStartedAt(createFormStartedAt());
        setSmartCaptchaToken('');
        setStatusMessage(result.message ?? defaultSuccessMessage);
        setStatus('success');
      } catch (error) {
        if (error instanceof LeadApiError && error.fieldErrors && Object.keys(error.fieldErrors).length > 0) {
          setErrors(error.fieldErrors);
          setHasGeneralError(false);
          setStatusMessage('');
        } else {
          setHasGeneralError(true);
          setStatusMessage(error instanceof LeadApiError && error.message ? error.message : defaultErrorMessage);
        }

        setStatus('error');
      }
    },
    [formStartedAt, honeypotValue, smartCaptchaToken, values],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await submitCurrentValues();
    },
    [submitCurrentValues],
  );

  const submitWithSmartCaptchaToken = useCallback(
    async (token: string) => {
      setSmartCaptchaToken(token);
      await submitCurrentValues(token);
    },
    [submitCurrentValues],
  );

  const submitLabel = status === 'loading' ? 'Отправляем...' : 'Заказать';
  const isSubmitDisabled = status === 'loading' || status === 'success';

  return useMemo(
    () => ({
      values,
      errors,
      status,
      hasGeneralError,
      attributionValues,
      honeypotValue,
      formStartedAt,
      smartCaptchaToken,
      statusMessage,
      submitLabel,
      isSubmitDisabled,
      handleNameChange,
      handlePhoneChange,
      handleHoneypotChange,
      setSmartCaptchaToken,
      submitWithSmartCaptchaToken,
      handleSubmit,
      resetForm,
    }),
    [
      errors,
      attributionValues,
      formStartedAt,
      handleHoneypotChange,
      handleNameChange,
      handlePhoneChange,
      handleSubmit,
      hasGeneralError,
      honeypotValue,
      isSubmitDisabled,
      resetForm,
      smartCaptchaToken,
      status,
      statusMessage,
      submitWithSmartCaptchaToken,
      submitLabel,
      values,
    ],
  );
}
