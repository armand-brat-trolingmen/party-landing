import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function readCss(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8').replace(/\r\n/g, '\n');
}

test('global shell defines frameless heading rhythm and section tone hooks', () => {
  const globalCss = readCss('src/styles/global.css');
  const tokensCss = readCss('src/styles/tokens.css');

  expect(globalCss).toContain('.site-shell::before');
  expect(globalCss).toContain("[data-section-surface='canvas']");
  expect(globalCss).toContain("[data-heading-align='center']");
  expect(globalCss).toContain("[data-section-tone='rose']");
  expect(globalCss).not.toContain('.site-section__eyebrow');
  expect(globalCss).not.toContain('.site-section__content');
  expect(globalCss).not.toContain('story-trail');
  expect(tokensCss).toContain('--tone-rose:');
  expect(tokensCss).toContain('--tone-lemon:');
  expect(tokensCss).toContain('--tone-sky:');
  expect(tokensCss).toContain('--tone-apricot:');
});

test('hero styles keep the clean visual field and large CTA rhythm', () => {
  const css = readCss('src/components/sections/HeroSection.module.css');

  expect(css).toContain('.visualField');
  expect(css).toContain('.visualGlow');
  expect(css).toContain('min-width: 17rem;');
  expect(css).toContain('min-height: 4.8rem;');
  expect(css).toContain('rgba(255, 236, 186');
  expect(css).not.toContain('rgba(110, 191, 255');
});

test('services styles preserve card interactions but drop the outer frame rule', () => {
  const css = readCss('src/components/sections/ServicesSection.module.css');

  expect(css).toContain('.sectionBody {');
  expect(css).toContain('.card {');
  expect(css).toContain('.revealButton {');
  expect(css).toContain('transform: translate3d(0, -8px, 0);');
  expect(css).not.toContain('.frame {');
});

test('reviews faq and contact styles rely on internal structure without outer frame classes', () => {
  const reviewsCss = readCss('src/components/sections/ReviewsSection.module.css');
  const faqCss = readCss('src/components/sections/FaqSection.module.css');
  const contactCss = readCss('src/components/sections/ContactPlaceholderSection.module.css');

  expect(reviewsCss).toContain('.sectionBody {');
  expect(reviewsCss).toContain('@keyframes slideSwapInNext');
  expect(reviewsCss).not.toContain('.frame {');
  expect(faqCss).toContain('.sectionBody {');
  expect(faqCss).toContain('.item::before');
  expect(faqCss).not.toContain('.frame {');
  expect(contactCss).toContain('.sectionBody {');
  expect(contactCss).toContain('.action {');
  expect(contactCss).not.toContain('.frame {');
});

test('cta stays a band while the header remains transparent at rest', () => {
  const ctaCss = readCss('src/components/sections/CtaSection.module.css');
  const headerCss = readCss('src/components/layout/SiteHeader.module.css');
  const footerCss = readCss('src/components/layout/SiteFooter.module.css');

  expect(ctaCss).toContain('.section {');
  expect(ctaCss).toContain('width: 100%;');
  expect(ctaCss).toContain('#f2a14b');
  expect(ctaCss).toContain('font-weight: 800;');
  expect(headerCss).toContain(".header[data-header-route='home'][data-header-state='rest']");
  expect(headerCss).toContain('.headerCtaArrow');
  expect(footerCss).toContain('width: 3.1rem;');
});
