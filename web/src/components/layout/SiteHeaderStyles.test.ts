import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('mobile header reserves enough width for the full brand name', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/layout/SiteHeader.module.css'), 'utf8');

  expect(css).toContain('font-size: 0.84rem;');
  expect(css).toContain('max-width: min(66vw, 16rem);');
});
