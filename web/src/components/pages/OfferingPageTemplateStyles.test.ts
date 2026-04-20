import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('service page removes the responsibility panel and keeps tea station tariffs in a wider desktop layout', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/pages/OfferingPageTemplate.module.css'), 'utf8');

  expect(css).not.toContain('.mobileOnlyDetailPanel {');
  expect(css).not.toContain(".detailGrid[data-materials-desktop='hidden'] {");
  expect(css).toContain(".tariffsSection[data-service-slug='tea-station'] .tariffsGrid {");
  expect(css).toContain("grid-template-columns: repeat(2, minmax(0, 1fr));");
  expect(css).toContain('.tariffSections {');
  expect(css).toContain('.tariffSectionTitle {');
  expect(css).toContain(".tariffsSection[data-service-slug='tea-station'] .tariffVariants[data-variant-count='3'] {");
  expect(css).toContain('grid-template-columns: 1fr;');
  expect(css).toContain(".tariffsSection[data-service-slug='tea-station'] .tariffVariant {");
  expect(css).toContain('grid-template-columns: minmax(0, 1fr) auto;');
});

test('service page has a dedicated in-flow cta spacing block between delivery and other services', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/pages/OfferingPageTemplate.module.css'), 'utf8');

  expect(css).not.toContain('.servicePageCta {');
});

test('extra price lists are rendered as simple rows instead of card-like blocks', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/pages/OfferingPageTemplate.module.css'), 'utf8');

  expect(css).toContain('.includedPriceList {');
  expect(css).toContain('.includedPriceItem {');
  expect(css).toContain('border: 0;');
  expect(css).toContain('background: transparent;');
  expect(css).toContain('box-shadow: none;');
});

test('offering hero titles preserve word boundaries on narrow screens', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/pages/OfferingPageTemplate.module.css'), 'utf8');

  expect(css).toContain('max-width: min(100%, 13ch);');
  expect(css).toContain('font-size: clamp(1.72rem, 3.6vw, 3.1rem);');
  expect(css).toContain('text-wrap: balance;');
  expect(css).toContain('overflow-wrap: normal;');
  expect(css).toContain('word-break: normal;');
  expect(css).toContain('hyphens: none;');
  expect(css).not.toContain('overflow-wrap: anywhere;');
});

test('extra offering visuals use a plain white surface so branded artwork does not clash with colored gradients', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/pages/OfferingPageTemplate.module.css'), 'utf8');

  expect(css).toContain('.extraVisualCard {');
  expect(css).toContain('.extraVisualCard::before {');
  expect(css).toContain('background: rgb(254, 254, 255);');
  expect(css).toContain('inset: 0;');
  expect(css).toContain('border: 0;');
});
