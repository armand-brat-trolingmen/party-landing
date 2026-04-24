import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { config as loadDotEnv } from 'dotenv';
import { createSmartCaptchaVerifier } from './adapters/smartCaptchaAdapter';
import { createVkAdapter } from './adapters/vkAdapter';
import { createApp } from './app';
import { createOriginPolicy } from './config/originPolicy';
import { parseTrustProxy } from './config/trustProxy';
import { createDatabase } from './db/client';
import { runMigrations } from './db/migrate';
import { createLeadsRepository } from './db/leadsRepository';
import { createLeadService } from './services/leadService';

const serverRoot = resolve(__dirname, '..');

function parsePositiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

loadDotEnv({
  path: resolve(serverRoot, '.env'),
});

const port = Number.parseInt(process.env.PORT ?? '8787', 10);
const dbPath = resolve(serverRoot, process.env.DB_PATH ?? './data/leads.sqlite');
const leadsRateLimitWindowMs = parsePositiveInteger(
  process.env.LEADS_RATE_LIMIT_WINDOW_MS ?? process.env.RATE_LIMIT_WINDOW_MS,
  60000,
);
const leadsRateLimitMaxRequests = parsePositiveInteger(
  process.env.LEADS_RATE_LIMIT_MAX_REQUESTS ?? process.env.RATE_LIMIT_MAX_REQUESTS,
  10,
);
const healthRateLimitWindowMs = parsePositiveInteger(process.env.HEALTH_RATE_LIMIT_WINDOW_MS, 60000);
const healthRateLimitMaxRequests = parsePositiveInteger(process.env.HEALTH_RATE_LIMIT_MAX_REQUESTS, 60);
const smartCaptchaServerKey = process.env.SMARTCAPTCHA_SERVER_KEY ?? '';
const smartCaptchaRequired = (process.env.SMARTCAPTCHA_REQUIRED ?? 'true') === 'true';
const defaultPeerIds = [
  process.env.VK_DEFAULT_PEER_ID,
  process.env.VK_DEFAULT_PEER_ID_2,
  process.env.VK_DEFAULT_PEER_ID_3,
  process.env.VK_DEFAULT_PEER_ID_4,
].flatMap((peerId) => (typeof peerId === 'string' && peerId.trim() ? [peerId.trim()] : []));
const trustProxy = parseTrustProxy(process.env.TRUST_PROXY);
const originPolicy = createOriginPolicy({
  allowedOrigins: process.env.ALLOWED_ORIGINS,
});

if (smartCaptchaRequired && !smartCaptchaServerKey.trim()) {
  throw new Error('SMARTCAPTCHA_SERVER_KEY is required when SMARTCAPTCHA_REQUIRED=true');
}

mkdirSync(dirname(dbPath), { recursive: true });

const db = createDatabase(dbPath);
runMigrations(db);

const repository = createLeadsRepository(db);
const vkAdapter = createVkAdapter({
  enabled: (process.env.VK_ENABLED ?? 'true') === 'true',
  accessToken: process.env.VK_ACCESS_TOKEN ?? '',
  defaultPeerIds,
  apiVersion: process.env.VK_API_VERSION ?? '5.199',
});
const smartCaptchaVerifier = createSmartCaptchaVerifier({
  serverKey: smartCaptchaServerKey,
});
const leadService = createLeadService({
  repository,
  vkAdapter,
  smartCaptchaVerifier,
  smartCaptchaRequired,
});

const app = createApp({
  leadService,
  originPolicy,
  leadsRateLimitWindowMs,
  leadsRateLimitMaxRequests,
  healthRateLimitWindowMs,
  healthRateLimitMaxRequests,
  trustProxy,
});

app.listen(port, () => {
  console.log(`Lead server listening on port ${port}`);
});
