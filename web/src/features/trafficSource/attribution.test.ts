import { afterEach, describe, expect, test } from 'vitest';
import {
  ensureLeadAttributionCookies,
  ensureLeadSourceCookies,
  getStoredLeadAttribution,
  getStoredLeadSources,
  resolveLeadSource,
} from './attribution';

afterEach(() => {
  document.cookie = 'party_lead_first_source=; Max-Age=0; path=/';
  document.cookie = 'party_lead_last_source=; Max-Age=0; path=/';
  document.cookie = 'party_lead_first_visit_at=; Max-Age=0; path=/';
  document.cookie = 'party_lead_last_visit_at=; Max-Age=0; path=/';
  document.cookie = 'party_lead_visits_count=; Max-Age=0; path=/';
  document.cookie = 'party_lead_first_referrer=; Max-Age=0; path=/';
  document.cookie = 'party_lead_last_referrer=; Max-Age=0; path=/';
  document.cookie = 'party_lead_first_utm_source=; Max-Age=0; path=/';
  document.cookie = 'party_lead_first_utm_medium=; Max-Age=0; path=/';
  document.cookie = 'party_lead_first_utm_campaign=; Max-Age=0; path=/';
  document.cookie = 'party_lead_last_utm_source=; Max-Age=0; path=/';
  document.cookie = 'party_lead_last_utm_medium=; Max-Age=0; path=/';
  document.cookie = 'party_lead_last_utm_campaign=; Max-Age=0; path=/';
});

describe('lead attribution', () => {
  test('prefers utm data when it exists', () => {
    const source = resolveLeadSource(
      new URL('https://party-everyday.ru/?utm_source=yandex&utm_medium=cpc'),
      'https://google.com/search',
    );

    expect(source).toBe('UTM: yandex / cpc');
  });

  test('detects avito as a separate source and keeps the full referrer url', () => {
    const source = resolveLeadSource(
      new URL('https://party-everyday.ru/'),
      'https://www.avito.ru/moskva/predlozheniya_uslug/sladkaya_vata_123456789',
    );

    expect(source).toBe(
      'Avito: https://www.avito.ru/moskva/predlozheniya_uslug/sladkaya_vata_123456789',
    );
  });

  test('falls back to the full external referrer url when the source is unknown', () => {
    const source = resolveLeadSource(
      new URL('https://party-everyday.ru/'),
      'https://partner.example.com/campaign?from=banner',
    );

    expect(source).toBe('https://partner.example.com/campaign?from=banner');
  });

  test('stores first source once and keeps updating last source from new visits', () => {
    ensureLeadSourceCookies('https://party-everyday.ru/', 'https://google.com/search');
    expect(getStoredLeadSources()).toEqual({
      firstLeadSource: 'Google поиск',
      lastLeadSource: 'Google поиск',
    });

    ensureLeadSourceCookies(
      'https://party-everyday.ru/',
      'https://www.avito.ru/moskva/predlozheniya_uslug/sladkaya_vata_123456789',
    );
    expect(getStoredLeadSources()).toEqual({
      firstLeadSource: 'Google поиск',
      lastLeadSource: 'Avito: https://www.avito.ru/moskva/predlozheniya_uslug/sladkaya_vata_123456789',
    });
  });

  test('does not overwrite the last source on internal site transitions', () => {
    ensureLeadSourceCookies('https://party-everyday.ru/', 'https://vk.com/');
    ensureLeadSourceCookies('https://party-everyday.ru/services/popcorn', 'https://party-everyday.ru/');

    expect(getStoredLeadSources()).toEqual({
      firstLeadSource: 'Переход из VK',
      lastLeadSource: 'Переход из VK',
    });
  });

  test('stores first touch once and updates last touch plus visit count', () => {
    ensureLeadAttributionCookies(
      'https://party-everyday.ru/?utm_source=yandex&utm_medium=cpc&utm_campaign=spring',
      '',
      new Date('2026-04-01T10:00:00.000Z'),
    );

    expect(getStoredLeadAttribution()).toMatchObject({
      first_visit_at: '2026-04-01T10:00:00.000Z',
      last_visit_at: '2026-04-01T10:00:00.000Z',
      visits_count: '1',
      first_referrer: 'direct',
      last_referrer: 'direct',
      first_utm_source: 'yandex',
      first_utm_medium: 'cpc',
      first_utm_campaign: 'spring',
      last_utm_source: 'yandex',
      last_utm_medium: 'cpc',
      last_utm_campaign: 'spring',
    });

    ensureLeadAttributionCookies(
      'https://party-everyday.ru/',
      '',
      new Date('2026-04-02T10:00:00.000Z'),
    );

    expect(getStoredLeadAttribution()).toMatchObject({
      first_visit_at: '2026-04-01T10:00:00.000Z',
      last_visit_at: '2026-04-02T10:00:00.000Z',
      visits_count: '2',
      first_referrer: 'direct',
      last_referrer: 'direct',
      first_utm_source: 'yandex',
      first_utm_medium: 'cpc',
      first_utm_campaign: 'spring',
      last_utm_source: '',
      last_utm_medium: '',
      last_utm_campaign: '',
    });
  });

  test('stores external referrer when utm tags are absent', () => {
    ensureLeadAttributionCookies(
      'https://party-everyday.ru/',
      'https://partner.example.com/campaign',
      new Date('2026-04-03T10:00:00.000Z'),
    );

    expect(getStoredLeadAttribution()).toMatchObject({
      first_referrer: 'https://partner.example.com/campaign',
      last_referrer: 'https://partner.example.com/campaign',
      first_utm_source: '',
      first_utm_medium: '',
      first_utm_campaign: '',
    });
  });
});
