import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('mobile extras slider uses compact cards instead of full-width panels', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/sections/ExtrasSection.module.css'), 'utf8');

  expect(css).toContain('grid-auto-columns: clamp(12rem, 64vw, 14rem);');
  expect(css).toContain('min-height: 8rem;');
  expect(css).toContain('display: none;');
  expect(css).toContain('scroll-snap-type: x mandatory;');
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

  expect(css).toContain('text-wrap: pretty;');
  expect(css).toContain('overflow-wrap: normal;');
  expect(css).toContain('word-break: normal;');
  expect(css).toContain('hyphens: none;');
  expect(css).toContain('max-width: 15.5ch;');
});
