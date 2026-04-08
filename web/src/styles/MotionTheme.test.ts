import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function readCss(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8').replace(/\r\n/g, '\n');
}

test('global canvas styles remove hanging decorative separators and keep one shared page background', () => {
  const css = readCss('src/styles/global.css');

  expect(css).toContain('.site-shell::before');
  expect(css).toContain('rgba(255, 236, 146');
  expect(css).toContain('rgba(255, 174, 206');
  expect(css).toContain('rgba(167, 220, 255');
  expect(css).toContain('.site-section__content');
  expect(css).not.toContain(".site-shell[data-motion-path='story-trail'] > #about::before");
  expect(css).not.toContain('@keyframes sectionLightTrailDrift');
  expect(css).not.toContain('@keyframes sectionStoryTrailDrift');
});

test('hero styles define a clean visual field without the hanging bubble accent', () => {
  const css = readCss('src/components/sections/HeroSection.module.css');

  expect(css).toContain('.visualField');
  expect(css).toContain('.visualGlow');
  expect(css).toContain('background: transparent;');
  expect(css).toContain('border: 0;');
  expect(css).toContain('min-width: 17rem;');
  expect(css).toContain('min-height: 4.8rem;');
  expect(css).toContain('rgba(255, 236, 186');
  expect(css).not.toContain('rgba(110, 191, 255');
  expect(css).not.toContain('.hero::after');
});

test('moment feed defines premium hover motion for photos and slide content', () => {
  const css = readCss('src/components/sections/ReviewsSection.module.css');

  expect(css).toContain('.slide:hover');
  expect(css).toContain('translate3d(0, -4px, 0)');
  expect(css).toContain('.slide:hover .slideImage');
  expect(css).toContain("data-slide-transition='soft-swap'");
  expect(css).toContain('@keyframes slideSwapInNext');
});

test('mobile motion keeps review feedback but drops the old section trail lights', () => {
  const globalCss = readCss('src/styles/global.css');
  const heroCss = readCss('src/components/sections/HeroSection.module.css');
  const servicesCss = readCss('src/components/sections/ServicesSection.module.css');
  const reviewsCss = readCss('src/components/sections/ReviewsSection.module.css');

  expect(globalCss).toContain('@media (max-width: 720px)');
  expect(globalCss).not.toContain('sectionLightTrailDrift 34s');
  expect(heroCss).toContain('.actions');
  expect(heroCss).toContain('@media (max-width: 720px)');
  expect(servicesCss).toContain('.card:hover');
  expect(servicesCss).toContain('transform: translate3d(0, -8px, 0);');
  expect(servicesCss).toContain('.link:hover,');
  expect(servicesCss).toContain('.revealButton:hover,');
  expect(reviewsCss).toContain('@media (max-width: 720px)');
  expect(reviewsCss).toContain('.controlButton:active');
});

test('header styles define a transparent home rest state and a framed compact state', () => {
  const css = readCss('src/components/layout/SiteHeader.module.css');
  const footerCss = readCss('src/components/layout/SiteFooter.module.css');

  expect(css).toContain(".header[data-header-state='compact']");
  expect(css).toContain(".header[data-header-route='home'][data-header-state='rest']");
  expect(css).toContain('.navIndicator');
  expect(css).toContain('.brandText');
  expect(css).toContain('.headerCtaInner');
  expect(css).toContain('.headerCtaArrow');
  expect(css).toContain('max-width: 1260px;');
  expect(css).toContain('flex-wrap: nowrap;');
  expect(css).toContain('justify-content: space-between;');
  expect(css).toContain('justify-content: center;');
  expect(css).toContain('min-width: 10.5rem;');
  expect(css).not.toContain('@keyframes logoGentleFloat');
  expect(css).toContain(".mobileNavLink[data-active='true']");
  expect(css).toContain('width: 3.1rem;');
  expect(footerCss).toContain('width: 3.1rem;');
});

test('faq and services define cinematic accordion glow and premium micro interactions', () => {
  const faqCss = readCss('src/components/sections/FaqSection.module.css');
  const servicesCss = readCss('src/components/sections/ServicesSection.module.css');

  expect(faqCss).toContain('.item::before');
  expect(faqCss).toContain(".item[data-open='true']");
  expect(faqCss).toContain('.answerText::before');
  expect(servicesCss).toContain('.card {');
  expect(servicesCss).toContain('transition:\n    transform 380ms cubic-bezier(0.22, 1, 0.36, 1),');
  expect(servicesCss).toContain('@media (prefers-reduced-motion: reduce)');
});

test('cta styles render a full-width band without a framed card shell', () => {
  const css = readCss('src/components/sections/CtaSection.module.css');

  expect(css).toContain('.section {');
  expect(css).toContain('width: 100%;');
  expect(css).toContain('border: 0;');
  expect(css).toContain('border-radius: 0;');
  expect(css).toContain('#f2a14b');
  expect(css).toContain('font-weight: 800;');
});
