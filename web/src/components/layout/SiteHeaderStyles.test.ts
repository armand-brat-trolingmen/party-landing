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
  expect(mobileBlock).toContain('--header-brand-plate-size-rest: 4.7rem;');
  expect(mobileBlock).toContain('--header-pad-top-compact: env(safe-area-inset-top, 0px);');
  expect(mobileBlock).toContain('--header-brand-text-size-rest: 0.89rem;');
  expect(mobileBlock).toContain('--header-brand-text-max-width-rest: 11rem;');
  expect(mobileBlock).toContain('--header-menu-size-rest: 2.7rem;');
  expect(mobileBlock).toContain('--header-brand-plate-size-compact: 2.7rem;');
  expect(mobileBlock).toContain('--header-brand-text-size-compact: 0.62rem;');
  expect(mobileBlock).toContain('--header-brand-text-max-width-compact: 8.8rem;');
  expect(css).toContain('@media (max-width: 420px)');
  expect(mobileNarrowBlock).toContain('--header-brand-plate-size-rest: 4.15rem;');
  expect(mobileNarrowBlock).toContain('--header-brand-text-size-rest: 0.76rem;');
  expect(mobileNarrowBlock).toContain('--header-brand-text-max-width-rest: 8.7rem;');
  expect(mobileNarrowBlock).toContain('--header-menu-size-rest: 2.62rem;');
  expect(mobileNarrowBlock).toContain('--header-brand-plate-size-compact: 2.46rem;');
  expect(mobileNarrowBlock).toContain('--header-brand-text-size-compact: 0.54rem;');
  expect(css).toContain('@media (max-width: 360px)');
  expect(mobileUltraNarrowBlock).toContain('--header-inner-pad-x-rest: 0.62rem;');
  expect(mobileUltraNarrowBlock).toContain('--header-brand-gap-rest: 0.24rem;');
  expect(mobileUltraNarrowBlock).toContain('--header-brand-plate-size-rest: 3.5rem;');
  expect(mobileBlock).not.toContain('white-space: normal;');
  expect(mobileNarrowBlock).not.toContain('white-space: normal;');
  expect(mobileUltraNarrowBlock).not.toContain('white-space: normal;');
});

test('desktop header scales the brand block up so the logo reads clearly', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/layout/SiteHeader.module.css'), 'utf8');

  expect(css).toContain('--header-progress: 0;');
  expect(css).toContain('--header-brand-plate-size-rest: 11rem;');
  expect(css).toContain('--header-cta-min-height-rest: 4.2rem;');
  expect(css).toContain('padding: var(--header-inner-pad-y) var(--header-inner-pad-x);');
  expect(css).toContain('padding: 0;');
  expect(css).toContain('background: transparent;');
});

test('compact desktop header eases the logo back down after the hero state', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/layout/SiteHeader.module.css'), 'utf8');

  expect(css).toContain('--header-brand-plate-size-compact: 3.7rem;');
  expect(css).toContain('--header-brand-gap-compact: 0.56rem;');
  expect(css).toContain('--header-pad-top-compact: 0.28rem;');
});

test('mobile header grows in the static state and shrinks back after scroll', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/layout/SiteHeader.module.css'), 'utf8');

  expect(css).toContain('--header-brand-plate-size-compact: 2.7rem;');
  expect(css).toContain('--header-brand-text-size-compact: 0.62rem;');
  expect(css).toContain('--header-brand-plate-size-compact: 2.46rem;');
  expect(css).toContain('--header-brand-text-size-compact: 0.54rem;');
});

test('header transitions compact sizing more smoothly across scroll states', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/components/layout/SiteHeader.module.css'), 'utf8');

  expect(css).toContain('--header-pad-top: calc(');
  expect(css).toContain('--header-brand-plate-size: calc(');
  expect(css).toContain('backdrop-filter: blur(calc(18px * var(--header-progress)))');
});
