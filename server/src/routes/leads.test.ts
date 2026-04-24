import request from 'supertest';
import { describe, expect, test, vi } from 'vitest';
import { createApp } from '../app';
import { createOriginPolicy } from '../config/originPolicy';
import { createDatabase } from '../db/client';
import { createLeadsRepository } from '../db/leadsRepository';
import { runMigrations } from '../db/migrate';
import { createLeadService } from '../services/leadService';

const FIRST_PARTY_ORIGIN = 'https://party-everyday.ru';

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
      originPolicy: createOriginPolicy({}),
      leadsRateLimitWindowMs: 60000,
      leadsRateLimitMaxRequests: 5,
      healthRateLimitWindowMs: 60000,
      healthRateLimitMaxRequests: 60,
    });

    const response = await request(app).get('/healthz');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      ok: true,
      service: 'server',
    });
  });

  test('returns service health payload through the /api prefix', async () => {
    const db = createDatabase(':memory:');
    runMigrations(db);

    const app = createApp({
      leadService: createLeadService({
        repository: createLeadsRepository(db),
        vkAdapter: {
          sendLeadNotification: vi.fn(),
        },
      }),
      originPolicy: createOriginPolicy({}),
      leadsRateLimitWindowMs: 60000,
      leadsRateLimitMaxRequests: 5,
      healthRateLimitWindowMs: 60000,
      healthRateLimitMaxRequests: 60,
    });

    const response = await request(app).get('/api/healthz');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      ok: true,
      service: 'server',
    });
  });
});

