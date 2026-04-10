import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { siteConfig } from './content';

test('index html defines production-friendly SEO tags for the landing page', () => {
  const html = readFileSync(resolve(import.meta.dirname, '../index.html'), 'utf8');

  expect(html).toContain('<html lang="ru">');
  expect(html).toContain('name="viewport"');
  expect(html).toContain('name="yandex-verification"');
  expect(html).toContain('content="07b2ceb2a2824f8f"');
  expect(html).toContain('rel="icon" type="image/png" href="/favicon.png?v=4"');
  expect(html).toContain('rel="shortcut icon" href="/favicon.png?v=4"');
  expect(html).toContain('<!--helmet-title-->');
  expect(html).toContain('<!--helmet-meta-->');
  expect(html).toContain('<!--helmet-link-->');
  expect(html).toContain('<!--helmet-script-->');
  expect(html).not.toMatch(/name="robots"[^>]*noindex/i);
  expect(html).not.toMatch(/name="robots"[^>]*nofollow/i);
  expect(html).not.toMatch(/name="robots"[^>]*none/i);
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
