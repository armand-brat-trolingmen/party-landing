import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { config as loadDotEnv } from 'dotenv';
import { createSmartCaptchaVerifier } from './adapters/smartCaptchaAdapter';
import { createVkAdapter } from './adapters/vkAdapter';
import { createApp } from './app';
import { parseTrustProxy } from './config/trustProxy';
import { createDatabase } from './db/client';
import { runMigrations } from './db/migrate';
import { createLeadsRepository } from './db/leadsRepository';
import { createLeadService } from './services/leadService';

const serverRoot = resolve(__dirname, '..');

loadDotEnv({
  path: resolve(serverRoot, '.env'),
});

const port = Number.parseInt(process.env.PORT ?? '8787', 10);
const dbPath = resolve(serverRoot, process.env.DB_PATH ?? './data/leads.sqlite');
const rateLimitWindowMs = Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '600000', 10);
const rateLimitMaxRequests = Number.parseInt(process.env.RATE_LIMIT_MAX_REQUESTS ?? '20', 10);
const smartCaptchaServerKey = process.env.SMARTCAPTCHA_SERVER_KEY ?? '';
const smartCaptchaRequired = (process.env.SMARTCAPTCHA_REQUIRED ?? 'true') === 'true';
const defaultPeerIds = [
  process.env.VK_DEFAULT_PEER_ID,
  process.env.VK_DEFAULT_PEER_ID_2,
  process.env.VK_DEFAULT_PEER_ID_3,
  process.env.VK_DEFAULT_PEER_ID_4,
].flatMap((peerId) => (typeof peerId === 'string' && peerId.trim() ? [peerId.trim()] : []));
const trustProxy = parseTrustProxy(process.env.TRUST_PROXY);

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
  rateLimitWindowMs,
  rateLimitMaxRequests,
  trustProxy,
});

app.listen(port, () => {
  console.log(`Lead server listening on port ${port}`);
});
