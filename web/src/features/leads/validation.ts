import type { LeadFieldErrors, LeadFormValues } from './types';

const namePattern = /^[\p{L}\s-]+$/u;
const phonePattern = /^\+7 \(\d{3}\) \d{3} \d{2} \d{2}$/;

export function sanitizeNameInput(value: string) {
  return value.replace(/[^\p{L}\s-]+/gu, '').replace(/\s{2,}/g, ' ');
}

export function normalizeName(value: string) {
  return sanitizeNameInput(value).trim();
}

export function formatPhoneInput(value: string) {
  const rawDigits = value.replace(/\D/g, '');

  if (!rawDigits) {
    return '';
  }

  const normalizedDigits = rawDigits.startsWith('8')
    ? `7${rawDigits.slice(1)}`
    : rawDigits.startsWith('7')
      ? rawDigits
      : `7${rawDigits}`;
  const digits = normalizedDigits.slice(0, 11);
  const national = digits.slice(1);

  if (!national) {
    return '+7';
  }

  if (national.length <= 3) {
    return `+7 (${national}`;
  }

  if (national.length <= 6) {
    return `+7 (${national.slice(0, 3)}) ${national.slice(3)}`;
  }

  if (national.length <= 8) {
    return `+7 (${national.slice(0, 3)}) ${national.slice(3, 6)} ${national.slice(6)}`;
  }

  return `+7 (${national.slice(0, 3)}) ${national.slice(3, 6)} ${national.slice(6, 8)} ${national.slice(8, 10)}`;
}

export function validateLeadValues(values: LeadFormValues) {
  const errors: LeadFieldErrors = {};
  const normalizedName = normalizeName(values.name);
  const normalizedPhone = values.phone.trim();

  if (!normalizedName) {
    errors.name = 'Введите имя';
  } else if (!namePattern.test(normalizedName)) {
    errors.name = 'Имя должно содержать только буквы';
  }

  if (!normalizedPhone) {
    errors.phone = 'Введите телефон';
  } else if (!phonePattern.test(normalizedPhone)) {
    errors.phone = 'Телефон должен быть в формате +7 (999) 999 99 99';
  }

  return errors;
}
