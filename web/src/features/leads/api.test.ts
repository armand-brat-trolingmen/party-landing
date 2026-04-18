import { afterEach, describe, expect, test, vi } from 'vitest';
import { submitLead } from './api';

const attributionCookieNames = [
  'party_lead_first_source',
  'party_lead_last_source',
  'party_lead_first_visit_at',
  'party_lead_last_visit_at',
  'party_lead_visits_count',
  'party_lead_first_referrer',
  'party_lead_last_referrer',
  'party_lead_first_utm_source',
  'party_lead_first_utm_medium',
  'party_lead_first_utm_campaign',
  'party_lead_last_utm_source',
  'party_lead_last_utm_medium',
  'party_lead_last_utm_campaign',
];

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/`;
}

afterEach(() => {
  for (const name of attributionCookieNames) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
  }

  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('submitLead', () => {
  test('attaches stored first-party attribution cookies to the API payload', async () => {
    setCookie('party_lead_first_visit_at', '2026-04-01T10:00:00.000Z');
    setCookie('party_lead_last_visit_at', '2026-04-02T10:00:00.000Z');
    setCookie('party_lead_visits_count', '2');
    setCookie('party_lead_first_referrer', 'direct');
    setCookie('party_lead_last_referrer', 'https://partner.example.com/campaign');
    setCookie('party_lead_first_utm_source', 'yandex');
    setCookie('party_lead_first_utm_medium', 'cpc');
    setCookie('party_lead_first_utm_campaign', 'spring');
    setCookie('party_lead_last_utm_source', '');
    setCookie('party_lead_last_utm_medium', '');
    setCookie('party_lead_last_utm_campaign', '');

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, id: 1, message: 'saved' }),
    });

    vi.stubGlobal('fetch', fetchMock);

    await submitLead({
      name: 'Anna',
      phone: '+7 (999) 111-22-33',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/leads',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'Anna',
          phone: '+7 (999) 111-22-33',
          first_visit_at: '2026-04-01T10:00:00.000Z',
          last_visit_at: '2026-04-02T10:00:00.000Z',
          visits_count: '2',
          first_referrer: 'direct',
          last_referrer: 'https://partner.example.com/campaign',
          first_utm_source: 'yandex',
          first_utm_medium: 'cpc',
          first_utm_campaign: 'spring',
          last_utm_source: '',
          last_utm_medium: '',
          last_utm_campaign: '',
          firstLeadSource: 'UTM: yandex / cpc / spring',
          lastLeadSource: 'https://partner.example.com/campaign',
        }),
      }),
    );
  });
});
