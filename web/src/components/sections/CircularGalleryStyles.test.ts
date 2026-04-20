import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('circular gallery keeps a desktop-only drift animation for the non-WebGL fallback', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/sections/CircularGallery.module.css'), 'utf8');

  expect(css).toContain('@keyframes semanticTrackDrift');
  expect(css).toContain('animation: semanticTrackDrift 14s ease-in-out infinite alternate;');
  expect(css).toContain('will-change: transform;');
  expect(css).toContain('touch-action: pan-x pan-y pinch-zoom;');
  expect(css).toContain('grid-auto-flow: column;');
  expect(css).toContain('grid-auto-columns: minmax(18rem, calc((100% - 1.9rem) / 3));');
  expect(css).toContain('-webkit-overflow-scrolling: touch;');
  expect(css).toContain('overscroll-behavior-x: contain;');
  expect(css).toContain('scroll-snap-type: x proximity;');
  expect(css).toContain('scroll-snap-stop: normal;');
  expect(css).toContain('background: transparent;');
  expect(css).toContain('object-fit: cover;');
  expect(css).toContain('object-position: center center;');
  expect(css).not.toContain('object-fit: contain;');
  expect(css).toMatch(
    /@media \(max-width: 900px\) \{[\s\S]*?\.semanticTrack \{[\s\S]*?animation: none;[\s\S]*?transform: none;[\s\S]*?\}/,
  );
  expect(css).toMatch(
    /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.semanticTrack \{[\s\S]*?animation: none;[\s\S]*?transform: none;[\s\S]*?\}/,
  );
});
