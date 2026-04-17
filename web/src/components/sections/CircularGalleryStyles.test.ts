import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('circular gallery keeps a desktop-only drift animation for the non-WebGL fallback', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/sections/CircularGallery.module.css'), 'utf8');

  expect(css).toContain('@keyframes semanticTrackDrift');
  expect(css).toContain('animation: semanticTrackDrift 14s ease-in-out infinite alternate;');
  expect(css).toContain('will-change: transform;');
  expect(css).toMatch(
    /@media \(max-width: 900px\) \{[\s\S]*?\.semanticTrack \{[\s\S]*?animation: none;[\s\S]*?transform: none;[\s\S]*?\}/,
  );
  expect(css).toMatch(
    /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.semanticTrack \{[\s\S]*?animation: none;[\s\S]*?transform: none;[\s\S]*?\}/,
  );
});
