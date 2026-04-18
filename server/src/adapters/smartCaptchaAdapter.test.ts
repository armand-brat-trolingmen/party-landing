import { describe, expect, test, vi } from 'vitest';
import { createSmartCaptchaVerifier } from './smartCaptchaAdapter';

describe('createSmartCaptchaVerifier', () => {
  test('does not require verification when no server key is configured', async () => {
    const fetchImpl = vi.fn();
    const verifier = createSmartCaptchaVerifier({
      serverKey: '',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    const result = await verifier.verify({
      token: '',
      remoteIp: '127.0.0.1',
    });

    expect(result).toEqual({
      configured: false,
      verified: false,
      reason: 'smartcaptcha_not_configured',
    });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  test('verifies a token against Yandex SmartCaptcha with remote ip', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ok', message: '', host: 'party-everyday.ru' }),
    });
    const verifier = createSmartCaptchaVerifier({
      serverKey: 'server-key',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    const result = await verifier.verify({
      token: 'token',
      remoteIp: '127.0.0.1',
    });

    expect(result).toEqual({
      configured: true,
      verified: true,
      reason: null,
    });
    expect(fetchImpl).toHaveBeenCalledWith(
      'https://smartcaptcha.cloud.yandex.ru/validate',
      expect.objectContaining({
        method: 'POST',
      }),
    );

    const body = fetchImpl.mock.calls[0][1].body as URLSearchParams;
    expect(body.get('secret')).toBe('server-key');
    expect(body.get('token')).toBe('token');
    expect(body.get('ip')).toBe('127.0.0.1');
  });

  test('returns the Yandex validation message when verification fails', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 'failed',
        message: 'Token invalid or expired.',
      }),
    });
    const verifier = createSmartCaptchaVerifier({
      serverKey: 'server-key',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    const result = await verifier.verify({
      token: 'bad-token',
      remoteIp: null,
    });

    expect(result).toEqual({
      configured: true,
      verified: false,
      reason: 'Token invalid or expired.',
    });
  });

  test('treats Yandex availability errors as verified to avoid blocking real users', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
    });
    const verifier = createSmartCaptchaVerifier({
      serverKey: 'server-key',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    await expect(
      verifier.verify({
        token: 'token',
        remoteIp: '127.0.0.1',
      }),
    ).resolves.toEqual({
      configured: true,
      verified: true,
      reason: null,
    });
  });
});
