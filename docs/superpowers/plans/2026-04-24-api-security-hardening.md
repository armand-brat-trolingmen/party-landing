# API Security Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden the lead API perimeter so only first-party origins can submit forms, abusive traffic is stopped before business logic, payload handling is tightened, and client-visible errors stay generic.

**Architecture:** Add a small config layer for allowed origins and rate limits, enforce origin/referrer and hard rate limiting in `createApp`, keep the existing lead service anti-spam logic as a second line of defense, and tighten validation/normalization without changing the current VK multi-peer delivery model.

**Tech Stack:** Node.js 22, Express 5, TypeScript, Vitest, better-sqlite3

---

## File Structure

- Create: `server/src/config/originPolicy.ts`
- Test: `server/src/config/originPolicy.test.ts`
- Create: `server/src/utils/requestOrigin.ts`
- Modify: `server/src/index.ts`
- Modify: `server/src/app.ts`
- Modify: `server/src/utils/rateLimit.ts`
- Modify: `server/src/routes/leads.test.ts`
- Modify: `server/src/services/leadService.ts`
- Modify: `server/src/services/leadService.test.ts`
- Modify: `server/src/validation/leadValidation.ts`
- Modify: `server/src/validation/leadValidation.test.ts`
- Modify: `server/.env.example`
- Modify: `server/README.md`
- Modify: `docs/deploy/dokploy-two-services.md`
- Modify: `docs/deploy/vps-party-everyday.ru.md`

`server/src/config/originPolicy.ts` owns origin allowlist parsing and matching rules.  
`server/src/utils/requestOrigin.ts` owns safe extraction/normalization of `Origin` and `Referer`.  
`server/src/app.ts` owns HTTP perimeter behavior: CORS, origin gate, hard rate limits, safe error responses.  
`server/src/utils/rateLimit.ts` owns generic in-memory limiter primitives that can serve multiple endpoint policies.  
`server/src/services/leadService.ts` remains business logic only and should no longer be treated as the first barrier against abusive traffic.  
`server/src/validation/leadValidation.ts` owns strict field validation and string length rules for user-facing fields.

### Task 1: Add Origin Policy Parsing And Matching

**Files:**
- Create: `server/src/config/originPolicy.ts`
- Test: `server/src/config/originPolicy.test.ts`
- Create: `server/src/utils/requestOrigin.ts`
- Modify: `server/src/index.ts`

- [ ] **Step 1: Write the failing tests for allowed origin parsing and local-dev matching**

```ts
import { describe, expect, test } from 'vitest';
import { createOriginPolicy } from './originPolicy';

describe('createOriginPolicy', () => {
  test('allows production origins and localhost/127.0.0.1 with any port', () => {
    const policy = createOriginPolicy({});

    expect(policy.isAllowed('https://party-everyday.ru')).toBe(true);
    expect(policy.isAllowed('https://www.party-everyday.ru')).toBe(true);
    expect(policy.isAllowed('http://localhost:5173')).toBe(true);
    expect(policy.isAllowed('http://127.0.0.1:4173')).toBe(true);
    expect(policy.isAllowed('https://evil.example')).toBe(false);
  });

  test('accepts comma-separated overrides without dropping safe defaults', () => {
    const policy = createOriginPolicy({
      allowedOrigins: 'https://party-everyday.ru,https://www.party-everyday.ru',
    });

    expect(policy.isAllowed('https://party-everyday.ru')).toBe(true);
    expect(policy.isAllowed('http://localhost:3000')).toBe(true);
  });
});
```

- [ ] **Step 2: Run the config tests and verify they fail**

Run: `npm --prefix server run test -- src/config/originPolicy.test.ts`  
Expected: FAIL because `originPolicy.ts` does not exist yet.

- [ ] **Step 3: Implement the smallest origin policy helper**

Create `server/src/config/originPolicy.ts` with:

- a `createOriginPolicy` factory;
- safe defaults for:
  - `https://party-everyday.ru`
  - `https://www.party-everyday.ru`
  - `http://localhost:*`
  - `http://127.0.0.1:*`