describe('POST /api/leads', () => {
  test('ignores spoofed x-forwarded-for when trust proxy is disabled', async () => {
    const createLead = vi.fn().mockResolvedValue({
      ok: true,
      accepted: true,
      vkSendStatus: 'skipped',
      message: 'stored',
    });

    const app = createApp({
      leadService: {
        createLead,
      },
      originPolicy: createOriginPolicy({}),
      leadsRateLimitWindowMs: 60000,
      leadsRateLimitMaxRequests: 5,
      healthRateLimitWindowMs: 60000,
      healthRateLimitMaxRequests: 60,
      trustProxy: false,
    });

    const response = await request(app)
      .post('/api/leads')
      .set('Origin', FIRST_PARTY_ORIGIN)
      .set('X-Forwarded-For', '8.8.8.8')
      .send({
        name: 'Anna',
        phone: '+7 (999) 111 22 33',
      });

    expect(response.status).toBe(201);
    expect(createLead).toHaveBeenCalledWith(
      expect.objectContaining({
        ip: expect.not.stringMatching(/^8\.8\.8\.8$/),
      }),
    );
  });

  test('uses forwarded ip when trust proxy is configured for loopback', async () => {
    const createLead = vi.fn().mockResolvedValue({
      ok: true,
      accepted: true,
      vkSendStatus: 'skipped',
      message: 'stored',
    });

    const app = createApp({
      leadService: {
        createLead,
      },
      originPolicy: createOriginPolicy({}),
      leadsRateLimitWindowMs: 60000,
      leadsRateLimitMaxRequests: 5,
      healthRateLimitWindowMs: 60000,
      healthRateLimitMaxRequests: 60,
      trustProxy: 'loopback',
    });

    const response = await request(app)
      .post('/api/leads')
      .set('Origin', FIRST_PARTY_ORIGIN)
      .set('X-Forwarded-For', '8.8.8.8')
      .send({
        name: 'Anna',
        phone: '+7 (999) 111 22 33',
      });

    expect(response.status).toBe(201);
    expect(createLead).toHaveBeenCalledWith(
      expect.objectContaining({
        ip: '8.8.8.8',
      }),
    );
  });

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
      originPolicy: createOriginPolicy({}),
      leadsRateLimitWindowMs: 60000,
      leadsRateLimitMaxRequests: 5,
      healthRateLimitWindowMs: 60000,
      healthRateLimitMaxRequests: 60,
    });

    const response = await request(app)
      .post('/api/leads')
      .set('Origin', FIRST_PARTY_ORIGIN)
      .send({
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
      originPolicy: createOriginPolicy({}),
      leadsRateLimitWindowMs: 60000,
      leadsRateLimitMaxRequests: 5,
      healthRateLimitWindowMs: 60000,
      healthRateLimitMaxRequests: 60,
    });

    const response = await request(app)
      .post('/api/leads')
      .set('Origin', FIRST_PARTY_ORIGIN)
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
      accepted: true,
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
      originPolicy: createOriginPolicy({}),
      leadsRateLimitWindowMs: 60000,
      leadsRateLimitMaxRequests: 5,
      healthRateLimitWindowMs: 60000,
      healthRateLimitMaxRequests: 60,
    });

    const response = await request(app)
      .post('/api/leads')
      .set('Origin', FIRST_PARTY_ORIGIN)
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
    expect(response.body).toMatchObject({
      ok: true,
      accepted: true,
    });
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

  test('rejects lead submissions from disallowed origins with 403 before the service is called', async () => {
    const createLead = vi.fn();

    const app = createApp({
      leadService: {
        createLead,
      },
      originPolicy: createOriginPolicy({}),
      leadsRateLimitWindowMs: 60000,
      leadsRateLimitMaxRequests: 10,
      healthRateLimitWindowMs: 60000,
      healthRateLimitMaxRequests: 60,
    });

    const response = await request(app)
      .post('/api/leads')
      .set('Origin', 'https://evil.example')
      .send({
        name: 'Anna',
        phone: '+7 (999) 111 22 33',
      });

    expect(response.status).toBe(403);
    expect(createLead).not.toHaveBeenCalled();
  });

  test('accepts lead submissions from an allowed production origin', async () => {
    const createLead = vi.fn().mockResolvedValue({
      ok: true,
      accepted: true,
      vkSendStatus: 'skipped',
      message: 'stored',
    });

    const app = createApp({
      leadService: {
        createLead,
      },
      originPolicy: createOriginPolicy({}),
      leadsRateLimitWindowMs: 60000,
      leadsRateLimitMaxRequests: 10,
      healthRateLimitWindowMs: 60000,
      healthRateLimitMaxRequests: 60,
    });

    const response = await request(app)
      .post('/api/leads')
      .set('Origin', FIRST_PARTY_ORIGIN)
      .send({
        name: 'Anna',
        phone: '+7 (999) 111 22 33',
      });

    expect(response.status).toBe(201);
    expect(createLead).toHaveBeenCalledTimes(1);
  });

  test('accepts lead submissions when referer is first-party and origin is absent', async () => {
    const createLead = vi.fn().mockResolvedValue({
      ok: true,
      accepted: true,
      vkSendStatus: 'skipped',
      message: 'stored',
    });

    const app = createApp({
      leadService: {
        createLead,
      },
      originPolicy: createOriginPolicy({}),
      leadsRateLimitWindowMs: 60000,
      leadsRateLimitMaxRequests: 10,
      healthRateLimitWindowMs: 60000,
      healthRateLimitMaxRequests: 60,
    });

    const response = await request(app)
      .post('/api/leads')
      .set('Referer', 'https://party-everyday.ru/services/')
      .send({
        name: 'Anna',
        phone: '+7 (999) 111 22 33',
      });

    expect(response.status).toBe(201);
    expect(createLead).toHaveBeenCalledTimes(1);
  });

  test('returns 429 for lead requests above the hard limit', async () => {
    const createLead = vi.fn().mockResolvedValue({
      ok: true,
      accepted: true,
      vkSendStatus: 'skipped',
      message: 'stored',
    });

    const app = createApp({
      leadService: {
        createLead,
      },
      originPolicy: createOriginPolicy({}),
      leadsRateLimitWindowMs: 60000,
      leadsRateLimitMaxRequests: 1,
      healthRateLimitWindowMs: 60000,
      healthRateLimitMaxRequests: 60,
      trustProxy: 'loopback',
    });

    const first = await request(app)
      .post('/api/leads')
      .set('Origin', FIRST_PARTY_ORIGIN)
      .set('X-Forwarded-For', '1.2.3.4')
      .send({
        name: 'Anna',
        phone: '+7 (999) 111 22 33',
      });

    const second = await request(app)
      .post('/api/leads')
      .set('Origin', FIRST_PARTY_ORIGIN)
      .set('X-Forwarded-For', '1.2.3.4')
      .send({
        name: 'Maria',
        phone: '+7 (999) 111 22 34',
      });

    expect(first.status).toBe(201);
    expect(second.status).toBe(429);
    expect(createLead).toHaveBeenCalledTimes(1);
  });

  test('rate limits health endpoints independently from lead submissions', async () => {
    const db = createDatabase(':memory:');
    runMigrations(db);

    const app = createApp({
      leadService: createLeadService({
        repository: createLeadsRepository(db),
        vkAdapter: {
          sendLeadNotification: vi.fn(),
        },
      }),
      originPolicy: createOriginPolicy({}),
      leadsRateLimitWindowMs: 60000,
      leadsRateLimitMaxRequests: 10,
      healthRateLimitWindowMs: 60000,
      healthRateLimitMaxRequests: 1,
      trustProxy: 'loopback',
    });

    const first = await request(app).get('/healthz').set('X-Forwarded-For', '1.2.3.4');
    const second = await request(app).get('/healthz').set('X-Forwarded-For', '1.2.3.4');

    expect(first.status).toBe(200);
    expect(second.status).toBe(429);
  });
});
