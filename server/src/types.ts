export type VkSendStatus = 'success' | 'failed' | 'skipped';

export type LeadRecord = {
  id: number;
  name: string;
  phone: string;
  createdAt: string;
  ip: string | null;
  userAgent: string | null;
  firstTrafficSource: string | null;
  lastTrafficSource: string | null;
  vkPeerId: string | null;
  vkSendStatus: VkSendStatus;
  vkSendError: string | null;
};

export type InsertLeadInput = Omit<LeadRecord, 'id' | 'createdAt'>;

export type LeadApiRequest = {
  name: string;
  phone: string;
  firstLeadSource?: string;
  lastLeadSource?: string;
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
};

export type VkSendResult = {
  status: VkSendStatus;
  error: string | null;
};
