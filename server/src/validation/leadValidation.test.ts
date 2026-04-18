import { describe, expect, test } from 'vitest';
import { validateLeadInput } from './leadValidation';

describe('validateLeadInput', () => {
  test('rejects empty fields', () => {
    const result = validateLeadInput({
      name: '',
      phone: '',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.name).toBeDefined();
      expect(result.fieldErrors.phone).toBeDefined();
    }
  });

  test('rejects names with non-letter symbols', () => {
    const result = validateLeadInput({
      name: 'Ivan123',
      phone: '+7 (999) 111-22-33',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.name).toBeDefined();
    }
  });

  test('rejects phone values outside the required mask', () => {
    const result = validateLeadInput({
      name: 'Ivan',
      phone: '89991112233',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.phone).toMatch(/\+7 \(999\) 999-99-99/);
    }
  });

  test('rejects names longer than sixteen symbols', () => {
    const result = validateLeadInput({
      name: 'Alexander Petrovich',
      phone: '+7 (999) 111-22-33',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.name).toMatch(/16/);
    }
  });

  test('accepts valid name and phone values', () => {
    const result = validateLeadInput({
      name: 'Anna-Maria',
      phone: '+7 (999) 111-22-33',
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({
        name: 'Anna-Maria',
        phone: '+7 (999) 111-22-33',
      });
    }
  });
});
