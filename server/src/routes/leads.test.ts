import request from 'supertest';
import { describe, expect, test, vi } from 'vitest';
import { createApp } from '../app';
import { createDatabase } from '../db/client';
import { createLeadsRepository } from '../db/leadsRepository';
import { runMigrations } from '../db/migrate';
import { createLeadService } from '../services/leadService';

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
        name: 'Иван',
        phone: '+7 (999) 111 22 33',
        firstLeadSource: 'Google поиск',
        lastLeadSource: 'Яндекс поиск',
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      ok: true,
      vkSendStatus: 'failed',
    });

    const lead = repository.findById(response.body.id as number);
    expect(lead).toMatchObject({
      name: 'Иван',
      phone: '+7 (999) 111 22 33',
      firstTrafficSource: 'Google поиск',
      lastTrafficSource: 'Яндекс поиск',
      vkSendStatus: 'failed',
      vkSendError: 'Access denied',
    });
  });

  test('blocks repeated requests over the rate limit', async () => {
    const db = createDatabase(':memory:');
    runMigrations(db);

    const app = createApp({
      leadService: createLeadService({
        repository: createLeadsRepository(db),
        vkAdapter: {
          sendLeadNotification: vi.fn().mockResolvedValue({
            status: 'skipped',
            error: null,
          }),
        },
      }),
      rateLimitWindowMs: 60000,
      rateLimitMaxRequests: 1,
    });

    const payload = {
      name: 'Иван',
      phone: '+7 (999) 111 22 33',
    };

    const first = await request(app).post('/api/leads').set('X-Forwarded-For', '1.2.3.4').send(payload);
    const second = await request(app).post('/api/leads').set('X-Forwarded-For', '1.2.3.4').send(payload);

    expect(first.status).toBe(201);
    expect(second.status).toBe(429);
    expect(second.body.ok).toBe(false);
  });
});
