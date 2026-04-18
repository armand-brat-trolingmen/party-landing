import request from 'supertest';
import { describe, expect, test, vi } from 'vitest';
import { createApp } from '../app';
import { createDatabase } from '../db/client';
import { createLeadsRepository } from '../db/leadsRepository';
import { runMigrations } from '../db/migrate';
import { createLeadService } from '../services/leadService';

describe('GET /healthz', () => {
  test('returns service health payload', async () => {
    const db = createDatabase(':memory:');
    runMigrations(db);

    const app = createApp({
      leadService: createLeadService({
        repository: createLeadsRepository(db),
        vkAdapter: {
          sendLeadNotification: vi.fn(),
        },
      }),
      rateLimitWindowMs: 60000,
      rateLimitMaxRequests: 5,
    });

    const response = await request(app).get('/healthz');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      ok: true,
      service: 'server',
    });
  });
});

describe('POST /api/leads', () => {
  test('returns 400 when payload is invalid', async () => {
    const db = createDatabase(':memory:');
    runMigrations(db);

    const app = createApp({
      leadService: createLeadService({
        repository: createLeadsRepository(db),
        vkAdapter: {
          sendLeadNotification: vi.fn(),
        },
      }),
      rateLimitWindowMs: 60000,
      rateLimitMaxRequests: 5,
    });

    const response = await request(app).post('/api/leads').send({
      name: '',
      phone: '',
    });

    expect(response.status).toBe(400);
    expect(response.body.ok).toBe(false);
    expect(response.body.fieldErrors.name).toBeDefined();
    expect(response.body.fieldErrors.phone).toBeDefined();
  });

  test('saves the lead with first and last source even when vk delivery fails', async () => {
    const db = createDatabase(':memory:');
    runMigrations(db);
    const repository = createLeadsRepository(db);

    const app = createApp({
      leadService: createLeadService({
        repository,
        vkAdapter: {
          sendLeadNotification: vi.fn().mockResolvedValue({
            status: 'failed',
            error: 'Access denied',
          }),
        },
      }),
      rateLimitWindowMs: 60000,
      rateLimitMaxRequests: 5,
    });

    const response = await request(app)
      .post('/api/leads')
      .set('User-Agent', 'vitest')
      .send({
        name: 'Anna',
        phone: '+7 (999) 111 22 33',
        firstLeadSource: 'Google search',
        lastLeadSource: 'Yandex search',
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      ok: true,
      vkSendStatus: 'failed',
    });

    const lead = repository.findById(response.body.id as number);
    expect(lead).toMatchObject({
      name: 'Anna',
      phone: '+7 (999) 111 22 33',
      firstTrafficSource: 'Google search',
      lastTrafficSource: 'Yandex search',
      spamCheckResult: 'passed',
      spamReason: null,
      smartCaptchaVerified: false,
      vkSendStatus: 'failed',
      vkSendError: 'Access denied',
    });
  });

  test('does not hard block repeated requests over the endpoint rate limit', async () => {
    const db = createDatabase(':memory:');
    runMigrations(db);
    const repository = createLeadsRepository(db);
    const vkAdapter = {
      sendLeadNotification: vi.fn().mockResolvedValue({
        status: 'success',
        error: null,
      }),
    };

    const app = createApp({
      leadService: createLeadService({
        repository,
        vkAdapter,
        nowFactory: () => new Date('2026-04-18T12:00:00.000Z'),
      }),
      rateLimitWindowMs: 60000,
      rateLimitMaxRequests: 1,
    });

    const first = await request(app).post('/api/leads').set('X-Forwarded-For', '1.2.3.4').send({
      name: 'Anna',
      phone: '+7 (999) 111 22 33',
    });
    const second = await request(app).post('/api/leads').set('X-Forwarded-For', '1.2.3.4').send({
      name: 'Maria',
      phone: '+7 (999) 111 22 34',
    });

    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    expect(second.body.ok).toBe(true);

    const secondLead = repository.findById(second.body.id as number);
    expect(secondLead).toMatchObject({
      spamCheckResult: 'spam',
      spamReason: 'soft_rate_limit',
      vkSendStatus: 'skipped',
    });
    expect(vkAdapter.sendLeadNotification).toHaveBeenCalledTimes(1);
  });

  test('accepts first-party attribution and anti-spam fields in the lead payload', async () => {
    const db = createDatabase(':memory:');
    runMigrations(db);
    const repository = createLeadsRepository(db);

    const app = createApp({
      leadService: createLeadService({
        repository,
        vkAdapter: {
          sendLeadNotification: vi.fn().mockResolvedValue({
            status: 'skipped',
            error: null,
          }),
        },
      }),
      rateLimitWindowMs: 60000,
      rateLimitMaxRequests: 5,
    });

    const response = await request(app)
      .post('/api/leads')
      .send({
        name: 'Anna',
        phone: '+7 (999) 111-22-33',
        firstLeadSource: 'UTM: yandex / cpc / spring',
        lastLeadSource: 'direct',
        first_visit_at: '2026-04-01T10:00:00.000Z',
        last_visit_at: '2026-04-02T10:00:00.000Z',
        visits_count: '2',
        first_referrer: 'direct',
        last_referrer: 'direct',
        first_utm_source: 'yandex',
        first_utm_medium: 'cpc',
        first_utm_campaign: 'spring',
        last_utm_source: '',
        last_utm_medium: '',
        last_utm_campaign: '',
        company: '',
        form_started_at: String(Date.now() - 10_000),
        smartcaptcha_token: '',
      });

    expect(response.status).toBe(201);
    expect(repository.findById(response.body.id as number)).toMatchObject({
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
