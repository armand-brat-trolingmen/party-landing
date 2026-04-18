import express, { type NextFunction, type Request, type Response } from 'express';
import { createLeadsRouter } from './routes/leads';
import { logger } from './utils/logger';
import { createRateLimiter } from './utils/rateLimit';
import { getRequestIp } from './utils/requestMeta';

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

export function createApp({
  leadService,
  rateLimitWindowMs,
  rateLimitMaxRequests,
  trustProxy = false,
}: {
  leadService: LeadService;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  trustProxy?: boolean | string | number | string[];
}) {
  const app = express();
  const rateLimiter = createRateLimiter({
    windowMs: rateLimitWindowMs,
    maxRequests: rateLimitMaxRequests,
  });

  app.set('trust proxy', trustProxy);
  app.use(express.json());
  const sendHealth = (_request: Request, response: Response) => {
    response.status(200).json({
      ok: true,
      service: 'server',
    });
  };

  app.get('/healthz', sendHealth);
  app.get('/api/healthz', sendHealth);
  app.use('/api/leads', (request, response: Response<unknown, LeadRequestLocals>, next) => {
    const ip = getRequestIp(request);

    response.locals.softRateLimitExceeded = !rateLimiter.isAllowed(ip);
    next();
  });
  app.use('/api/leads', createLeadsRouter({ leadService }));
  app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
    logger.error('Unhandled server error', error);
    response.status(500).json({
      ok: false,
      message: 'Не удалось сохранить заявку. Попробуйте позже.',
    });
  });

  return app;
}
