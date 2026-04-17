import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('services keeps the mobile slider while letting media stay visible and locking the mobile meta row', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/sections/ServicesSection.module.css'), 'utf8');

  expect(css).toContain('grid-auto-columns: clamp(16rem, 86vw, 22rem);');
  expect(css).toContain('justify-content: start;');
  expect(css).toContain('aspect-ratio: 1 / 1.02;');
  expect(css).toContain('grid-template-rows: auto minmax(0, 1fr);');
  expect(css).toContain('grid-template-rows: minmax(0, 1fr) auto;');
  expect(css).toContain('scroll-snap-type: x mandatory;');
  expect(css).toContain('scroll-snap-stop: always;');
  expect(css).toContain('object-fit: contain;');
  expect(css).toContain('object-position: center bottom;');
  expect(css).toContain('font-weight: 800;');
  expect(css).toContain('font-weight: 640;');
  expect(css).toContain('font-size: clamp(1.46rem, 1.7vw, 1.72rem);');
  expect(css).toContain('font-size: 1.24rem;');
  expect(css).toContain('color: var(--text-secondary);');
  expect(css).toContain('max-width: 34ch;');
  expect(css).toContain('line-height: 1.4;');
  expect(css).toContain('letter-spacing: -0.02em;');
  expect(css).toContain('white-space: nowrap;');
  expect(css).not.toContain('@keyframes serviceButtonSheen');
  expect(css).not.toContain('@keyframes serviceButtonShift');
});
