import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function readCss(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8').replace(/\r\n/g, '\n');
}

test('global shell defines one continuous page wash without framed surface islands', () => {
  const globalCss = readCss('src/styles/global.css');
  const tokensCss = readCss('src/styles/tokens.css');

  expect(globalCss).toContain('.site-shell {');
  expect(globalCss).toContain('background: var(--page-gradient-base);');
  expect(globalCss).toContain('.site-shell::before');
  expect(globalCss).toContain('.site-shell > [data-testid^="section-"]');
  expect(globalCss).toContain('background: transparent;');
  expect(globalCss).toContain('.site-section {');
  expect(globalCss).toContain("[data-heading-align='center']");
  expect(globalCss).not.toContain('--section-start');
  expect(globalCss).not.toContain('[data-testid="section-food-truck-rental"]');
  expect(globalCss).not.toContain('#FFF0D8');
  expect(globalCss).not.toContain('#FFF4CC');
  expect(globalCss).not.toContain('#FFEADA');
  expect(globalCss).not.toContain(".site-section[data-section-tone='rose']::before");
  expect(globalCss).not.toContain('.site-section::after');
  expect(globalCss).not.toContain('.site-section__eyebrow');
  expect(globalCss).not.toContain('.site-section__content');
  expect(globalCss).toContain('scroll-behavior: smooth;');
  expect(globalCss).not.toContain('story-trail');
  expect(tokensCss).toContain('--page-gradient-base:');
  expect(tokensCss).toContain("--font-display: 'Unbounded'");
  expect(tokensCss).toContain("--font-body: 'Manrope'");
  expect(tokensCss).toContain('--bg-base: #FFFDF8;');
  expect(tokensCss).toContain('--bg-soft-blue: #F1FBFF;');
  expect(tokensCss).toContain('--accent-primary: #FF7EB6;');
  expect(tokensCss).toContain('--accent-secondary: #8FD8F8;');
  expect(tokensCss).toContain('--text-primary: #1E2430;');
  expect(tokensCss).toContain('--shell-max-width: 1440px;');
});

test('hero styles define a premium split layout with a framed poster carousel', () => {
  const css = readCss('src/components/sections/HeroSection.module.css');

  expect(css).toContain('.posterColumn');
  expect(css).not.toContain('.supportingNote');
  expect(css).toContain('min-width: 12.5rem;');
  expect(css).toContain('min-height: 3.75rem;');
  expect(css).toContain('grid-template-columns: minmax(0, 0.9fr) minmax(18rem, 0.82fr);');
  expect(css).toContain('@media (max-width: 1280px)');
  expect(css).toContain('grid-template-columns: minmax(0, 0.98fr) minmax(17rem, 0.68fr);');
  expect(css).toContain('@media (max-width: 1180px)');
  expect(css).toContain('max-width: min(100%, 40rem);');
  expect(css).toContain('padding-top: clamp(0.6rem, 3vh, 1.2rem);');
  expect(css).toContain('@media (max-width: 420px)');
  expect(css).toContain('font-size: clamp(1.72rem, 9.4vw, 2.16rem);');
  expect(css).not.toContain('.visualGlow');
  expect(css).not.toContain('.visualGlowSecondary');
});

test('services styles preserve card interactions but drop the outer frame rule', () => {
  const css = readCss('src/components/sections/ServicesSection.module.css');
  const extrasCss = readCss('src/components/sections/ExtrasSection.module.css');
  const offeringCss = readCss('src/components/pages/OfferingPageTemplate.module.css');

  expect(css).toContain('.sectionBody {');
  expect(css).toContain('.card {');
  expect(css).toContain('.cardLink {');
  expect(css).toContain('.revealButton {');
  expect(css).toContain('@keyframes serviceButtonSheen');
  expect(css).toContain('.link::before');
  expect(css).toContain('transform: translate3d(0, -8px, 0);');
  expect(css).toContain('scroll-snap-type: x mandatory;');
  expect(css).toContain('grid-auto-columns: 100%;');
  expect(css).toContain('scroll-snap-stop: always;');
  expect(css).not.toContain('.frame {');
  expect(extrasCss).toContain('@keyframes extraButtonSheen');
  expect(extrasCss).toContain('.link::before');
  expect(extrasCss).toContain('grid-auto-columns: clamp(12rem, 64vw, 14rem);');
  expect(offeringCss).toContain('.orderButton::before');
  expect(offeringCss).toContain('@keyframes orderButtonSheen');
});

