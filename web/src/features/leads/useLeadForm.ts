import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { LeadApiError, submitLead } from './api';
import type { LeadFieldErrors, LeadFormValues, LeadSubmitStatus } from './types';
import { formatPhoneInput, normalizeName, sanitizeNameInput, validateLeadValues } from './validation';

const initialValues: LeadFormValues = {
  name: '',
  phone: '',
};

const successResetDelayMs = 10_000;

function omitFieldError(errors: LeadFieldErrors, fieldName: keyof LeadFieldErrors) {
  if (!errors[fieldName]) {
    return errors;
  }

  const nextErrors = { ...errors };
  delete nextErrors[fieldName];
  return nextErrors;
}

export function useLeadForm() {
  const [values, setValues] = useState<LeadFormValues>(initialValues);
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [status, setStatus] = useState<LeadSubmitStatus>('idle');
  const [hasGeneralError, setHasGeneralError] = useState(false);

  useEffect(() => {
    if (status !== 'success') {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setStatus('idle');
    }, successResetDelayMs);

    return () => window.clearTimeout(timeoutId);
  }, [status]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setStatus('idle');
    setHasGeneralError(false);
  }, []);

  const clearTransientState = useCallback(() => {
    setHasGeneralError(false);

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

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const nextValues = {
        name: normalizeName(values.name),
        phone: values.phone.trim(),
      };
      const nextErrors = validateLeadValues(nextValues);

      if (Object.keys(nextErrors).length > 0) {
        setValues(nextValues);
        setErrors(nextErrors);
        setHasGeneralError(false);
        setStatus('error');
        return;
      }

      setValues(nextValues);
      setErrors({});
      setHasGeneralError(false);
      setStatus('loading');

      try {
        await submitLead(nextValues);
        setValues(initialValues);
        setStatus('success');
      } catch (error) {
        if (error instanceof LeadApiError && error.fieldErrors && Object.keys(error.fieldErrors).length > 0) {
          setErrors(error.fieldErrors);
          setHasGeneralError(false);
        } else {
          setHasGeneralError(true);
        }

        setStatus('error');
      }
    },
    [values],
  );

  const submitLabel =
    status === 'loading' ? 'Отправляем...' : status === 'success' ? 'Отправлено' : 'Заказать';

  const isSubmitDisabled = status === 'loading' || status === 'success';

  return useMemo(
    () => ({
      values,
      errors,
      status,
      hasGeneralError,
      submitLabel,
      isSubmitDisabled,
      handleNameChange,
      handlePhoneChange,
      handleSubmit,
      resetForm,
    }),
    [errors, handleNameChange, handlePhoneChange, handleSubmit, hasGeneralError, isSubmitDisabled, resetForm, status, submitLabel, values],
  );
}
