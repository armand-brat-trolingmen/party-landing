import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('global motion theme defines drifting glow lights for section frames', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/styles/global.css'), 'utf8');

  expect(css).toContain('@keyframes sectionGlowDrift');
  expect(css).toContain('--section-glow-duration: 18s;');
  expect(css).toContain('animation: sectionGlowDrift var(--section-glow-duration) ease-in-out infinite alternate;');
});

test('hero scene styles define layered float and parallax hooks', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/scene/HeroScene.module.css'), 'utf8');

  expect(css).toContain('@keyframes heroSceneFloat');
  expect(css).toContain('transform: translate3d(var(--hero-parallax-x, 0px), var(--hero-parallax-y, 0px), 0)');
  expect(css).toContain('animation: heroSceneFloat 7.4s ease-in-out infinite alternate;');
});

test('review stories define premium hover motion for photo and content', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/sections/ReviewsSection.module.css'), 'utf8');

  expect(css).toContain('.storyCard:hover');
  expect(css).toContain('transform: translate3d(0, -8px, 0);');
  expect(css).toContain('scale(1.045)');
});

test('mobile motion stays softer with slower glow and tactile review feedback', () => {
  const globalCss = readFileSync(resolve(process.cwd(), 'src/styles/global.css'), 'utf8');
  const heroCss = readFileSync(resolve(process.cwd(), 'src/components/scene/HeroScene.module.css'), 'utf8');
  const reviewsCss = readFileSync(resolve(process.cwd(), 'src/components/sections/ReviewsSection.module.css'), 'utf8');

  expect(globalCss).toContain('--section-glow-duration: 22s;');
  expect(globalCss).toContain('filter: blur(24px);');
  expect(heroCss).toContain('--hero-float-shift-start: -3px;');
  expect(heroCss).toContain('--hero-float-shift-end: 4px;');
  expect(reviewsCss).toContain('@media (hover: none) and (prefers-reduced-motion: no-preference)');
  expect(reviewsCss).toContain('.storyCard:active');
});
