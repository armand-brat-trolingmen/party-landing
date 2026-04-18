import { getStoredLeadAttribution, getStoredLeadSources } from '../trafficSource/attribution';
import type { LeadApiRequest, LeadApiResponse, LeadFieldErrors } from './types';

export class LeadApiError extends Error {
  fieldErrors?: LeadFieldErrors;

  constructor(message: string, fieldErrors?: LeadFieldErrors) {
    super(message);
    this.name = 'LeadApiError';
    this.fieldErrors = fieldErrors;
  }
}

export async function submitLead(payload: LeadApiRequest) {
  const leadAttribution = getStoredLeadAttribution();
  const leadSources = getStoredLeadSources();
  const requestPayload: LeadApiRequest = {
    ...payload,
    ...leadAttribution,
    ...(leadSources.firstLeadSource ? { firstLeadSource: leadSources.firstLeadSource } : {}),
    ...(leadSources.lastLeadSource ? { lastLeadSource: leadSources.lastLeadSource } : {}),
  };

  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestPayload),
  });

  const result = (await response.json().catch(() => null)) as LeadApiResponse | null;

  if (!response.ok || !result?.ok) {
    throw new LeadApiError(result?.message ?? 'Не удалось отправить заявку. Попробуйте еще раз.', result?.fieldErrors);
  }

  return result;
}
