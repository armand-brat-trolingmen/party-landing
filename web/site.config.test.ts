import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

test('site config loads without a process global for browser-like runtimes', () => {
  const projectRoot = resolve(import.meta.dirname);
  const script = `
    globalThis.process = undefined;
    const mod = await import('./site.config.js');
    console.log(JSON.stringify({
      siteUrl: mod.SITE_URL,
      siteName: mod.SITE_NAME,
      defaultLocale: mod.DEFAULT_LOCALE,
      ogImageUrl: mod.OG_IMAGE_URL
    }));
  `;

  const output = execFileSync(process.execPath, ['--input-type=module', '-e', script], {
    cwd: projectRoot,
    encoding: 'utf8',
  });

  expect(JSON.parse(output.trim())).toEqual({
    siteUrl: 'https://party-everyday.ru',
    siteName: 'Праздник каждый день',
    defaultLocale: 'ru_RU',
    ogImageUrl: 'https://party-everyday.ru/og-image.png?v=20260417',
  });
});