- support for optional env override via comma-separated `ALLOWED_ORIGINS`;
- compatibility behavior that keeps local dev allowed even when `ALLOWED_ORIGINS` is configured.

Also create `server/src/utils/requestOrigin.ts` with helpers like:

```ts
export function extractOriginHeader(headers: IncomingHttpHeaders): string | null
export function extractRefererOrigin(headers: IncomingHttpHeaders): string | null
export function pickRequestOrigin(headers: IncomingHttpHeaders): { value: string | null; source: 'origin' | 'referer' | 'none' }
```

Update `server/src/index.ts` to build the policy once and pass it into `createApp`.

- [ ] **Step 4: Re-run the config tests**

Run: `npm --prefix server run test -- src/config/originPolicy.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit the origin policy unit**

```bash
git add server/src/config/originPolicy.ts server/src/config/originPolicy.test.ts server/src/utils/requestOrigin.ts server/src/index.ts
git commit -m "feat: add api origin policy config"
```

### Task 2: Enforce Perimeter Middleware In Express

**Files:**
- Modify: `server/src/app.ts`
- Modify: `server/src/utils/rateLimit.ts`
- Modify: `server/src/routes/leads.test.ts`

- [ ] **Step 1: Write failing integration tests for origin gate, CORS, and hard rate limits**

Extend `server/src/routes/leads.test.ts` with:

```ts
test('rejects lead submissions from disallowed origins with 403', async () => {
  const createLead = vi.fn();
  const app = createApp({
    leadService: { createLead },
    originPolicy: createOriginPolicy({}),
    leadsRateLimitWindowMs: 60_000,
    leadsRateLimitMaxRequests: 10,
    healthRateLimitWindowMs: 60_000,
    healthRateLimitMaxRequests: 60,
  });

  const response = await request(app)
    .post('/api/leads')
    .set('Origin', 'https://evil.example')
    .send({ name: 'Anna', phone: '+7 (999) 111 22 33' });

  expect(response.status).toBe(403);
  expect(createLead).not.toHaveBeenCalled();
});

test('accepts lead submissions from allowed origins', async () => {
  const createLead = vi.fn().mockResolvedValue({ ok: true, accepted: true, vkSendStatus: 'skipped', message: 'stored' });
  const app = createApp({ ... });

  const response = await request(app)
    .post('/api/leads')
    .set('Origin', 'https://party-everyday.ru')
    .send({ name: 'Anna', phone: '+7 (999) 111 22 33' });

  expect(response.status).toBe(201);
});

test('uses referer origin when origin header is absent', async () => {
  const createLead = vi.fn().mockResolvedValue({ ok: true, accepted: true, vkSendStatus: 'skipped', message: 'stored' });
  const app = createApp({ ... });

  const response = await request(app)
    .post('/api/leads')
    .set('Referer', 'https://party-everyday.ru/services/')
    .send({ name: 'Anna', phone: '+7 (999) 111 22 33' });

  expect(response.status).toBe(201);
});

test('returns 429 for lead requests above the hard limit', async () => {
  const createLead = vi.fn().mockResolvedValue({ ok: true, accepted: true, vkSendStatus: 'skipped', message: 'stored' });
  const app = createApp({
    ...,
    leadsRateLimitWindowMs: 60_000,
    leadsRateLimitMaxRequests: 1,
  });

  await request(app)
    .post('/api/leads')
    .set('Origin', 'https://party-everyday.ru')
    .set('X-Forwarded-For', '1.2.3.4')
    .send({ name: 'Anna', phone: '+7 (999) 111 22 33' });

  const second = await request(app)
    .post('/api/leads')
    .set('Origin', 'https://party-everyday.ru')
    .set('X-Forwarded-For', '1.2.3.4')
    .send({ name: 'Anna', phone: '+7 (999) 111 22 33' });

  expect(second.status).toBe(429);
  expect(createLead).toHaveBeenCalledTimes(1);
});

