import { afterEach, describe, expect, test, vi } from 'vitest';
import { submitLead } from './api';

afterEach(() => {
  document.cookie = 'party_lead_first_source=; Max-Age=0; path=/';
  document.cookie = 'party_lead_last_source=; Max-Age=0; path=/';
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('submitLead', () => {
  test('attaches first and last stored lead sources from cookies to the API payload', async () => {
    document.cookie = 'party_lead_first_source=' + encodeURIComponent('Google поиск') + '; path=/';
    document.cookie = 'party_lead_last_source=' + encodeURIComponent('Яндекс поиск') + '; path=/';

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, id: 1, message: 'Заявка сохранена' }),
    });

    vi.stubGlobal('fetch', fetchMock);

    await submitLead({
      name: 'Анна',
      phone: '+7 (999) 111 22 33',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/leads',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'Анна',
          phone: '+7 (999) 111 22 33',
          firstLeadSource: 'Google поиск',
          lastLeadSource: 'Яндекс поиск',
        }),
      }),
    );
  });
});
