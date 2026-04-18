import { describe, expect, test } from 'vitest';
import { createDatabase } from './client';
import { createLeadsRepository } from './leadsRepository';
import { runMigrations } from './migrate';

describe('leadsRepository', () => {
  test('inserts a lead row with attribution, spam data and updates vk delivery metadata', () => {
    const db = createDatabase(':memory:');
    runMigrations(db);
    const repository = createLeadsRepository(db);

    const leadId = repository.insertLead({
      name: 'Anna',
      phone: '+7 (999) 111 22 33',
      ip: '127.0.0.1',
      userAgent: 'vitest',
      firstTrafficSource: 'Google search',
      lastTrafficSource: 'Yandex search',
      spamCheckResult: 'spam',
      spamReason: 'honeypot_filled',
      smartCaptchaVerified: false,
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
      name: 'Anna',
      phone: '+7 (999) 111 22 33',
      ip: '127.0.0.1',
      userAgent: 'vitest',
      firstTrafficSource: 'Google search',
      lastTrafficSource: 'Yandex search',
      spamCheckResult: 'spam',
      spamReason: 'honeypot_filled',
      smartCaptchaVerified: false,
      vkPeerId: '2000000042',
      vkSendStatus: 'failed',
      vkSendError: 'Access denied',
    });
    expect(lead?.createdAt).toBeTruthy();
  });

  test('counts leads from the same ip inside the requested utc window', () => {
    const db = createDatabase(':memory:');
    runMigrations(db);
    const repository = createLeadsRepository(db);

    repository.insertLead({
      name: 'Anna',
      phone: '+7 (999) 111 22 33',
      ip: '127.0.0.1',
      userAgent: 'vitest',
      firstTrafficSource: null,
      lastTrafficSource: null,
      vkPeerId: null,
      vkSendStatus: 'skipped',
      vkSendError: null,
    });

    repository.insertLead({
      name: 'Maria',
      phone: '+7 (999) 111 22 34',
      ip: '127.0.0.1',
      userAgent: 'vitest',
      firstTrafficSource: null,
      lastTrafficSource: null,
      vkPeerId: null,
      vkSendStatus: 'skipped',
      vkSendError: null,
    });

    repository.insertLead({
      name: 'Olga',
      phone: '+7 (999) 111 22 35',
      ip: '127.0.0.2',
      userAgent: 'vitest',
      firstTrafficSource: null,
      lastTrafficSource: null,
      vkPeerId: null,
      vkSendStatus: 'skipped',
      vkSendError: null,
    });

    const count = repository.countLeadsByIpBetween({
      ip: '127.0.0.1',
      createdAtFrom: '2000-01-01 00:00:00',
      createdAtTo: '2999-01-01 00:00:00',
    });

    expect(count).toBe(2);
  });

  test('finds a recent lead by normalized phone for deduplication', () => {
    const db = createDatabase(':memory:');
    runMigrations(db);
    const repository = createLeadsRepository(db);

    const leadId = repository.insertLead({
      name: 'Anna',
      phone: '+7 (999) 111 22 33',
      ip: '127.0.0.1',
      userAgent: 'vitest',
      firstTrafficSource: null,
      lastTrafficSource: null,
      vkPeerId: null,
      vkSendStatus: 'skipped',
      vkSendError: null,
    });

    const lead = repository.findRecentLeadByPhone({
      phone: '+7 (999) 111 22 33',
      createdAtFrom: '2000-01-01 00:00:00',
    });

    expect(lead).toMatchObject({
      id: leadId,
      phone: '+7 (999) 111 22 33',
    });
  });

  test('inserts and reads first-party attribution fields', () => {
    const db = createDatabase(':memory:');
    runMigrations(db);
    const repository = createLeadsRepository(db);

    const leadId = repository.insertLead({
      name: 'Anna',
      phone: '+7 (999) 111-22-33',
      ip: '127.0.0.1',
      userAgent: 'vitest',
      firstTrafficSource: 'UTM: yandex / cpc / spring',
      lastTrafficSource: 'direct',
      firstVisitAt: '2026-04-01T10:00:00.000Z',
      lastVisitAt: '2026-04-02T10:00:00.000Z',
      visitsCount: 2,
      firstReferrer: 'direct',
      lastReferrer: 'direct',
      firstUtmSource: 'yandex',
      firstUtmMedium: 'cpc',
      firstUtmCampaign: 'spring',
      lastUtmSource: null,
      lastUtmMedium: null,
      lastUtmCampaign: null,
      vkPeerId: null,
      vkSendStatus: 'skipped',
      vkSendError: null,
    });

    expect(repository.findById(leadId)).toMatchObject({
      firstVisitAt: '2026-04-01T10:00:00.000Z',
      lastVisitAt: '2026-04-02T10:00:00.000Z',
      visitsCount: 2,
      firstReferrer: 'direct',
      lastReferrer: 'direct',
      firstUtmSource: 'yandex',
      firstUtmMedium: 'cpc',
      firstUtmCampaign: 'spring',
      lastUtmSource: null,
      lastUtmMedium: null,
      lastUtmCampaign: null,
      spamCheckResult: 'passed',
      spamReason: null,
      smartCaptchaVerified: false,
    });
  });
});
