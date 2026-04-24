import { describe, expect, test, vi } from 'vitest';
import { createLeadService } from './leadService';

function createRepository(overrides: Record<string, unknown> = {}) {
  return {
    countLeadsByIpBetween: vi.fn().mockReturnValue(0),
    findRecentLeadByPhone: vi.fn().mockReturnValue(null),
    insertLead: vi.fn().mockReturnValue(17),
    updateVkStatus: vi.fn(),
    ...overrides,
  };
}

function createVkAdapter(overrides: Record<string, unknown> = {}) {
  return {
    sendLeadNotification: vi.fn().mockResolvedValue({
      status: 'success',
      error: null,
    }),
    getDefaultPeerIds: vi.fn().mockReturnValue([]),
    ...overrides,
  };
}

describe('leadService', () => {
  test('stores all configured peer_ids and passes lead sources into the VK notification payload', async () => {
    const repository = createRepository();
    const vkAdapter = createVkAdapter({
      getDefaultPeerIds: vi.fn().mockReturnValue(['2000000042', '2000000043']),
    });

    const service = createLeadService({
      repository,
      vkAdapter,
      nowFactory: () => new Date('2026-04-14T12:00:00+03:00'),
    });

    const response = await service.createLead({
      name: 'Anna',
      phone: '+7 (999) 111 22 33',
      ip: '127.0.0.1',
      userAgent: 'vitest',
      firstLeadSource: 'Google search',
      lastLeadSource: 'Yandex search',
    });

    expect(response).toMatchObject({
      ok: true,
      accepted: true,
      id: 17,
      vkSendStatus: 'success',
    });
    expect(repository.insertLead).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Anna',
        phone: '+7 (999) 111 22 33',
        firstTrafficSource: 'Google search',
        lastTrafficSource: 'Yandex search',
        vkPeerId: '2000000042,2000000043',
      }),
    );
    expect(vkAdapter.sendLeadNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Anna',
        phone: '+7 (999) 111 22 33',
        firstLeadSource: 'Google search',
        lastLeadSource: 'Yandex search',
      }),
    );
  });

  test('marks soft rate limited leads as spam without rejecting the request', async () => {
    const repository = createRepository({
      countLeadsByIpBetween: vi.fn().mockReturnValue(2),
      insertLead: vi.fn().mockReturnValue(19),
    });
    const vkAdapter = createVkAdapter({
      sendLeadNotification: vi.fn(),
    });

    const service = createLeadService({
      repository,
      vkAdapter,
      nowFactory: () => new Date('2026-04-15T12:00:00+03:00'),
    });

    const response = await service.createLead({
      name: 'Anna',
      phone: '+7 (999) 111 22 33',
      ip: '127.0.0.1',
      userAgent: 'vitest',
      softRateLimitExceeded: true,
    } as Parameters<typeof service.createLead>[0] & { softRateLimitExceeded: boolean });

    expect(response).toMatchObject({
      ok: true,
      accepted: false,
      vkSendStatus: 'skipped',
    });
    expect(response.id).toBeUndefined();
    expect(repository.insertLead).not.toHaveBeenCalled();
    expect(vkAdapter.sendLeadNotification).not.toHaveBeenCalled();
  });

  test('normalizes first-party attribution and passes it to storage and VK', async () => {
    const repository = createRepository({
      insertLead: vi.fn().mockReturnValue(18),
    });
    const vkAdapter = createVkAdapter();

    const service = createLeadService({
      repository,
      vkAdapter,
      nowFactory: () => new Date('2026-04-14T12:00:00+03:00'),
    });

    await service.createLead({
      name: 'Anna',
      phone: '+7 (999) 111-22-33',
      ip: '127.0.0.1',
      userAgent: 'vitest',
      firstLeadSource: 'UTM: yandex / cpc / spring',
      lastLeadSource: 'direct',
      first_visit_at: '2026-04-01T10:00:00.000Z',
      last_visit_at: '2026-04-02T10:00:00.000Z',
      visits_count: '2',
      first_referrer: 'direct',
      last_referrer: 'https://partner.example.com/campaign',
      first_utm_source: 'yandex',
      first_utm_medium: 'cpc',
      first_utm_campaign: 'spring',
      last_utm_source: '',
      last_utm_medium: '',
      last_utm_campaign: '',
    });

    expect(repository.insertLead).toHaveBeenCalledWith(
      expect.objectContaining({
        firstVisitAt: '2026-04-01T10:00:00.000Z',
        lastVisitAt: '2026-04-02T10:00:00.000Z',
        visitsCount: 2,
        firstReferrer: 'direct',
        lastReferrer: 'https://partner.example.com/campaign',
        firstUtmSource: 'yandex',
        firstUtmMedium: 'cpc',
        firstUtmCampaign: 'spring',
        lastUtmSource: null,
        lastUtmMedium: null,
        lastUtmCampaign: null,
      }),
    );
    expect(vkAdapter.sendLeadNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        firstVisitAt: '2026-04-01T10:00:00.000Z',
        lastVisitAt: '2026-04-02T10:00:00.000Z',
        visitsCount: 2,
        firstReferrer: 'direct',
        lastReferrer: 'https://partner.example.com/campaign',
        firstUtmSource: 'yandex',
        firstUtmMedium: 'cpc',
        firstUtmCampaign: 'spring',
        lastUtmSource: null,
        lastUtmMedium: null,
        lastUtmCampaign: null,
      }),
    );
  });

  test('truncates oversized attribution, user-agent, and captcha token before storage and verification', async () => {
    const repository = createRepository({
      insertLead: vi.fn().mockReturnValue(25),
    });
    const vkAdapter = createVkAdapter();
    const smartCaptchaVerifier = {
      verify: vi.fn().mockResolvedValue({
        configured: true,
        verified: true,
        reason: null,
      }),
    };

    const service = createLeadService({
      repository,
      vkAdapter,
      smartCaptchaVerifier,
      nowFactory: () => new Date('2026-04-18T12:00:00.000Z'),
    } as Parameters<typeof createLeadService>[0] & { smartCaptchaVerifier: typeof smartCaptchaVerifier });

    const oversizedUserAgent = `Mozilla/${'a'.repeat(1000)}`;
    const oversizedReferrer = `https://partner.example.com/${'b'.repeat(1000)}`;
    const oversizedToken = 'c'.repeat(5000);

    await service.createLead({
      name: 'Anna',
      phone: '+7 (999) 111 22 33',
      ip: '127.0.0.1',
      userAgent: oversizedUserAgent,
      first_referrer: oversizedReferrer,
      smartcaptcha_token: oversizedToken,
    });

    expect(repository.insertLead).toHaveBeenCalledWith(
      expect.objectContaining({
        userAgent: expect.any(String),
        firstReferrer: expect.any(String),
      }),
    );

    const insertCall = vi.mocked(repository.insertLead).mock.calls[0]?.[0] as {
      userAgent: string | null;
      firstReferrer: string | null;
    };

    expect(insertCall.userAgent?.length).toBeLessThanOrEqual(500);
    expect(insertCall.firstReferrer?.length).toBeLessThanOrEqual(500);
    expect(smartCaptchaVerifier.verify).toHaveBeenCalledWith({
      token: expect.any(String),
      remoteIp: '127.0.0.1',
    });

    const verifyCall = smartCaptchaVerifier.verify.mock.calls[0]?.[0] as {
      token: string | null;
    };

    expect(verifyCall.token?.length).toBeLessThanOrEqual(2048);
  });

  test('stores honeypot submissions as spam and skips VK delivery', async () => {
    const repository = createRepository({
      insertLead: vi.fn().mockReturnValue(20),
    });
    const vkAdapter = createVkAdapter({
      sendLeadNotification: vi.fn(),
    });

    const service = createLeadService({
      repository,
      vkAdapter,
      nowFactory: () => new Date('2026-04-18T12:00:00.000Z'),
    });

    const response = await service.createLead({
      name: 'Anna',
      phone: '+7 (999) 111 22 33',
      ip: '127.0.0.1',
      userAgent: 'vitest',
      company: 'bot company',
    } as Parameters<typeof service.createLead>[0] & { company: string });

    expect(response).toMatchObject({
      ok: true,
      accepted: false,
      vkSendStatus: 'skipped',
    });
    expect(response.id).toBeUndefined();
    expect(repository.insertLead).not.toHaveBeenCalled();
    expect(vkAdapter.sendLeadNotification).not.toHaveBeenCalled();
  });

  test('stores too-fast submissions as spam and skips VK delivery', async () => {
    const repository = createRepository({
      insertLead: vi.fn().mockReturnValue(21),
    });
    const vkAdapter = createVkAdapter({
      sendLeadNotification: vi.fn(),
    });

    const service = createLeadService({
      repository,
      vkAdapter,
      nowFactory: () => new Date('2026-04-18T12:00:01.000Z'),
    });

    const response = await service.createLead({
      name: 'Anna',
      phone: '+7 (999) 111 22 33',
      ip: '127.0.0.1',
      userAgent: 'vitest',
      form_started_at: String(new Date('2026-04-18T12:00:00.000Z').getTime()),
    } as Parameters<typeof service.createLead>[0] & { form_started_at: string });

    expect(response).toMatchObject({
      ok: true,
      accepted: false,
      vkSendStatus: 'skipped',
    });
    expect(repository.insertLead).not.toHaveBeenCalled();
    expect(vkAdapter.sendLeadNotification).not.toHaveBeenCalled();
  });

  test('deduplicates recent leads with the same normalized phone and skips VK delivery', async () => {
    const repository = createRepository({
      findRecentLeadByPhone: vi.fn().mockReturnValue({ id: 10 }),
      insertLead: vi.fn().mockReturnValue(22),
    });
    const vkAdapter = createVkAdapter({
      sendLeadNotification: vi.fn(),
    });

    const service = createLeadService({
      repository,
      vkAdapter,
      nowFactory: () => new Date('2026-04-18T12:00:00.000Z'),
    });

    const response = await service.createLead({
      name: 'Anna',
      phone: '+7 (999) 111 22 33',
      ip: '127.0.0.1',
      userAgent: 'vitest',
    });

    expect(response).toMatchObject({
      ok: true,
      accepted: false,
      vkSendStatus: 'skipped',
    });
    expect(repository.findRecentLeadByPhone).toHaveBeenCalledWith(
      expect.objectContaining({
        phone: '+7 (999) 111 22 33',
      }),
    );
    expect(response.id).toBeUndefined();
    expect(repository.insertLead).not.toHaveBeenCalled();
    expect(vkAdapter.sendLeadNotification).not.toHaveBeenCalled();
  });

  test('verifies Yandex SmartCaptcha server-side and stores the verification result', async () => {
    const repository = createRepository({
      insertLead: vi.fn().mockReturnValue(23),
    });
    const vkAdapter = createVkAdapter();
    const smartCaptchaVerifier = {
      verify: vi.fn().mockResolvedValue({
        configured: true,
        verified: true,
        reason: null,
      }),
    };

    const service = createLeadService({
      repository,
      vkAdapter,
      smartCaptchaVerifier,
      nowFactory: () => new Date('2026-04-18T12:00:00.000Z'),
    } as Parameters<typeof createLeadService>[0] & { smartCaptchaVerifier: typeof smartCaptchaVerifier });

    await service.createLead({
      name: 'Anna',
      phone: '+7 (999) 111 22 33',
      ip: '127.0.0.1',
      userAgent: 'vitest',
      smartcaptcha_token: 'verified-token',
    } as Parameters<typeof service.createLead>[0] & { smartcaptcha_token: string });

    expect(smartCaptchaVerifier.verify).toHaveBeenCalledWith({
      token: 'verified-token',
      remoteIp: '127.0.0.1',
    });
    expect(repository.insertLead).toHaveBeenCalledWith(
      expect.objectContaining({
        spamCheckResult: 'passed',
        spamReason: null,
        smartCaptchaVerified: true,
      }),
    );
    expect(vkAdapter.sendLeadNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        spamCheckResult: 'passed',
        spamReason: null,
        smartCaptchaVerified: true,
      }),
    );
  });

  test('marks configured SmartCaptcha verification failures as spam and skips VK delivery', async () => {
    const repository = createRepository({
      insertLead: vi.fn().mockReturnValue(24),
    });
    const vkAdapter = createVkAdapter({
      sendLeadNotification: vi.fn(),
    });
    const smartCaptchaVerifier = {
      verify: vi.fn().mockResolvedValue({
        configured: true,
        verified: false,
        reason: 'smartcaptcha_missing',
      }),
    };

    const service = createLeadService({
      repository,
      vkAdapter,
      smartCaptchaVerifier,
      nowFactory: () => new Date('2026-04-18T12:00:00.000Z'),
    } as Parameters<typeof createLeadService>[0] & { smartCaptchaVerifier: typeof smartCaptchaVerifier });

    const response = await service.createLead({
      name: 'Anna',
      phone: '+7 (999) 111 22 33',
      ip: '127.0.0.1',
      userAgent: 'vitest',
      smartcaptcha_token: '',
    } as Parameters<typeof service.createLead>[0] & { smartcaptcha_token: string });

    expect(response).toMatchObject({
      ok: true,
      accepted: false,
      vkSendStatus: 'skipped',
    });
    expect(response.id).toBeUndefined();
    expect(repository.insertLead).not.toHaveBeenCalled();
    expect(vkAdapter.sendLeadNotification).not.toHaveBeenCalled();
  });

  test('treats unconfigured SmartCaptcha as blocking when captcha is required', async () => {
    const repository = createRepository();
    const vkAdapter = createVkAdapter({
      sendLeadNotification: vi.fn(),
    });
    const smartCaptchaVerifier = {
      verify: vi.fn().mockResolvedValue({
        configured: false,
        verified: false,
        reason: 'smartcaptcha_not_configured',
      }),
    };

    const service = createLeadService({
      repository,
      vkAdapter,
      smartCaptchaVerifier,
      smartCaptchaRequired: true,
      nowFactory: () => new Date('2026-04-18T12:00:00.000Z'),
    } as Parameters<typeof createLeadService>[0] & {
      smartCaptchaVerifier: typeof smartCaptchaVerifier;
      smartCaptchaRequired: boolean;
    });

    const response = await service.createLead({
      name: 'Anna',
      phone: '+7 (999) 111 22 33',
      ip: '127.0.0.1',
      userAgent: 'vitest',
      smartcaptcha_token: 'verified-token',
    } as Parameters<typeof service.createLead>[0] & { smartcaptcha_token: string });

    expect(response).toMatchObject({
      ok: true,
      accepted: false,
      vkSendStatus: 'skipped',
    });
    expect(response.id).toBeUndefined();
    expect(repository.insertLead).not.toHaveBeenCalled();
    expect(vkAdapter.sendLeadNotification).not.toHaveBeenCalled();
  });
});
