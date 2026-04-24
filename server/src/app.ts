import express, { type NextFunction, type Request, type Response } from 'express';
import type { OriginPolicy } from './config/originPolicy';
import { createLeadsRouter } from './routes/leads';
import { logger } from './utils/logger';
import { createRateLimiter } from './utils/rateLimit';
import { getRequestIp } from './utils/requestMeta';
import { extractOriginHeader, pickRequestOrigin } from './utils/requestOrigin';

type LeadRequestLocals = {
  softRateLimitExceeded?: boolean;
};

type LeadService = {
  createLead(input: {
    name: string;
    phone: string;
    ip: string | null;
    userAgent: string | null;
    firstLeadSource?: string;
    lastLeadSource?: string;
    first_visit_at?: string;
    last_visit_at?: string;
    visits_count?: string | number;
    first_referrer?: string;
    last_referrer?: string;
    first_utm_source?: string;
    first_utm_medium?: string;
    first_utm_campaign?: string;
    last_utm_source?: string;
    last_utm_medium?: string;
    last_utm_campaign?: string;
    company?: string;
    form_started_at?: string;
    smartcaptcha_token?: string;
    softRateLimitExceeded?: boolean;
  }): Promise<{
    ok: boolean;
    accepted?: boolean;
    id?: number;
    vkSendStatus?: 'success' | 'failed' | 'skipped';
    fieldErrors?: Partial<Record<'name' | 'phone', string>>;
    message?: string;
    statusCode?: number;
  }>;
};

const GENERIC_SAVE_ERROR_MESSAGE = 'Не удалось сохранить заявку. Попробуйте позже.';
const GENERIC_FORBIDDEN_MESSAGE = 'Не удалось обработать запрос. Попробуйте позже.';
const GENERIC_RATE_LIMIT_MESSAGE = 'Слишком много запросов. Попробуйте позже.';

function applyCorsHeaders(response: Response, origin: string) {
  response.setHeader('Access-Control-Allow-Origin', origin);
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Max-Age', '600');
  response.append('Vary', 'Origin');
}

function sendRateLimitedResponse(response: Response, retryAfterSeconds: number | null) {
  if (retryAfterSeconds) {
    response.setHeader('Retry-After', String(retryAfterSeconds));
  }

  response.status(429).json({
    ok: false,
    message: GENERIC_RATE_LIMIT_MESSAGE,
  });
}

export function createApp({
  leadService,
  originPolicy,
  leadsRateLimitWindowMs,
  leadsRateLimitMaxRequests,
  healthRateLimitWindowMs,
  healthRateLimitMaxRequests,
  trustProxy = false,
}: {
  leadService: LeadService;
  originPolicy: OriginPolicy;
  leadsRateLimitWindowMs: number;
  leadsRateLimitMaxRequests: number;
  healthRateLimitWindowMs: number;
  healthRateLimitMaxRequests: number;
  trustProxy?: boolean | string | number | string[];
}) {
  const app = express();
  const leadsSoftRateLimiter = createRateLimiter({
    windowMs: leadsRateLimitWindowMs,
    maxRequests: leadsRateLimitMaxRequests,
  });
  const leadsHardRateLimiter = createRateLimiter({
    windowMs: leadsRateLimitWindowMs,
    maxRequests: leadsRateLimitMaxRequests,
  });
  const healthRateLimiter = createRateLimiter({
    windowMs: healthRateLimitWindowMs,
    maxRequests: healthRateLimitMaxRequests,
  });

  app.set('trust proxy', trustProxy);
  app.use(express.json({ limit: '32kb' }));

  const hardLimitByIp =
    (rateLimiter: ReturnType<typeof createRateLimiter>) =>
    (request: Request, response: Response, next: NextFunction) => {
      const decision = rateLimiter.check(getRequestIp(request));

      if (!decision.allowed) {
        sendRateLimitedResponse(response, decision.retryAfterSeconds);
        return;
      }

      next();
    };

  const sendHealth = (_request: Request, response: Response) => {
    response.status(200).json({
      ok: true,
      service: 'server',
    });
  };

  app.get('/healthz', hardLimitByIp(healthRateLimiter), sendHealth);
  app.get('/api/healthz', hardLimitByIp(healthRateLimiter), sendHealth);

  app.use('/api/leads', (request, response, next) => {
    const originHeader = extractOriginHeader(request.headers);

    if (originHeader && originPolicy.isAllowed(originHeader)) {
      applyCorsHeaders(response, originHeader);
    }

    if (request.method === 'OPTIONS') {
      if (originHeader && originPolicy.isAllowed(originHeader)) {
        response.status(204).end();
        return;
      }

      response.status(403).json({
        ok: false,
        message: GENERIC_FORBIDDEN_MESSAGE,
      });
      return;
    }

    next();
  });

  app.use('/api/leads', (request, response, next) => {
    if (request.method !== 'POST') {
      next();
      return;
    }

    const requestOrigin = pickRequestOrigin(request.headers);

    if (!requestOrigin.value || !originPolicy.isAllowed(requestOrigin.value)) {
      response.status(403).json({
        ok: false,
        message: GENERIC_FORBIDDEN_MESSAGE,
      });
      return;
    }

    next();
  });

  app.use('/api/leads', hardLimitByIp(leadsHardRateLimiter));

  app.use('/api/leads', (request, response: Response<unknown, LeadRequestLocals>, next) => {
    const ip = getRequestIp(request);

    response.locals.softRateLimitExceeded = !leadsSoftRateLimiter.isAllowed(ip);
    next();
  });

  app.use('/api/leads', createLeadsRouter({ leadService }));

  app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
    logger.error('Unhandled server error', error);
    response.status(500).json({
      ok: false,
      message: GENERIC_SAVE_ERROR_MESSAGE,
    });
  });

  return app;
}
