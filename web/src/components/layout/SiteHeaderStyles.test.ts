import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function sliceBetween(source: string, startMarker: string, endMarker?: string) {
  const startIndex = source.indexOf(startMarker);
  if (startIndex === -1) {
    return '';
  }

  const endIndex = endMarker ? source.indexOf(endMarker, startIndex + startMarker.length) : -1;
  return endIndex === -1 ? source.slice(startIndex) : source.slice(startIndex, endIndex);
}

test('tablet-and-mobile header switches to the compact menu layout before nav items start colliding', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/layout/SiteHeader.module.css'), 'utf8');
  const mobileBlock = sliceBetween(css, '@media (max-width: 960px)', '@media (max-width: 420px)');
  const mobileNarrowBlock = sliceBetween(css, '@media (max-width: 420px)', '@media (max-width: 360px)');
  const mobileUltraNarrowBlock = sliceBetween(css, '@media (max-width: 360px)');

  expect(css).toContain('@media (max-width: 960px)');
  expect(mobileBlock).toContain('--header-brand-plate-size-rest: 4.72rem;');
  expect(mobileBlock).toContain('--header-pad-top-compact: calc(0.22rem + env(safe-area-inset-top, 0px));');
  expect(mobileBlock).toContain('--header-brand-gap-rest: 0.76rem;');
  expect(mobileBlock).toContain('--header-brand-gap-compact: 0.42rem;');
  expect(mobileBlock).toContain('--header-brand-text-size-rest: 0.89rem;');
  expect(mobileBlock).toContain('--header-brand-text-max-width-rest: 13.6rem;');
  expect(mobileBlock).toContain('--header-menu-size-rest: 2.7rem;');
  expect(mobileBlock).toContain('--header-brand-plate-size-compact: 3.12rem;');
  expect(mobileBlock).toContain('--header-brand-text-size-compact: 0.72rem;');
  expect(mobileBlock).toContain('--header-brand-text-max-width-compact: 10.2rem;');
  expect(css).toContain('@media (max-width: 420px)');
  expect(mobileNarrowBlock).toContain('--header-brand-plate-size-rest: 4.18rem;');
  expect(mobileNarrowBlock).toContain('--header-brand-gap-rest: 0.68rem;');
  expect(mobileNarrowBlock).toContain('--header-brand-gap-compact: 0.38rem;');
  expect(mobileNarrowBlock).toContain('--header-brand-text-size-rest: 0.8rem;');
  expect(mobileNarrowBlock).toContain('--header-brand-text-max-width-rest: 10.4rem;');
  expect(mobileNarrowBlock).toContain('--header-menu-size-rest: 2.62rem;');
  expect(mobileNarrowBlock).toContain('--header-brand-plate-size-compact: 2.88rem;');
  expect(mobileNarrowBlock).toContain('--header-brand-text-size-compact: 0.6rem;');
  expect(css).toContain('@media (max-width: 360px)');
  expect(mobileUltraNarrowBlock).toContain('--header-inner-pad-x-rest: 0.62rem;');
  expect(mobileUltraNarrowBlock).toContain('--header-brand-gap-rest: 0.56rem;');
  expect(mobileUltraNarrowBlock).toContain('--header-brand-plate-size-rest: 3.82rem;');
  expect(mobileBlock).not.toContain('white-space: normal;');
  expect(mobileNarrowBlock).not.toContain('white-space: normal;');
  expect(mobileUltraNarrowBlock).not.toContain('white-space: normal;');
});

test('desktop header scales the brand block up so the logo reads clearly', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/layout/SiteHeader.module.css'), 'utf8');

  expect(css).toContain('--header-progress: 0;');
  expect(css).toContain('--header-logo-scale-rest: 1.3;');
  expect(css).toContain('--header-logo-scale-compact: 1.62;');
  expect(css).toContain('--header-cta-min-height-rest: 4.2rem;');
  expect(css).toContain('padding: var(--header-inner-pad-y) var(--header-inner-pad-x);');
  expect(css).toContain('padding: 0;');
  expect(css).toContain('background: transparent;');
  expect(css).toContain('width: calc(100% * var(--header-logo-scale));');
});

test('compact desktop header eases the logo back down after the hero state', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/layout/SiteHeader.module.css'), 'utf8');

  expect(css).toContain('--header-logo-scale-compact: 1.62;');
  expect(css).toContain('--header-brand-gap-compact: 0.82rem;');
  expect(css).toContain('--header-pad-top-compact: 0.28rem;');
});

test('mobile header grows in the static state and shrinks back after scroll', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/layout/SiteHeader.module.css'), 'utf8');

  expect(css).toContain('--header-logo-scale-rest: 2.36;');
  expect(css).toContain('--header-logo-scale-compact: 1.98;');
});

test('brand text stays in one line without horizontal ellipsis clipping', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/layout/SiteHeader.module.css'), 'utf8');
  const brandTextBlock = sliceBetween(css, '.brandText {', '.brand:hover');

  expect(brandTextBlock).toContain('white-space: nowrap;');
  expect(brandTextBlock).toContain('overflow: visible;');
  expect(brandTextBlock).toContain('text-overflow: clip;');
  expect(brandTextBlock).toContain('letter-spacing: 0;');
  expect(brandTextBlock).not.toContain('text-overflow: ellipsis;');
});

test('header transitions compact sizing more smoothly across scroll states', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/layout/SiteHeader.module.css'), 'utf8');

  expect(css).toContain('--header-pad-top: calc(');
  expect(css).toContain('--header-brand-plate-size: calc(');
  expect(css).toContain('backdrop-filter: blur(calc(18px * var(--header-progress)))');
});

test('mobile rest header avoids a hard-coded text offset and uses a measured shift variable instead', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/layout/SiteHeader.module.css'), 'utf8');
  const mobileBlock = sliceBetween(css, '@media (max-width: 960px)', '@media (max-width: 420px)');

  expect(css).toContain('--mobile-brand-text-shift: 0px;');
  expect(mobileBlock).toContain("transform: translateX(var(--mobile-brand-text-shift));");
  expect(mobileBlock).not.toContain('transform: translateX(clamp(');
});
