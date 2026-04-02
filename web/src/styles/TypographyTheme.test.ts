import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('typography stays centralized in document font links and token variables for easy rollback', () => {
  const globalCss = readFileSync(resolve(process.cwd(), 'src/styles/global.css'), 'utf8');
  const indexHtml = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
  const tokensCss = readFileSync(resolve(process.cwd(), 'src/styles/tokens.css'), 'utf8');

  expect(indexHtml).toContain('fonts.googleapis.com');
  expect(indexHtml).toContain('family=Lora');
  expect(indexHtml).toContain('family=Nunito+Sans');
  expect(globalCss).toContain("font-family: var(--font-body)");
  expect(globalCss).toContain("font-family: var(--font-display)");
  expect(tokensCss).toContain("--font-display: 'Lora', serif;");
  expect(tokensCss).toContain("--font-body: 'Nunito Sans', sans-serif;");
});
