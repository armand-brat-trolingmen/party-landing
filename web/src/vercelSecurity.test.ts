import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('vercel config includes basic security headers for the static landing', () => {
  const configPath = resolve(__dirname, '../../vercel.json');
  const config = JSON.parse(readFileSync(configPath, 'utf8')) as {
    headers?: Array<{ source: string; headers: Array<{ key: string; value: string }> }>;
  };

  expect(config.headers).toBeDefined();
  expect(config.headers?.[0]?.source).toBe('/(.*)');
  expect(config.headers?.[0]?.headers).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ key: 'X-Frame-Options' }),
      expect.objectContaining({ key: 'X-Content-Type-Options' }),
      expect.objectContaining({ key: 'Referrer-Policy' }),
      expect.objectContaining({ key: 'Content-Security-Policy' }),
    ]),
  );
});
