export type VkSendStatus = 'success' | 'failed' | 'skipped';
export type LeadSpamCheckResult = 'passed' | 'spam' | 'duplicate';

export type LeadRecord = {
  id: number;
  name: string;
  phone: string;
  createdAt: string;
  ip: string | null;
  userAgent: string | null;
  firstTrafficSource: string | null;
  lastTrafficSource: string | null;
  firstVisitAt: string | null;
  lastVisitAt: string | null;
  visitsCount: number | null;
  firstReferrer: string | null;
  lastReferrer: string | null;
  firstUtmSource: string | null;
  firstUtmMedium: string | null;
  firstUtmCampaign: string | null;
  lastUtmSource: string | null;
  lastUtmMedium: string | null;
  lastUtmCampaign: string | null;
  spamCheckResult: LeadSpamCheckResult;
  spamReason: string | null;
  smartCaptchaVerified: boolean;
  vkPeerId: string | null;
  vkSendStatus: VkSendStatus;
  vkSendError: string | null;
};

export type InsertLeadInput = Omit<
  LeadRecord,
  | 'id'
  | 'createdAt'
  | 'firstVisitAt'
  | 'lastVisitAt'
  | 'visitsCount'
  | 'firstReferrer'
  | 'lastReferrer'
  | 'firstUtmSource'
  | 'firstUtmMedium'
  | 'firstUtmCampaign'
  | 'lastUtmSource'
  | 'lastUtmMedium'
  | 'lastUtmCampaign'
  | 'spamCheckResult'
  | 'spamReason'
  | 'smartCaptchaVerified'
> &
  Partial<
    Pick<
      LeadRecord,
      | 'firstVisitAt'
      | 'lastVisitAt'
      | 'visitsCount'
      | 'firstReferrer'
      | 'lastReferrer'
      | 'firstUtmSource'
      | 'firstUtmMedium'
      | 'firstUtmCampaign'
      | 'lastUtmSource'
      | 'lastUtmMedium'
      | 'lastUtmCampaign'
      | 'spamCheckResult'
      | 'spamReason'
      | 'smartCaptchaVerified'
    >
  >;

export type LeadApiRequest = {
  name: string;
  phone: string;
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
};

export type LeadFieldErrors = Partial<Record<'name' | 'phone', string>>;

export type LeadApiResponse = {
  ok: boolean;
  id?: number;
  vkSendStatus?: VkSendStatus;
  fieldErrors?: LeadFieldErrors;
  message?: string;
  statusCode?: number;
};

export type ValidatedLeadInput = {
  name: string;
  phone: string;
};

export type ValidationResult =
  | {
      ok: true;
      value: ValidatedLeadInput;
    }
  | {
      ok: false;
      fieldErrors: LeadFieldErrors;
    };

export type VkNotificationPayload = {
  name: string;
  phone: string;
  createdAt: string;
  firstLeadSource: string | null;
  lastLeadSource: string | null;
  firstVisitAt?: string | null;
  lastVisitAt?: string | null;
  visitsCount?: number | null;
  firstReferrer?: string | null;
  lastReferrer?: string | null;
  firstUtmSource?: string | null;
  firstUtmMedium?: string | null;
  firstUtmCampaign?: string | null;
  lastUtmSource?: string | null;
  lastUtmMedium?: string | null;
  lastUtmCampaign?: string | null;
  spamCheckResult?: LeadSpamCheckResult;
  spamReason?: string | null;
  smartCaptchaVerified?: boolean;
};

export type VkSendResult = {
  status: VkSendStatus;
  error: string | null;
};
