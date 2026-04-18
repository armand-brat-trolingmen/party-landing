import { describe, expect, test, vi } from 'vitest';
import { createVkAdapter } from './vkAdapter';

describe('vkAdapter', () => {
  test('sends the same lead notification to every configured peer_id', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        response: 551,
      }),
    });

    const adapter = createVkAdapter({
      enabled: true,
      accessToken: 'token',
      defaultPeerIds: ['2000000042', '2000000043', '2000000044', '2000000045'],
      apiVersion: '5.199',
      fetchImpl,
    });

    const result = await adapter.sendLeadNotification({
      name: 'Иван',
      phone: '+7 (999) 111 22 33',
      createdAt: '2026-04-14 12:00',
      firstLeadSource: 'Google поиск',
      lastLeadSource: 'Яндекс поиск',
    });

    expect(result).toEqual({ status: 'success', error: null });
    expect(fetchImpl).toHaveBeenCalledTimes(4);

    const sentPeerIds = fetchImpl.mock.calls.map((call) => {
      const body = String(call[1]?.body ?? '');
      return new URLSearchParams(body).get('peer_id');
    });

    expect(sentPeerIds).toEqual(['2000000042', '2000000043', '2000000044', '2000000045']);
  });

  test('returns failed and reports which peer_ids were not delivered', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: 551,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          error: { error_msg: 'Access denied' },
        }),
      });

    const adapter = createVkAdapter({
      enabled: true,
      accessToken: 'token',
      defaultPeerIds: ['2000000042', '2000000043'],
      apiVersion: '5.199',
      fetchImpl,
    });

    const result = await adapter.sendLeadNotification({
      name: 'Иван',
      phone: '+7 (999) 111 22 33',
      createdAt: '2026-04-14 12:00',
      firstLeadSource: 'Google поиск',
      lastLeadSource: 'Яндекс поиск',
    });

    expect(result.status).toBe('failed');
    expect(result.error).toContain('2000000043');
    expect(result.error).toMatch(/Access denied/i);
  });

  test('returns skipped when no peer_ids are configured', async () => {
    const adapter = createVkAdapter({
      enabled: true,
      accessToken: 'token',
      defaultPeerIds: [],
      apiVersion: '5.199',
    });

    const result = await adapter.sendLeadNotification({
      name: 'Иван',
      phone: '+7 (999) 111 22 33',
      createdAt: '2026-04-14 12:00',
      firstLeadSource: 'Google поиск',
      lastLeadSource: 'Яндекс поиск',
    });

    expect(result).toEqual({ status: 'skipped', error: null });
    expect(adapter.getDefaultPeerIds()).toEqual([]);
  });

  test('includes first-party attribution details in the VK message', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        response: 551,
      }),
    });

    const adapter = createVkAdapter({
      enabled: true,
      accessToken: 'token',
      defaultPeerIds: ['2000000042'],
      apiVersion: '5.199',
      fetchImpl,
    });

    await adapter.sendLeadNotification({
      name: 'Anna',
      phone: '+7 (999) 111-22-33',
      createdAt: '2026-04-14 12:00',
      firstLeadSource: 'UTM: yandex / cpc / spring',
      lastLeadSource: 'direct',
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
      spamCheckResult: 'passed',
      spamReason: null,
      smartCaptchaVerified: true,
    } as Parameters<typeof adapter.sendLeadNotification>[0] & {
      spamCheckResult: 'passed';
      spamReason: null;
      smartCaptchaVerified: true;
    });

    const body = String(fetchImpl.mock.calls[0]?.[1]?.body ?? '');
    const message = new URLSearchParams(body).get('message');

    expect(message).toContain('first_visit_at: 2026-04-01T10:00:00.000Z');
    expect(message).toContain('visits_count: 2');
    expect(message).toContain('last_referrer: https://partner.example.com/campaign');
    expect(message).toContain('first_utm_campaign: spring');
    expect(message).toContain('spam_check_result: passed');
    expect(message).toContain('smartcaptcha_verified: true');
  });
});
