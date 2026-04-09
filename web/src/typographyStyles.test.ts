import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('global typography enables softer optical tuning for display and body text', () => {
  const globalCss = readFileSync(resolve(import.meta.dirname, './styles/global.css'), 'utf8');

  expect(globalCss).toContain('font-optical-sizing: auto;');
  expect(globalCss).toContain('font-weight: 700;');
  expect(globalCss).toContain('letter-spacing: -0.05em;');
  expect(globalCss).toContain('letter-spacing: -0.01em;');
});

test('hero and legal pages apply softened editorial typography values', () => {
  const heroCss = readFileSync(resolve(import.meta.dirname, './components/sections/HeroSection.module.css'), 'utf8');
  const legalCss = readFileSync(resolve(import.meta.dirname, './components/legal/LegalPageLayout.module.css'), 'utf8');

  expect(heroCss).toContain('letter-spacing: -0.07em;');
  expect(heroCss).toContain('font-size: clamp(3.45rem, 8vw, 6.8rem);');
  expect(legalCss).toContain('font-size: clamp(1.95rem, 3.8vw, 2.8rem);');
  expect(legalCss).toContain('font-family: var(--font-body);');
});
