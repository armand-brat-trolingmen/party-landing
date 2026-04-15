import type { LeadFieldErrors, ValidationResult } from '../types';

const namePattern = /^[\p{L}\s-]+$/u;
const phonePattern = /^\+7 \(\d{3}\) \d{3} \d{2} \d{2}$/;
const maxNameLength = 16;

export function validateLeadInput(input: { name: string; phone: string }): ValidationResult {
  const name = input.name.trim();
  const phone = input.phone.trim();
  const fieldErrors: LeadFieldErrors = {};

  if (!name) {
    fieldErrors.name = 'Введите имя';
  } else if (name.length > maxNameLength) {
    fieldErrors.name = 'Имя должно быть не длиннее 16 символов';
  } else if (!namePattern.test(name)) {
    fieldErrors.name = 'Имя должно содержать только буквы';
  }

  if (!phone) {
    fieldErrors.phone = 'Введите телефон';
  } else if (!phonePattern.test(phone)) {
    fieldErrors.phone = 'Телефон должен быть в формате +7 (999) 999 99 99';
  }

  if (fieldErrors.name || fieldErrors.phone) {
    return {
      ok: false,
      fieldErrors,
    };
  }

  return {
    ok: true,
    value: {
      name,
      phone,
    },
  };
}