test('reviews faq and contact styles rely on internal structure without outer frame classes', () => {
  const reviewsCss = readCss('src/components/sections/ReviewsSection.module.css');
  const faqCss = readCss('src/components/sections/FaqSection.module.css');
  const contactCss = readCss('src/components/sections/ContactPlaceholderSection.module.css');

  expect(reviewsCss).toContain('.sectionBody {');
  expect(reviewsCss).toContain('.gallery {');
  expect(reviewsCss).toContain('.overlay {');
  expect(faqCss).toContain('.sectionBody {');
  expect(faqCss).toContain('.item::before');
  expect(faqCss).not.toContain('.frame {');
  expect(contactCss).toContain('.sectionBody {');
  expect(contactCss).toContain('.visualSlot {');
  expect(contactCss).toContain('object-fit: contain;');
  expect(contactCss).not.toContain('.guide {');
});

test('cta stays a band while the header remains transparent at rest', () => {
  const ctaCss = readCss('src/components/sections/CtaSection.module.css');
  const headerCss = readCss('src/components/layout/SiteHeader.module.css');
  const footerCss = readCss('src/components/layout/SiteFooter.module.css');

  expect(ctaCss).toContain('.section {');
  expect(ctaCss).toContain('.homeBand');
  expect(ctaCss).toContain('.innerBand');
  expect(ctaCss).toContain('width: 100%;');
  expect(ctaCss).toContain('var(--accent-purple)');
  expect(ctaCss).toContain('var(--accent-secondary)');
  expect(ctaCss).toContain('var(--accent-primary)');
  expect(readCss('src/styles/tokens.css')).toContain('--accent-purple: #7F4DDB;');
  expect(headerCss).toContain(".header[data-header-route='home'][data-header-state='rest']");
  expect(headerCss).toContain('.mobileMenuOrderLink');
  expect(headerCss).not.toContain('.mobileCta');
  expect(footerCss).toContain('background: #1f2834;');
});

test('mobile breakpoints keep the premium layout but calm the motion and spacing', () => {
  const globalCss = readCss('src/styles/global.css');
  const headerCss = readCss('src/components/layout/SiteHeader.module.css');
  const heroCss = readCss('src/components/sections/HeroSection.module.css');
  const carouselCss = readCss('src/components/sections/HeroPosterCarousel.module.css');
  const servicesCss = readCss('src/components/sections/ServicesSection.module.css');
  const extrasCss = readCss('src/components/sections/ExtrasSection.module.css');
  const ctaCss = readCss('src/components/sections/CtaSection.module.css');
  const offeringCss = readCss('src/components/pages/OfferingPageTemplate.module.css');
  const contactCss = readCss('src/components/sections/ContactPlaceholderSection.module.css');

  expect(globalCss).not.toContain("--reveal-distance:");
  expect(globalCss).not.toContain("html[data-js='true'] .site-reveal[data-reveal-state='pending']");
  expect(globalCss).not.toContain("html[data-js='true'] .site-reveal[data-reveal-state='pending'][data-reveal-stagger='true'] > *");
  expect(globalCss).not.toContain('transition-delay: 70ms;');
  expect(globalCss).not.toContain('filter 980ms ease;');
  expect(globalCss).toContain('width: min(calc(100% - 1rem), var(--shell-max-width));');
  expect(headerCss).toContain('text-overflow: clip;');
  expect(headerCss).toContain('width: min(calc(100vw - 0.75rem), 24rem);');
  expect(heroCss).toContain('justify-self: center;');
  expect(carouselCss).toContain('aspect-ratio: 4 / 4.9;');
  expect(servicesCss).toContain('@media (max-width: 720px)');
  expect(extrasCss).toContain('@media (max-width: 720px)');
  expect(ctaCss).toContain('.homeBand .button');
  expect(ctaCss).toContain('.copy :global(h2)');
  expect(ctaCss).toContain('overflow-wrap: anywhere;');
  expect(ctaCss).toContain('word-break: break-word;');
  expect(offeringCss).toContain('@media (max-width: 720px)');
  expect(offeringCss).toContain('text-wrap: balance;');
  expect(offeringCss).toContain('overflow-wrap: anywhere;');
  expect(contactCss).toContain('min-height: 14.5rem;');
});
