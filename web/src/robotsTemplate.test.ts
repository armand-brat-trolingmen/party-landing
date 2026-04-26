import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('public robots.txt exists and allows indexing for Yandex and major bots', () => {
  const robotsPath = resolve(import.meta.dirname, '../public/robots.txt');

  expect(existsSync(robotsPath)).toBe(true);

  const robots = readFileSync(robotsPath, 'utf8');

  expect(robots).toContain('User-agent: *');
  expect(robots).toContain('User-agent: Yandex');
  expect(robots).toContain('User-agent: Googlebot');
  expect(robots).toContain('User-agent: Bingbot');
  expect(robots).toContain('User-agent: Twitterbot');
  expect(robots).toContain('User-agent: facebookexternalhit');
  expect(robots).toContain('Allow: /');
  expect(robots).not.toContain('Sitemap:');
  expect(robots).not.toContain('__SITE_URL__');
});
