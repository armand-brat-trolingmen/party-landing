# Performance Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve loading speed and Core Web Vitals for the current landing site by optimizing hero media, image delivery, font loading, and noncritical client work without breaking the existing SSR/SSG flow.

**Architecture:** Keep the server-rendered homepage structure intact and focus the pass on asset delivery plus safe runtime deferral. Hero media becomes the main responsive image pipeline, below-the-fold images get consistent modern-format delivery and dimensions, the font path is de-duplicated, and only noncritical client-only pieces are deferred.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, CSS Modules, SSR/SSG prerender, Google Fonts, Lighthouse

---

## File Map

- Modify: `web/index.html`
  - Keep non-blocking font loading
  - Add or refine resource hints for critical assets only
- Modify: `web/src/styles/global.css`
  - Remove duplicate font `@import`
- Modify: `web/src/data/siteContent.ts`
  - Extend hero slide metadata with dimensions, fallbacks, and responsive sources
- Modify: `web/src/components/sections/HeroPosterCarousel.tsx`
  - Render hero images through `<picture>` with explicit sizes and eager/LCP tuning
- Modify: `web/src/components/sections/HeroPosterCarousel.test.tsx`
  - Verify new hero image delivery attributes
- Modify: `web/src/data/catalogContent.ts`
  - Complete homepage service-card image metadata with fallback and sizing
- Modify: `web/src/components/sections/ServicesSection.tsx`
  - Render service-card media through `<picture>` and reserve media space
- Modify: `web/src/components/sections/ServicesSection.test.tsx`
  - Verify service-card image attributes and loading behavior
- Modify: `web/src/pages/index.tsx`
  - Add preload for the first hero LCP image
- Modify: `web/src/components/layout/SiteShell.tsx`
  - Defer safe noncritical client pieces such as modal payload and Speed Insights
- Modify: `web/site.config.test.ts`
  - Keep env/site-config behavior covered if preload logic touches URLs
- Create/Modify: `web/public/images/hero/*.webp`
  - Add responsive hero image variants
- Create: `web/public/images/services-home-fallback/*`
  - Keep PNG fallback copies for service-card media

## Task 1: Lock In The Current Site As A Safety Point

**Files:**
- Modify: local git history on branch `codex/performance-pass`

- [ ] **Step 1: Confirm the current branch and dirty state**

Run:

```powershell
git branch --show-current
git status --short
```

Expected:
- branch is `codex/performance-pass`
- current landing changes are visible and ready to snapshot

- [ ] **Step 2: Create a local safety commit before performance edits**

Run:

```powershell
git add docs/superpowers/specs/2026-04-09-performance-pass-design.md
git add docs/superpowers/plans/2026-04-09-performance-pass-implementation.md
git add web
git commit -m "chore: snapshot current landing before performance pass"
```

Expected:
- a local commit that preserves the approved current site before optimization work begins

## Task 2: Write Failing Tests For Responsive Hero Delivery

**Files:**
- Modify: `web/src/components/sections/HeroPosterCarousel.test.tsx`
- Modify: `web/src/data/siteContent.ts`
- Modify: `web/src/components/sections/HeroPosterCarousel.tsx`

- [ ] **Step 1: Add hero tests for modern image delivery**

Write failing assertions for:
- first slide uses `<picture>` with a `webp` source
- rendered `<img>` has explicit `width` and `height`
- first hero image is eager/high priority
- non-first hero images are lazy

Example expectations:

```tsx
const image = screen.getByRole('img', { name: /шоколадный фонтан/i });
expect(image).toHaveAttribute('width', '1258');
expect(image).toHaveAttribute('height', '2048');
expect(image).toHaveAttribute('loading', 'eager');
expect(image).toHaveAttribute('fetchpriority', 'high');
expect(screen.getAllByTestId('hero-poster-source-webp')[0]).toHaveAttribute('srcset');
```

- [ ] **Step 2: Run the hero tests to verify they fail**

Run:

```powershell
npm.cmd test -- src/components/sections/HeroPosterCarousel.test.tsx
```

Expected:
- FAIL because the current hero carousel still renders plain `<img>` tags

- [ ] **Step 3: Generate responsive hero assets**

Create `webp` variants for the three hero images at practical widths for the current layout, keeping the original PNG/JPG files as fallbacks.

Suggested widths:
- `480`
- `720`
- `960`

- [ ] **Step 4: Extend hero slide metadata and update the carousel**

In `web/src/data/siteContent.ts`:
- add fallback source path
- add `webpSrcSet`
- add `sizes`
- add `width`
- add `height`

In `web/src/components/sections/HeroPosterCarousel.tsx`:
- replace plain `<img>` with `<picture>`
- keep `eager/high` only on the first slide
- keep `lazy/auto` on later slides

- [ ] **Step 5: Re-run the hero tests**

Run:

```powershell
npm.cmd test -- src/components/sections/HeroPosterCarousel.test.tsx
```

Expected:
- PASS

## Task 3: Write Failing Tests For Homepage Service Image Delivery

