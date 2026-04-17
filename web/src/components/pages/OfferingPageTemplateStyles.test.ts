import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('service page removes the responsibility panel and keeps tea station tariffs in a wider desktop layout', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/pages/OfferingPageTemplate.module.css'), 'utf8');

  expect(css).not.toContain('.mobileOnlyDetailPanel {');
  expect(css).not.toContain(".detailGrid[data-materials-desktop='hidden'] {");
  expect(css).toContain(".tariffsSection[data-service-slug='tea-station'] .tariffsGrid {");
  expect(css).toContain("grid-template-columns: repeat(2, minmax(0, 1fr));");
  expect(css).toContain(".tariffsSection[data-service-slug='tea-station'] .tariffVariants[data-variant-count='3'] {");
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
