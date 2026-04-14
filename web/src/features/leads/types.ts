export type LeadFormValues = {
  name: string;
  phone: string;
};

export type LeadFieldErrors = Partial<Record<keyof LeadFormValues, string>>;

export type LeadApiRequest = LeadFormValues & {
  firstLeadSource?: string;
  lastLeadSource?: string;
};

export type LeadApiResponse = {
  ok: boolean;
  id?: number;
  message?: string;
  fieldErrors?: LeadFieldErrors;
};

export type LeadSubmitStatus = 'idle' | 'loading' | 'success' | 'error';
