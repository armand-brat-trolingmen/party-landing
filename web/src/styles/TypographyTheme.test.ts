import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('typography stays centralized in global import and token variables for easy rollback', () => {
  const globalCss = readFileSync(resolve(process.cwd(), 'src/styles/global.css'), 'utf8');
  const tokensCss = readFileSync(resolve(process.cwd(), 'src/styles/tokens.css'), 'utf8');

  expect(globalCss).toContain('family=Lora');
  expect(globalCss).toContain('family=Nunito+Sans');
  expect(globalCss).toContain("font-family: var(--font-body)");
  expect(globalCss).toContain("font-family: var(--font-display)");
  expect(tokensCss).toContain("--font-display: 'Lora', serif;");
  expect(tokensCss).toContain("--font-body: 'Nunito Sans', sans-serif;");
});
