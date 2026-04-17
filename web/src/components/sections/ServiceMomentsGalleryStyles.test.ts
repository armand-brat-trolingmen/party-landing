import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('service moments gallery uses resilient native horizontal scrolling', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/sections/ServiceMomentsGallery.module.css'), 'utf8');

  expect(css).toContain('overflow-x: auto;');
  expect(css).toContain('overflow-y: hidden;');
  expect(css).toContain('-webkit-overflow-scrolling: touch;');
  expect(css).toContain('overscroll-behavior-x: contain;');
  expect(css).toContain('touch-action: pan-x pan-y;');
  expect(css).toContain('scroll-snap-type: x proximity;');
  expect(css).toContain('scroll-snap-stop: normal;');
});