test('rate limits health endpoints independently', async () => {
  const app = createApp({
    ...,
    healthRateLimitWindowMs: 60_000,
    healthRateLimitMaxRequests: 1,
  });

  const first = await request(app).get('/healthz').set('X-Forwarded-For', '1.2.3.4');
  const second = await request(app).get('/healthz').set('X-Forwarded-For', '1.2.3.4');

  expect(first.status).toBe(200);
  expect(second.status).toBe(429);
});
```

- [ ] **Step 2: Run the route integration tests and verify they fail for the expected reasons**

Run: `npm --prefix server run test -- src/routes/leads.test.ts`  
Expected: FAIL because `createApp` does not yet enforce origin policy or hard `429` behavior.

- [ ] **Step 3: Implement perimeter middleware with safe defaults**

Update `server/src/utils/rateLimit.ts` so it can answer more than a boolean. Minimal acceptable API:

```ts
type RateLimitDecision = { allowed: boolean; retryAfterSeconds: number | null };
```

Update `server/src/app.ts` to:

- accept `originPolicy`, `leadsRateLimitWindowMs`, `leadsRateLimitMaxRequests`, `healthRateLimitWindowMs`, `healthRateLimitMaxRequests`;
- configure `express.json({ limit: '32kb' })`;
- apply CORS headers only for allowed origins;
- answer `204` to valid `OPTIONS` requests and `403` to invalid ones for the protected API route;
- reject disallowed `Origin` / `Referer` for `POST /api/leads` with a generic `403`;
- apply hard `429` limit for `/api/leads`;
- apply hard `429` limit for `/healthz` and `/api/healthz`;
- preserve the current generic `500` message for unhandled errors.

In `server/src/index.ts`, wire config with backward compatibility:

- `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX_REQUESTS` continue to work as legacy input for leads if new env vars are absent;
- new preferred env names:
  - `LEADS_RATE_LIMIT_WINDOW_MS`
  - `LEADS_RATE_LIMIT_MAX_REQUESTS`
  - `HEALTH_RATE_LIMIT_WINDOW_MS`
  - `HEALTH_RATE_LIMIT_MAX_REQUESTS`
  - `ALLOWED_ORIGINS`

- [ ] **Step 4: Re-run the route integration tests**

Run: `npm --prefix server run test -- src/routes/leads.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit the HTTP perimeter changes**

```bash
git add server/src/app.ts server/src/utils/rateLimit.ts server/src/routes/leads.test.ts server/src/index.ts
git commit -m "feat: harden api perimeter and rate limits"
```

### Task 3: Tighten Lead Payload Validation And Sanitization

**Files:**
- Modify: `server/src/validation/leadValidation.ts`
- Modify: `server/src/validation/leadValidation.test.ts`
- Modify: `server/src/services/leadService.ts`
- Modify: `server/src/services/leadService.test.ts`

- [ ] **Step 1: Write failing tests for stricter input normalization**

Add tests in `server/src/validation/leadValidation.test.ts`:

```ts
test('rejects names longer than the configured limit', () => {
  const result = validateLeadInput({
    name: 'АлександраАлександровна',
    phone: '+7 (999) 111 22 33',
  });

  expect(result.ok).toBe(false);
});

test('rejects names with markup-like garbage', () => {
  const result = validateLeadInput({
    name: '<Anna>',
    phone: '+7 (999) 111 22 33',
  });

  expect(result.ok).toBe(false);
});
```

Add tests in `server/src/services/leadService.test.ts`:

```ts
test('truncates oversized attribution fields before storage and VK send', async () => {
  const repository = createRepository();
  const vkAdapter = createVkAdapter();
  const service = createLeadService({ repository, vkAdapter });

  await service.createLead({
    name: 'Anna',
    phone: '+7 (999) 111 22 33',
    ip: '127.0.0.1',
    userAgent: 'x'.repeat(5000),
    first_referrer: 'https://example.com/' + 'a'.repeat(5000),
    smartcaptcha_token: 't'.repeat(5000),
  });

  expect(repository.insertLead).toHaveBeenCalledWith(
    expect.objectContaining({
      firstReferrer: expect.any(String),
    }),
  );
});
```

- [ ] **Step 2: Run validation and service tests to verify they fail**

Run: `npm --prefix server run test -- src/validation/leadValidation.test.ts src/services/leadService.test.ts`  
Expected: FAIL because stricter rules and truncation contracts are not yet fully encoded.