**Files:**
- Modify: `web/src/components/sections/ServicesSection.test.tsx`
- Modify: `web/src/data/catalogContent.ts`
- Modify: `web/src/components/sections/ServicesSection.tsx`

- [ ] **Step 1: Add service-card image assertions**

Write failing assertions for homepage cards:
- image renders through fallback `<img>` plus `webp` source
- `width` and `height` are present
- `loading="lazy"` is set

Example:

```tsx
const firstCardImage = within(firstCard).getByTestId('service-card-media-image');
expect(firstCardImage).toHaveAttribute('loading', 'lazy');
expect(firstCardImage).toHaveAttribute('width', '1024');
expect(firstCardImage).toHaveAttribute('height', '1024');
expect(within(firstCard).getByTestId('service-card-media-source-webp')).toHaveAttribute('srcset');
```

- [ ] **Step 2: Run the service-section tests to verify they fail**

Run:

```powershell
npm.cmd test -- src/components/sections/ServicesSection.test.tsx
```

Expected:
- FAIL because the current service-card image rendering is still a direct `<img>`

- [ ] **Step 3: Add fallback image assets and update the section**

Create fallback PNG copies in `web/public/images/services-home-fallback/`.

Then update `web/src/components/sections/ServicesSection.tsx` to:
- use `<picture>`
- keep current hover/reveal behavior
- apply `width`, `height`, and `sizes`
- keep cards below the first viewport lazy-loaded

- [ ] **Step 4: Re-run the service-section tests**

Run:

```powershell
npm.cmd test -- src/components/sections/ServicesSection.test.tsx
```

Expected:
- PASS

## Task 4: Remove Duplicate Font Loading And Preload The Real LCP Asset

**Files:**
- Modify: `web/index.html`
- Modify: `web/src/styles/global.css`
- Modify: `web/src/pages/index.tsx`

- [ ] **Step 1: Write a head-related regression test**

Add or update a test that confirms the homepage emits a preload link for the first hero image through page metadata.

- [ ] **Step 2: Run the targeted head test to verify it fails**

Run:

```powershell
npm.cmd test -- src/App.test.tsx
```

Expected:
- FAIL because the hero preload link is not yet present

- [ ] **Step 3: Remove the duplicate Google Fonts CSS import**

In `web/src/styles/global.css`:
- delete the top-level Google Fonts `@import`

In `web/index.html`:
- keep preconnect
- keep non-blocking stylesheet load
- keep only the weights that are actually used by the site

- [ ] **Step 4: Add first-hero preload in the homepage head**

In `web/src/pages/index.tsx`:
- emit a preload link for the first hero LCP image using the hero metadata

- [ ] **Step 5: Re-run the head test**

Run:

```powershell
npm.cmd test -- src/App.test.tsx
```

Expected:
- PASS

## Task 5: Defer Safe Noncritical Client Runtime

**Files:**
- Modify: `web/src/components/layout/SiteShell.tsx`
- Test: `web/src/components/layout/SiteHeader.test.tsx`
- Test: `web/src/AppRoutes.test.tsx`

- [ ] **Step 1: Add a failing test for deferred runtime pieces if needed**

Only add a test if behavior changes in a visible way. Otherwise document the existing suite that covers shell render stability.

- [ ] **Step 2: Implement safe lazy mounting**

In `web/src/components/layout/SiteShell.tsx`:
- keep header, footer, and page content in the initial SSR output
- lazy-load or client-gate `OrderModal`
- client-gate `SpeedInsights`
- add a minimal fallback that does not cause layout shift

- [ ] **Step 3: Run shell-related tests**

Run:

```powershell
npm.cmd test -- src/components/layout/SiteHeader.test.tsx src/AppRoutes.test.tsx
```

Expected:
- PASS

## Task 6: Final Verification And Local Performance Check

**Files:**
- No new files required

- [ ] **Step 1: Run lint**

Run:

```powershell
npm.cmd run lint
```

Expected:
- PASS with no lint errors

- [ ] **Step 2: Run the focused regression suite**

Run:

```powershell
npm.cmd test -- src/App.test.tsx src/components/sections/HeroPosterCarousel.test.tsx src/components/sections/ServicesSection.test.tsx src/components/layout/SiteHeader.test.tsx src/AppRoutes.test.tsx site.config.test.ts
```

Expected:
- PASS

- [ ] **Step 3: Run the production build**

Run:

```powershell
npm.cmd run build
```

Expected:
- PASS including prerender and sitemap generation

- [ ] **Step 4: Start the optimized local server**

Run:

```powershell
npm.cmd run preview -- --host 127.0.0.1 --port 4185 --strictPort
```

Manual checks:
- hero loads correctly on desktop and mobile
- no image stretching or overflow
- service cards keep hover/reveal behavior
- no visible layout jump from fonts or media

- [ ] **Step 5: Run a local performance audit**

Run a Lighthouse audit against the local built site and record at least:
- performance score
- LCP
- CLS
- INP/TBT proxy where available

- [ ] **Step 6: Pause for manual review**

Open the optimized local site for review before any push.
