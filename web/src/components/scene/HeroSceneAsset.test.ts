import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('hero chocolate fountain asset uses filled chocolate cascades on every rim and reaches the bottom basin', () => {
  const assetPath = resolve(process.cwd(), 'public/images/hero/chocolate-fountain-card.svg');
  const svg = readFileSync(assetPath, 'utf8');

  expect(svg).not.toContain('<animateTransform');
  expect(svg).toContain('id="fountain-cascade-top-left"');
  expect(svg).toContain('id="fountain-cascade-top-right"');
  expect(svg).toContain('id="fountain-cascade-middle-left"');
  expect(svg).toContain('id="fountain-cascade-middle-right"');
  expect(svg).toContain('id="fountain-cascade-bottom-left"');
  expect(svg).toContain('id="fountain-cascade-bottom-right"');
  expect(svg).toContain('id="fountain-rim-top"');
  expect(svg).toContain('id="fountain-rim-middle"');
  expect(svg).toContain('id="fountain-rim-bottom"');
  expect(svg).toContain('id="fountain-sheet-top"');
  expect(svg).toContain('id="fountain-sheet-middle"');
  expect(svg).toContain('id="fountain-sheet-bottom"');
  expect(svg).toContain('id="fountain-front-shell"');
  expect(svg).toContain('attributeName="offset"');
  expect(svg).toContain('repeatCount="indefinite"');
  expect(svg).toContain('d="M82 69L82 105L103 109L100 69Z"');
  expect(svg).toContain('d="M75 96L75 146L95 147L94 96Z"');
  expect(svg).toContain('d="M69 121L69 190L87 194L88 121Z"');
  expect(svg).toContain('d="M85 74L70 139L84 194L136 194L150 139L135 74L124 74L124 194L96 194L96 74Z"');
  expect(svg).toContain('dur="2.24s"');
  expect(svg).toContain('dur="2.36s"');
  expect(svg).toContain('dur="2.48s"');
  expect(svg).toContain('dur="2.6s"');
});
