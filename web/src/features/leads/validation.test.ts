import { formatPhoneInput, sanitizeNameInput, validateLeadValues } from './validation';

test('formats phone number to the Russian mask', () => {
  expect(formatPhoneInput('89991234567')).toBe('+7 (999) 123 45 67');
  expect(formatPhoneInput('+7 999 123 45 67')).toBe('+7 (999) 123 45 67');
});

test('keeps only letters, spaces, and hyphen characters in name', () => {
  expect(sanitizeNameInput('Иван123! Петров')).toBe('Иван Петров');
  expect(sanitizeNameInput('Анна-Мария_7')).toBe('Анна-Мария');
});

test('returns field errors for empty values', () => {
  expect(validateLeadValues({ name: '', phone: '' })).toEqual({
    name: 'Введите имя',
    phone: 'Введите телефон',
  });
});

test('rejects names longer than sixteen symbols', () => {
  expect(validateLeadValues({ name: 'Александрович Петр', phone: '+7 (999) 123 45 67' })).toEqual({
    name: 'Имя должно быть не длиннее 16 символов',
  });
});

test('rejects phone values outside the required mask', () => {
  expect(validateLeadValues({ name: 'Иван', phone: '+7 (999) 123 45' })).toEqual({
    phone: 'Телефон должен быть в формате +7 (999) 999 99 99',
  });
});

test('accepts valid values with any Russian +7 area code', () => {
  expect(validateLeadValues({ name: 'Иван', phone: '+7 (812) 123 45 67' })).toEqual({});
});
