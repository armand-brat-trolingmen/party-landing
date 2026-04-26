import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('public robots.txt exists and allows public pages while blocking service paths', () => {
  const robotsPath = resolve(import.meta.dirname, '../public/robots.txt');

  expect(existsSync(robotsPath)).toBe(true);

  const robots = readFileSync(robotsPath, 'utf8');

  expect(robots).toContain('User-agent: *');
  expect(robots).toContain('Allow: /');
  expect(robots).toContain('Allow: /assets/');
  expect(robots).toContain('Allow: /images/');
  expect(robots).toContain('Allow: /sitemap.xml');
  expect(robots).toContain('Disallow: /api/');
  expect(robots).toContain('Disallow: /backup/');
  expect(robots).toContain('Disallow: /backups/');
  expect(robots).toContain('Disallow: /install/');
  expect(robots).toContain('Disallow: /.git/');
  expect(robots).toContain('Disallow: /node_modules/');
  expect(robots).toContain('Disallow: /server/');
  expect(robots).toContain('Disallow: /src/');
  expect(robots).not.toContain('Sitemap:');
  expect(robots).not.toContain('__SITE_URL__');
});