- [ ] **Step 3: Implement minimal validation tightening**

Update `server/src/validation/leadValidation.ts`:

- keep the current business-friendly name and phone rules;
- make the limits explicit constants;
- reject markup-like garbage by continuing to allow only letters, spaces, and hyphens for names.

Update `server/src/services/leadService.ts`:

- centralize string normalization limits instead of scattering literals;
- cap `userAgent`, `referrer`, `utm`, `source`, and `smartcaptcha_token` lengths explicitly;
- ensure only normalized plain text reaches repository insert and VK payload creation;
- keep honeypot, timing-check, duplicate detection, and SmartCaptcha behavior intact.

- [ ] **Step 4: Re-run the validation and service tests**

Run: `npm --prefix server run test -- src/validation/leadValidation.test.ts src/services/leadService.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit the validation tightening**

```bash
git add server/src/validation/leadValidation.ts server/src/validation/leadValidation.test.ts server/src/services/leadService.ts server/src/services/leadService.test.ts
git commit -m "feat: tighten lead payload validation"
```

### Task 4: Update Env Surface, Docs, And Repo Hygiene

**Files:**
- Modify: `server/.env.example`
- Modify: `server/README.md`
- Modify: `docs/deploy/dokploy-two-services.md`
- Modify: `docs/deploy/vps-party-everyday.ru.md`

- [ ] **Step 1: Update env examples and deployment docs**

Document:

- `ALLOWED_ORIGINS`
- `LEADS_RATE_LIMIT_WINDOW_MS`
- `LEADS_RATE_LIMIT_MAX_REQUESTS`
- `HEALTH_RATE_LIMIT_WINDOW_MS`
- `HEALTH_RATE_LIMIT_MAX_REQUESTS`
- legacy compatibility with `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX_REQUESTS`

Keep examples as placeholders only. Do not place live values in tracked docs.

- [ ] **Step 2: Remove absolute local worktree links from `server/README.md`**

Replace links like:

```md
[server/.env.example](C:/Users/606ru/OneDrive/Desktop/але/site/.worktrees/...)
```

with repository-relative references or plain inline paths:

```md
`server/.env.example`
`server/data/leads.sqlite`
`.gitignore`
```

- [ ] **Step 3: Run the full backend verification**

Run:

```bash
npm --prefix server run test
npm --prefix server run build
git -C . grep -nI -E "(VK_ACCESS_TOKEN=|SMARTCAPTCHA_SERVER_KEY=|VITE_SMARTCAPTCHA_SITE_KEY=)" -- server/.env.example web/.env.example docs/deploy server/README.md
git -C . grep -nI --fixed-strings ".worktrees/" -- server/README.md
```

Expected:

- backend tests pass;
- backend build passes;
- tracked docs still contain placeholders only;
- `server/README.md` no longer references `.worktrees/`.

- [ ] **Step 4: Commit docs and config cleanup**

```bash
git add server/.env.example server/README.md docs/deploy/dokploy-two-services.md docs/deploy/vps-party-everyday.ru.md
git commit -m "docs: document hardened api defaults"
```

### Task 5: Final End-To-End Verification

**Files:**
- Review only

- [ ] **Step 1: Verify allowed-origin happy path**

Run backend locally and submit one valid lead through the local frontend or `supertest`.

Expected:

- valid request from allowed origin returns `201`;
- lead reaches service and repository once;
- VK adapter behavior remains unchanged.

- [ ] **Step 2: Verify blocked-origin and rate-limit behavior**

Manually or with tests confirm:

- foreign origin gets `403`;
- repeated `POST /api/leads` gets `429`;
- repeated `GET /healthz` gets `429`;
- blocked requests do not reach service logic.

- [ ] **Step 3: Review residual risk**

Confirm and document in the final handoff:

- CORS is only one layer, not the whole defense;
- origin/referrer checks reduce browser abuse but do not replace full auth;
- in-memory rate limiting is single-instance protection only.

- [ ] **Step 4: Final commit if any verification fixes were needed**

```bash
git add -A
git commit -m "test: finalize api hardening verification"
```

