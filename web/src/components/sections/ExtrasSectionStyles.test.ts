import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('extras catalog has no breakpoint dead zone and collapses to a compact list instead of a mobile slider', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/sections/ExtrasSection.module.css'), 'utf8');

  expect(css).toContain('grid-template-columns: repeat(2, minmax(0, 1fr));');
  expect(css).toContain('@media (min-width: 1120px)');
  expect(css).toContain('grid-template-columns: repeat(3, minmax(0, 1fr));');
  expect(css).toContain('@media (max-width: 1119px)');
  expect(css).toContain('@media (max-width: 720px)');
  expect(css).toContain('grid-template-columns: 1fr;');
  expect(css).toContain("grid-template-areas:");
  expect(css).toContain("'visual copy'");
  expect(css).toContain("'visual footer'");
  expect(css).toContain('aspect-ratio: 1 / 1;');
  expect(css).not.toContain('grid-auto-flow: column;');
  expect(css).not.toContain('grid-auto-columns: clamp(12rem, 64vw, 14rem);');
  expect(css).not.toContain('scroll-snap-type: x proximity;');
});

test('extras images use the same hover zoom treatment as service cards', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/sections/ExtrasSection.module.css'), 'utf8');

  expect(css).toContain('transform: translate3d(0, 0, 0) scale(1.02);');
  expect(css).toContain('transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1);');
  expect(css).toContain('.cardLink:hover .visualImage,');
  expect(css).toContain('.cardLink:focus-visible .visualImage {');
  expect(css).toContain('transform: translate3d(0, -4px, 0) scale(1.04);');
});

test('extra card names balance into cleaner multi-line titles without forced mid-word breaks', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/sections/ExtrasSection.module.css'), 'utf8');

  expect(css).toContain('text-wrap: balance;');
  expect(css).toContain('overflow-wrap: break-word;');
  expect(css).toContain('word-break: normal;');
  expect(css).toContain('hyphens: none;');
  expect(css).toContain('max-width: 100%;');
  expect(css).toContain('font-size: clamp(0.76rem, 0.88vw, 0.86rem);');
  expect(css).toContain('font-size: 0.9rem;');
  expect(css).toContain('grid-template-columns: minmax(5.6rem, 6.2rem) minmax(0, 1fr);');
  expect(css).toContain('font-size: 0.72rem;');
  expect(css).toContain('font-size: 0.68rem;');
});

test('extras cards keep a neutral white surface so branded icons do not clash with decorative gradients', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/sections/ExtrasSection.module.css'), 'utf8');

  expect(css).toContain('.card {');
  expect(css).toContain('background: #ffffff;');
  expect(css).not.toContain('radial-gradient(circle at 14% 16%');
});
