import { afterEach, describe, expect, test } from 'vitest';
import { ensureLeadSourceCookies, getStoredLeadSources, resolveLeadSource } from './attribution';

afterEach(() => {
  document.cookie = 'party_lead_first_source=; Max-Age=0; path=/';
  document.cookie = 'party_lead_last_source=; Max-Age=0; path=/';
});

describe('lead attribution', () => {
  test('prefers utm data when it exists', () => {
    const source = resolveLeadSource(
      new URL('https://partylanding.vercel.app/?utm_source=yandex&utm_medium=cpc'),
      'https://google.com/search',
    );

    expect(source).toBe('UTM: yandex / cpc');
  });

  test('detects avito as a separate source and keeps the full referrer url', () => {
    const source = resolveLeadSource(
      new URL('https://partylanding.vercel.app/'),
      'https://www.avito.ru/moskva/predlozheniya_uslug/sladkaya_vata_123456789',
    );

    expect(source).toBe(
      'Avito: https://www.avito.ru/moskva/predlozheniya_uslug/sladkaya_vata_123456789',
    );
  });

  test('falls back to the full external referrer url when the source is unknown', () => {
    const source = resolveLeadSource(
      new URL('https://partylanding.vercel.app/'),
      'https://partner.example.com/campaign?from=banner',
    );

    expect(source).toBe('https://partner.example.com/campaign?from=banner');
  });

  test('stores first source once and keeps updating last source from new visits', () => {
    ensureLeadSourceCookies('https://partylanding.vercel.app/', 'https://google.com/search');
    expect(getStoredLeadSources()).toEqual({
      firstLeadSource: 'Google поиск',
      lastLeadSource: 'Google поиск',
    });

    ensureLeadSourceCookies(
      'https://partylanding.vercel.app/',
      'https://www.avito.ru/moskva/predlozheniya_uslug/sladkaya_vata_123456789',
    );
    expect(getStoredLeadSources()).toEqual({
      firstLeadSource: 'Google поиск',
      lastLeadSource: 'Avito: https://www.avito.ru/moskva/predlozheniya_uslug/sladkaya_vata_123456789',
    });
  });

  test('does not overwrite the last source on internal site transitions', () => {
    ensureLeadSourceCookies('https://partylanding.vercel.app/', 'https://vk.com/');
    ensureLeadSourceCookies('https://partylanding.vercel.app/services/popcorn', 'https://partylanding.vercel.app/');

    expect(getStoredLeadSources()).toEqual({
      firstLeadSource: 'Переход из VK',
      lastLeadSource: 'Переход из VK',
    });
  });
});
