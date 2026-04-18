import { formatPhoneInput, sanitizeNameInput, validateLeadValues } from './validation';

test('formats phone number to the Russian mask with hyphens', () => {
  expect(formatPhoneInput('89991234567')).toBe('+7 (999) 123-45-67');
  expect(formatPhoneInput('+7 999 123 45 67')).toBe('+7 (999) 123-45-67');
});

test('keeps only letters, spaces, and hyphen characters in name', () => {
  expect(sanitizeNameInput('Ivan123! Petrov')).toBe('Ivan Petrov');
  expect(sanitizeNameInput('Anna-Maria_7')).toBe('Anna-Maria');
});

test('returns field errors for empty values', () => {
  const errors = validateLeadValues({ name: '', phone: '' });

  expect(errors.name).toBeDefined();
  expect(errors.phone).toBeDefined();
});

test('rejects names longer than sixteen symbols', () => {
  const errors = validateLeadValues({ name: 'Alexander Petrovich', phone: '+7 (999) 123-45-67' });

  expect(errors.name).toBeDefined();
});

test('rejects phone values outside the required mask', () => {
  const errors = validateLeadValues({ name: 'Ivan', phone: '+7 (999) 123 45' });

  expect(errors.phone).toMatch(/\+7 \(999\) 999-99-99/);
});

test('accepts valid values with any Russian +7 area code', () => {
  expect(validateLeadValues({ name: 'Ivan', phone: '+7 (812) 123-45-67' })).toEqual({});
});
