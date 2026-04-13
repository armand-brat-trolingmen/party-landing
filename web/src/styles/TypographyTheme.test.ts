import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('typography uses local font files and token variables for easy rollback', () => {
  const globalCss = readFileSync(resolve(process.cwd(), 'src/styles/global.css'), 'utf8');
  const fontsCss = readFileSync(resolve(process.cwd(), 'src/styles/fonts.css'), 'utf8');
  const indexHtml = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
  const tokensCss = readFileSync(resolve(process.cwd(), 'src/styles/tokens.css'), 'utf8');

  expect(indexHtml).not.toContain('fonts.googleapis.com');
  expect(indexHtml).not.toContain('fonts.gstatic.com');
  expect(globalCss).toContain("@import './fonts.css';");
  expect(globalCss).not.toContain('fonts.googleapis.com');
  expect(fontsCss).toContain("font-family: 'Manrope'");
  expect(fontsCss).toContain("font-family: 'Unbounded'");
  expect(fontsCss).toContain("url('/fonts/manrope-cyrillic.woff2')");
  expect(fontsCss).toContain("url('/fonts/unbounded-cyrillic.woff2')");
  expect(fontsCss).not.toContain('fonts.gstatic.com');
  expect(globalCss).toContain("font-family: var(--font-body)");
  expect(globalCss).toContain("font-family: var(--font-display)");
  expect(tokensCss).toContain("--font-display: 'Unbounded'");
  expect(tokensCss).toContain("--font-body: 'Manrope'");
});
