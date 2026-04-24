import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { siteConfig } from './content';

test('index html defines production-friendly SEO tags for the landing page', () => {
  const html = readFileSync(resolve(import.meta.dirname, '../index.html'), 'utf8');
  const iconLinks = html.match(/<link rel="icon"[^>]*>/g) ?? [];

  expect(html).toContain('<html lang="ru">');
  expect(html).toContain('name="viewport"');
  expect(html).not.toContain('googletagmanager.com');
  expect(html).not.toContain('GTM-TL8KRHKH');
  expect(html).toContain('name="yandex-verification"');
  expect(html).toContain('content="70515ede813a5a7e"');
  expect(html).not.toContain(['07b2ceb2', 'a2824f8f'].join(''));
  expect(html).toContain('https://mc.yandex.ru/metrika/tag.js?id=108614702');
  expect(html).toContain("ym(108614702, 'init'");
  expect(html).toContain('https://mc.yandex.ru/watch/108614702');
  expect(iconLinks).toHaveLength(1);
  expect(html).toContain('rel="icon" href="/favicon.ico" sizes="any"');
  expect(html).not.toContain('favicon-32.png');
  expect(html).not.toContain('favicon.png');
  expect(html).not.toContain('apple-touch-icon');
  expect(html).toContain('rel="manifest" type="application/manifest+json" href="/manifest.json"');
  expect(html).toContain('<!--helmet-title-->');
  expect(html).toContain('<!--helmet-meta-->');
  expect(html).toContain('<!--helmet-link-->');
  expect(html).toContain('<!--helmet-script-->');
  expect(html).not.toMatch(/name="robots"[^>]*noindex/i);
  expect(html).not.toMatch(/name="robots"[^>]*nofollow/i);
  expect(html).not.toMatch(/name="robots"[^>]*none/i);
});

test('public assets include ico favicon for browser fallback requests', () => {
  expect(existsSync(resolve(import.meta.dirname, '../public/favicon.ico'))).toBe(true);
  expect(existsSync(resolve(import.meta.dirname, '../public/favicon-32.png'))).toBe(true);
  expect(existsSync(resolve(import.meta.dirname, '../public/manifest.json'))).toBe(true);
});

test('siteConfig exposes centralized SEO copy', () => {
  const seo = siteConfig.seo as {
    defaults?: {
      siteName: string;
      businessDescription: string;
    };
    legal?: {
      privacy: {
        title: string;
        description: string;
      };
    };
  };

  expect(seo.defaults?.siteName).toBe(siteConfig.brand.name);
  expect(seo.defaults?.businessDescription).toContain(siteConfig.brand.name);
  expect(seo.legal?.privacy.title).toBe(siteConfig.legal.documents.privacy.seoTitle);
  expect(seo.legal?.privacy.description).toBe(siteConfig.legal.documents.privacy.description);
});
