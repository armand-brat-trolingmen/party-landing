# Performance Pass Design

Date: 2026-04-09
Branch: `codex/performance-pass`
Scope: local-only performance optimization pass for the current Vite + React landing site, with no push until manual review.

## Goal

Improve real loading performance and Core Web Vitals without changing the site's visual direction or breaking the current SSR/SSG flow.

Primary targets:
- reduce LCP pressure from hero media and render-blocking assets
- reduce CLS by reserving image and dynamic-content space
- improve INP/FID by deferring noncritical client work
- keep mobile behavior correct and visually stable

## Constraints

- Work happens only locally until the site is reviewed.
- Changes must be isolated on `codex/performance-pass` so the current site can be restored easily.
- The current app uses SSR/SSG with `renderToString`, so aggressive `React.lazy()` across server-rendered sections is out of scope for this pass.
- Official PageSpeed Insights cannot audit `localhost` or other non-public URLs. For this pass, the current-project baseline will be measured locally with Lighthouse against the built local site. Public PSI can be run later if needed.

## Current Bottlenecks

1. Hero poster images are heavy and currently served as original assets without responsive `picture/srcset`.
2. The first viewport likely uses a large hero image as the LCP candidate.
3. Google Fonts are loaded twice: once in `index.html` and again via CSS `@import`.
4. Some images below the fold are not yet consistently rendered with modern format + fallback + reserved dimensions.
5. Noncritical runtime code such as modal/runtime add-ons is loaded eagerly.

## Proposed Approach

### 1. Image Pipeline

- Convert hero assets to `webp` variants sized for responsive delivery.
- Keep fallback `png/jpg` sources for compatibility.
- Render hero media through `<picture>` with:
  - `srcset`
  - `sizes`
  - `width`
  - `height`
  - eager/high-priority loading only for the first LCP candidate
- Ensure below-the-fold images use `loading="lazy"` and explicit dimensions.
- Preserve existing service-card `webp` work and extend it with fallback and dimensions where missing.

### 2. Fonts and Critical Rendering Path

- Remove the duplicate Google Fonts `@import` from global CSS.
- Keep preconnects and non-blocking stylesheet loading in `index.html`.
- Limit loaded weights to the actual set used by the design.
- Add critical preload only for truly first-frame resources, mainly the first hero image candidate.

### 3. Lazy Loading and JS Cost

- Defer or lazily mount only safe noncritical runtime pieces, such as modal and analytics-like add-ons.
- Keep server-rendered content in the initial HTML to avoid SSR regressions.
- Add lightweight fallback UI where lazy client-only mounting is introduced.

### 4. CLS and Layout Stability

- Ensure image containers and media have stable aspect ratios or explicit dimensions.
- Reserve space for dynamic states such as expanding content and lazy-mounted UI.
- Verify mobile layouts do not introduce overflow or late layout shifts.

### 5. Verification

- Write or update tests before changing behavior where practical.
- Run targeted unit tests for hero, services, head/meta, and shell behavior.
- Run `lint` and full `build`.
- Run local Lighthouse against the optimized local site for before/after comparison where possible.

## Files Expected To Change

- `web/index.html`
- `web/src/styles/global.css`
- `web/src/components/sections/HeroPosterCarousel.tsx`
- `web/src/components/sections/HeroPosterCarousel.test.tsx`
- `web/src/components/sections/ServicesSection.tsx`
- `web/src/components/sections/ServicesSection.test.tsx`
- `web/src/components/layout/SiteShell.tsx`
- `web/src/pages/index.tsx`
- `web/src/data/siteContent.ts`
- `web/src/data/catalogContent.ts`
- `web/public/images/hero/*`
- `web/public/images/services-home-fallback/*`

## Non-Goals

- No visual redesign of sections.
- No route architecture rewrite.
- No migration from `renderToString` to streaming SSR in this pass.
- No push to GitHub until local review is complete.
