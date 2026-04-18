import { Router, type Request, type Response } from 'express';
import { logger } from '../utils/logger';
import { getRequestIp } from '../utils/requestMeta';

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

function optionalString(value: unknown) {
  return typeof value === 'string' ? value : undefined;
}

function optionalStringOrNumber(value: unknown) {
  return typeof value === 'string' || typeof value === 'number' ? value : undefined;
}

export function createLeadsRouter({ leadService }: { leadService: LeadService }) {
  const router = Router();

  router.post('/', async (request: Request, response: Response<unknown, LeadRequestLocals>) => {
    try {
      const result = await leadService.createLead({
        name: typeof request.body?.name === 'string' ? request.body.name : '',
        phone: typeof request.body?.phone === 'string' ? request.body.phone : '',
        ip: getRequestIp(request),
        userAgent: typeof request.headers['user-agent'] === 'string' ? request.headers['user-agent'] : null,
        firstLeadSource: optionalString(request.body?.firstLeadSource),
        lastLeadSource: optionalString(request.body?.lastLeadSource),
        first_visit_at: optionalString(request.body?.first_visit_at),
        last_visit_at: optionalString(request.body?.last_visit_at),
        visits_count: optionalStringOrNumber(request.body?.visits_count),
        first_referrer: optionalString(request.body?.first_referrer),
        last_referrer: optionalString(request.body?.last_referrer),
        first_utm_source: optionalString(request.body?.first_utm_source),
        first_utm_medium: optionalString(request.body?.first_utm_medium),
        first_utm_campaign: optionalString(request.body?.first_utm_campaign),
        last_utm_source: optionalString(request.body?.last_utm_source),
        last_utm_medium: optionalString(request.body?.last_utm_medium),
        last_utm_campaign: optionalString(request.body?.last_utm_campaign),
        company: optionalString(request.body?.company),
        form_started_at: optionalString(request.body?.form_started_at),
        smartcaptcha_token: optionalString(request.body?.smartcaptcha_token),
        softRateLimitExceeded: Boolean(response.locals.softRateLimitExceeded),
      });

      if (!result.ok) {
        const { statusCode, ...payload } = result;
        response.status(statusCode ?? 400).json(payload);
        return;
      }

      response.status(201).json(result);
    } catch (error) {
      logger.error('Lead request failed', error);
      response.status(500).json({
        ok: false,
        message: 'Не удалось сохранить заявку. Попробуйте позже.',
      });
    }
  });

  return router;
}
