import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('article hero frame follows the real image proportions instead of a forced landscape box', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/pages/ArticlePageTemplate.module.css'), 'utf8');

  expect(css).toContain('justify-self: center;');
  expect(css).toContain('width: fit-content;');
  expect(css).toContain('max-width: 100%;');
  expect(css).toContain('width: auto;');
  expect(css).not.toContain('aspect-ratio: 4 / 3;');
});
