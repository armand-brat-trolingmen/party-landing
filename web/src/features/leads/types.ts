export type LeadFormValues = {
  name: string;
  phone: string;
};

export type LeadFieldErrors = Partial<Record<keyof LeadFormValues, string>>;

export type LeadAttributionPayload = {
  first_visit_at?: string;
  last_visit_at?: string;
  visits_count?: string;
  first_referrer?: string;
  last_referrer?: string;
  first_utm_source?: string;
  first_utm_medium?: string;
  first_utm_campaign?: string;
  last_utm_source?: string;
  last_utm_medium?: string;
  last_utm_campaign?: string;
};

export type LeadSpamPayload = {
  company?: string;
  form_started_at?: string;
  smartcaptcha_token?: string;
};

export type LeadApiRequest = LeadFormValues &
  LeadAttributionPayload &
  LeadSpamPayload & {
    firstLeadSource?: string;
    lastLeadSource?: string;
  };

export type LeadApiResponse = {
  ok: boolean;
  accepted?: boolean;
  id?: number;
  message?: string;
  fieldErrors?: LeadFieldErrors;
};

export type LeadSubmitStatus = 'idle' | 'loading' | 'success' | 'error';
