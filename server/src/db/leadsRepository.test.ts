import { describe, expect, test } from 'vitest';
import { createDatabase } from './client';
import { createLeadsRepository } from './leadsRepository';
import { runMigrations } from './migrate';

describe('leadsRepository', () => {
  test('inserts a lead row with attribution data and updates vk delivery metadata', () => {
    const db = createDatabase(':memory:');
    runMigrations(db);
    const repository = createLeadsRepository(db);

    const leadId = repository.insertLead({
      name: 'Иван',
      phone: '+7 (999) 111 22 33',
      ip: '127.0.0.1',
      userAgent: 'vitest',
      firstTrafficSource: 'Google поиск',
      lastTrafficSource: 'Яндекс поиск',
      vkPeerId: '2000000042',
      vkSendStatus: 'skipped',
      vkSendError: null,
    });

    repository.updateVkStatus({
      id: leadId,
      vkSendStatus: 'failed',
      vkSendError: 'Access denied',
    });

    const lead = repository.findById(leadId);

    expect(lead).toMatchObject({
      id: leadId,
      name: 'Иван',
      phone: '+7 (999) 111 22 33',
      ip: '127.0.0.1',
      userAgent: 'vitest',
      firstTrafficSource: 'Google поиск',
      lastTrafficSource: 'Яндекс поиск',
      vkPeerId: '2000000042',
      vkSendStatus: 'failed',
      vkSendError: 'Access denied',
    });
    expect(lead?.createdAt).toBeTruthy();
  });
});
