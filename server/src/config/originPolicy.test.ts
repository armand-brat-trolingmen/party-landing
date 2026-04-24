import { describe, expect, test } from 'vitest';
import { createOriginPolicy } from './originPolicy';

describe('createOriginPolicy', () => {
  test('allows production origins and localhost variants while rejecting foreign origins', () => {
    const policy = createOriginPolicy({});

    expect(policy.isAllowed('https://party-everyday.ru')).toBe(true);
    expect(policy.isAllowed('https://www.party-everyday.ru')).toBe(true);
    expect(policy.isAllowed('http://party-everyday.ru')).toBe(true);
    expect(policy.isAllowed('http://www.party-everyday.ru')).toBe(true);
    expect(policy.isAllowed('http://localhost:5173')).toBe(true);
    expect(policy.isAllowed('http://127.0.0.1:4173')).toBe(true);
    expect(policy.isAllowed('https://evil.example')).toBe(false);
  });

  test('keeps safe local defaults when comma separated origins are configured', () => {
    const policy = createOriginPolicy({
      allowedOrigins: 'https://party-everyday.ru, https://www.party-everyday.ru',
    });

    expect(policy.isAllowed('https://party-everyday.ru')).toBe(true);
    expect(policy.isAllowed('http://localhost:3000')).toBe(true);
    expect(policy.isAllowed('http://127.0.0.1:8080')).toBe(true);
  });
});
