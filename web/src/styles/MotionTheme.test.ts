import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('global motion theme defines drifting glow lights for section frames', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/styles/global.css'), 'utf8');

  expect(css).toContain('@keyframes sectionGlowDrift');
  expect(css).toContain('@keyframes sectionLightTrailDrift');
  expect(css).toContain('--section-glow-duration: 18s;');
  expect(css).toContain('animation: sectionGlowDrift var(--section-glow-duration) ease-in-out infinite alternate;');
  expect(css).toContain('.site-shell::before');
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
  expect(css).toContain('translate3d(0, -8px, 0)');
  expect(css).toContain('perspective(1200px)');
  expect(css).toContain('--review-photo-shift-x: 0px;');
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

test('header styles define a compact scroll state, floating nav indicator, and logo motion', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/layout/SiteHeader.module.css'), 'utf8');

  expect(css).toContain(".header[data-header-state='compact']");
  expect(css).toContain('.navIndicator');
  expect(css).toContain('@keyframes logoGentleFloat');
  expect(css).toContain('.mobileNavLink[data-active=\'true\']');
});

test('faq and services define cinematic accordion glow and micro scene animations', () => {
  const faqCss = readFileSync(resolve(process.cwd(), 'src/components/sections/FaqSection.module.css'), 'utf8');
  const servicesCss = readFileSync(resolve(process.cwd(), 'src/components/sections/ServicesSection.module.css'), 'utf8');

  expect(faqCss).toContain('.item::before');
  expect(faqCss).toContain(".item[data-open='true']");
  expect(faqCss).toContain('.answerText::before');
  expect(servicesCss).toContain('@keyframes serviceShineSweep');
  expect(servicesCss).toContain('@keyframes cottonCandyDrift');
  expect(servicesCss).toContain('@keyframes confettiDrift');
});
