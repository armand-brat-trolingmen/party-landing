import { describe, expect, test, vi } from 'vitest';
import { createLeadService } from './leadService';

describe('leadService', () => {
  test('stores all configured peer_ids and passes lead sources into the VK notification payload', async () => {
    const repository = {
      insertLead: vi.fn().mockReturnValue(17),
      updateVkStatus: vi.fn(),
    };

    const vkAdapter = {
      sendLeadNotification: vi.fn().mockResolvedValue({
        status: 'success',
        error: null,
      }),
      getDefaultPeerIds: vi.fn().mockReturnValue(['2000000042', '2000000043']),
    };

    const service = createLeadService({
      repository,
      vkAdapter,
      nowFactory: () => new Date('2026-04-14T12:00:00+03:00'),
    });

    const response = await service.createLead({
      name: 'Анна',
      phone: '+7 (999) 111 22 33',
      ip: '127.0.0.1',
      userAgent: 'vitest',
      firstLeadSource: 'Google поиск',
      lastLeadSource: 'Яндекс поиск',
    });

    expect(response).toMatchObject({
      ok: true,
      id: 17,
      vkSendStatus: 'success',
    });
    expect(repository.insertLead).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Анна',
        phone: '+7 (999) 111 22 33',
        firstTrafficSource: 'Google поиск',
        lastTrafficSource: 'Яндекс поиск',
        vkPeerId: '2000000042,2000000043',
      }),
    );
    expect(vkAdapter.sendLeadNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Анна',
        phone: '+7 (999) 111 22 33',
        firstLeadSource: 'Google поиск',
        lastLeadSource: 'Яндекс поиск',
      }),
    );
  });
});
