import { Router, type Request, type Response } from 'express';
import { logger } from '../utils/logger';
import { getRequestIp } from '../utils/requestMeta';

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

export function createLeadsRouter({ leadService }: { leadService: LeadService }) {
  const router = Router();

  router.post('/', async (request: Request, response: Response) => {
    try {
      const result = await leadService.createLead({
        name: typeof request.body?.name === 'string' ? request.body.name : '',
        phone: typeof request.body?.phone === 'string' ? request.body.phone : '',
        ip: getRequestIp(request),
        userAgent: typeof request.headers['user-agent'] === 'string' ? request.headers['user-agent'] : null,
        firstLeadSource: typeof request.body?.firstLeadSource === 'string' ? request.body.firstLeadSource : undefined,
        lastLeadSource: typeof request.body?.lastLeadSource === 'string' ? request.body.lastLeadSource : undefined,
      });

      if (!result.ok) {
        response.status(400).json(result);
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
