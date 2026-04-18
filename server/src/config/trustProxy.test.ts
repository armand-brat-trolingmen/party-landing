import { describe, expect, test } from 'vitest';
import { parseTrustProxy } from './trustProxy';

describe('parseTrustProxy', () => {
  test('keeps trust proxy disabled by default', () => {
    expect(parseTrustProxy(undefined)).toBe(false);
    expect(parseTrustProxy('')).toBe(false);
    expect(parseTrustProxy('false')).toBe(false);
    expect(parseTrustProxy('0')).toBe(false);
  });

  test('parses numeric hop count as a number instead of trust-all boolean', () => {
    expect(parseTrustProxy('1')).toBe(1);
    expect(parseTrustProxy('2')).toBe(2);
  });

  test('supports explicit trust-all and named subnet values', () => {
    expect(parseTrustProxy('true')).toBe(true);
    expect(parseTrustProxy('loopback')).toBe('loopback');
    expect(parseTrustProxy('uniquelocal')).toBe('uniquelocal');
  });
});
