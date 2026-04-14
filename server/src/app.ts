import express, { type NextFunction, type Request, type Response } from 'express';
import { createLeadsRouter } from './routes/leads';
import { logger } from './utils/logger';
import { createRateLimiter } from './utils/rateLimit';
import { getRequestIp } from './utils/requestMeta';

type LeadService = {
  createLead(input: {
    name: string;
    phone: string;
    ip: string | null;
    userAgent: string | null;
    firstLeadSource?: string;
    lastLeadSource?: string;
  }): Promise<{
    ok: boolean;
    id?: number;
    vkSendStatus?: 'success' | 'failed' | 'skipped';
    fieldErrors?: Partial<Record<'name' | 'phone', string>>;
    message?: string;
  }>;
};

export function createApp({
  leadService,
  rateLimitWindowMs,
  rateLimitMaxRequests,
}: {
  leadService: LeadService;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
}) {
  const app = express();
  const rateLimiter = createRateLimiter({
    windowMs: rateLimitWindowMs,
    maxRequests: rateLimitMaxRequests,
  });

  app.use(express.json());
  app.use('/api/leads', (request, response, next) => {
    const ip = getRequestIp(request);

    if (!rateLimiter.isAllowed(ip)) {
      response.status(429).json({
        ok: false,
        message: 'Слишком много запросов, попробуйте позже',
      });
      return;
    }

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
