import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('tablet-and-mobile header switches to the compact menu layout before nav items start colliding', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/layout/SiteHeader.module.css'), 'utf8');

  expect(css).toContain('@media (max-width: 960px)');
  expect(css).toContain('font-size: clamp(0.86rem, 1.9vw, 1rem);');
  expect(css).toContain('max-width: clamp(11rem, 40vw, 17rem);');
  expect(css).toContain('@media (max-width: 420px)');
  expect(css).toContain('max-width: min(58vw, 11.5rem);');
});
