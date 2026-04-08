# Canvas Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the landing page so it reads as one artistic canvas, replace the interface logo with the real project logo, rebuild the hero, shrink the about/CTA sections, and stabilize the test environment without breaking Russian text encoding.

**Architecture:** Keep the existing Vite/React section structure and routing, but shift the design system toward one continuous page canvas. Reuse the current data-driven architecture, update content and tests first, then refactor the global surface styling and the most visible sections in place. Stabilization work happens first so later visual verification uses the correct local app and not a stale preview server.

**Tech Stack:** React 19, TypeScript, Vite, CSS Modules, React Router, react-helmet-async, Vitest, Playwright

---

## File Map

**Create**
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/public/brand-logo.png` — copy of the approved root logo for browser-safe app usage

**Modify**
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/playwright.config.ts` — isolate Playwright from stale local servers
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/styles/MotionTheme.test.ts` — remove brittle line-ending assertions
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/site.config.js` — update default site name if branding changes here
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/data/siteContent.ts` — approved brand text, hero copy, about manifesto/facts, CTA text
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/data/footerContent.ts` — footer brand text, legal text, contact links, optional footer logo behavior
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/config/seo.ts` — absolute logo URL and brand naming consistency
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/branding/DonutLogo.tsx` — replace the drawn donut mark with the real logo image wrapper
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/layout/SiteHeader.tsx` — add text brand, calmer CTA trigger, keep anchor logic
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/layout/SiteHeader.module.css` — remove bubble badge effect and soften header composition
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/layout/SiteFooter.tsx` — use the real logo without text lockup duplication
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/layout/SiteFooter.module.css` — subtle milk support for the logo on dark footer
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/HeroSection.tsx` — poster-style hero copy and button behavior
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/HeroSection.module.css` — cleaner left/right hero composition with soft light field
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/scene/HeroScene.tsx` — reduce to an empty light field instead of object cards
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/scene/HeroScene.module.css` — remove decorative object motion and keep only the soft light canvas
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/AboutSection.tsx` — compact manifesto plus mini-facts
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/AboutSection.module.css` — lighter, smaller about section presentation
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ContactPlaceholderSection.tsx` — preserve inline CTA logic while shrinking visual mass
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ContactPlaceholderSection.module.css` — compact inline CTA mini-block integrated into the page canvas
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/styles/tokens.css` — add softer pink/blue page tokens
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/styles/global.css` — canvas-like section blending and full decorative cleanup
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/App.test.tsx` — reflect the new brand and composition
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/layout/SiteHeader.test.tsx` — reflect text brand beside the logo
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/layout/SiteFooter.test.tsx` — reflect footer branding and contact expectations
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/HeroSection.test.tsx` — assert the clean hero copy/buttons
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/e2e/landing.spec.ts` — remove assumptions tied to the old hero/cards/decor and validate the new flow

---

### Task 1: Stabilize local test and asset foundations

**Files:**
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/public/brand-logo.png`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/playwright.config.ts`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/styles/MotionTheme.test.ts`

- [ ] **Step 1: Copy the approved logo into the app public directory**

Run:
```powershell
Copy-Item -LiteralPath 'C:\Users\606ru\OneDrive\Desktop\але\site\логотип.png' 'C:\Users\606ru\OneDrive\Desktop\але\site\web\public\brand-logo.png' -Force
```

Expected:
- `web/public/brand-logo.png` exists and can be referenced by the app without relying on a parent directory path

- [ ] **Step 2: Write a failing test assertion that normalizes CSS line endings**

Update `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/styles/MotionTheme.test.ts` so the brittle checks no longer depend on hard-coded `\n`.

Example:
```ts
const heroCss = readFileSync(resolve(process.cwd(), 'src/components/scene/HeroScene.module.css'), 'utf8').replace(/\r\n/g, '\n');

expect(heroCss).toContain('.item {\n    animation-duration: 13.4s;');
```

- [ ] **Step 3: Run the targeted motion test to verify it fails before the normalization edit**

Run:
```powershell
npm run test -- --run src/styles/MotionTheme.test.ts
```

Expected:
- FAIL on Windows line-ending sensitivity in the current assertion

- [ ] **Step 4: Implement the line-ending normalization**

Update `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/styles/MotionTheme.test.ts` so every raw CSS string that is asserted with multiline expectations is normalized via `.replace(/\r\n/g, '\n')`.

- [ ] **Step 5: Fix Playwright so it cannot quietly reuse a stale server from another worktree**

Update `C:/Users/606ru/OneDrive/Desktop/але/site/web/playwright.config.ts`:

```ts
const port = 4179;

export default defineConfig({
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
  },
});
```

The exact port may differ, but it must be dedicated to this app and must use `--strictPort`.

- [ ] **Step 6: Re-run the targeted motion test**

Run:
```powershell
npm run test -- --run src/styles/MotionTheme.test.ts
```

Expected:
- PASS

- [ ] **Step 7: Commit the stabilization groundwork**

Run:
```powershell
git add web/public/brand-logo.png web/playwright.config.ts web/src/styles/MotionTheme.test.ts
git commit -m "chore: stabilize local test and logo foundations"
```

Expected:
- a commit exists with the stable asset path and test-environment fixes

---

### Task 2: Update the brand model and test expectations

**Files:**
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/site.config.js`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/data/siteContent.ts`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/data/footerContent.ts`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/config/seo.ts`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/App.test.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/layout/SiteHeader.test.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/layout/SiteFooter.test.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/HeroSection.test.tsx`

- [ ] **Step 1: Write the failing tests for the new brand and hero copy**

Adjust tests to expect:
- visible text brand `Праздник каждый день` in the header
- footer without the old `Party Everyday` text lockup assumption
- hero heading `Фуд-станции на ваше мероприятие`
- exactly two hero buttons: `Заказать` and `В каталог`

Example for hero:
```tsx
expect(screen.getByRole('heading', { name: 'Фуд-станции на ваше мероприятие' })).toBeInTheDocument();
expect(screen.getByRole('button', { name: 'Заказать' })).toBeInTheDocument();
expect(screen.getByRole('link', { name: 'В каталог' })).toHaveAttribute('href', '#services');
```

- [ ] **Step 2: Run the targeted tests to verify they fail under the old content**

Run:
```powershell
npm run test -- --run src/App.test.tsx src/components/layout/SiteHeader.test.tsx src/components/layout/SiteFooter.test.tsx src/components/sections/HeroSection.test.tsx
```

Expected:
- FAIL because the current project still expects `Party Everyday` branding and the old hero composition

- [ ] **Step 3: Update the centralized content model**

In `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/data/siteContent.ts`:
- change `brand` to `Праздник каждый день`
- replace the current hero copy with the approved heading-only structure
- add a short manifesto string for `О нас`
- replace the current heavy about content with the confirmed fact set
- keep CTA content semantics intact, only rephrase if the component shape requires it

In `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/data/footerContent.ts`:
- change visible footer brand naming
- keep legal contact data unless intentionally updated
- preserve legal route content unless the brand name should be synchronized inside those documents too

In `C:/Users/606ru/OneDrive/Desktop/але/site/web/site.config.js` and `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/config/seo.ts`:
- update the default site name
- point the SEO logo URL at `/brand-logo.png`

- [ ] **Step 4: Re-run the brand/content test suite**

Run:
```powershell
npm run test -- --run src/App.test.tsx src/components/layout/SiteHeader.test.tsx src/components/layout/SiteFooter.test.tsx src/components/sections/HeroSection.test.tsx
```

Expected:
- PASS or only fail on visual structure that will be fixed in the next tasks

- [ ] **Step 5: Commit the brand model changes**

Run:
```powershell
git add web/site.config.js web/src/data/siteContent.ts web/src/data/footerContent.ts web/src/config/seo.ts web/src/App.test.tsx web/src/components/layout/SiteHeader.test.tsx web/src/components/layout/SiteFooter.test.tsx web/src/components/sections/HeroSection.test.tsx
git commit -m "feat: align brand model with canvas redesign"
```

Expected:
- a commit exists with the approved naming and test expectations

---

### Task 3: Replace the interface logo and soften header/footer branding

**Files:**
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/branding/DonutLogo.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/layout/SiteHeader.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/layout/SiteHeader.module.css`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/layout/SiteFooter.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/layout/SiteFooter.module.css`

- [ ] **Step 1: Write or tighten tests for the new header/footer logo presentation**

Add assertions for:
- header shows the real logo image and visible text brand
- header no longer relies on a decorative bubble badge
- footer uses the logo without a text lockup next to it
- footer logo support surface is subtle and milk-toned rather than a capsule badge

- [ ] **Step 2: Run the targeted header/footer tests**

Run:
```powershell
npm run test -- --run src/components/layout/SiteHeader.test.tsx src/components/layout/SiteFooter.test.tsx
```

Expected:
- FAIL until the component markup and styles are updated

- [ ] **Step 3: Replace the SVG donut implementation with a thin real-logo wrapper**

Refactor `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/branding/DonutLogo.tsx` into a lightweight reusable image component that renders:

```tsx
<img
  aria-hidden="true"
  data-testid="donut-logo"
  src="/brand-logo.png"
  alt=""
  width={size}
  height={size}
  decoding="async"
/>
```

Keep the exported component name if that reduces churn, even if the internal implementation changes.

- [ ] **Step 4: Update header markup**

In `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/layout/SiteHeader.tsx`:
- keep the anchor navigation logic and active-state handling
- add visible text `Праздник каждый день` next to the logo
- keep the `Связаться` trigger, but make it calmer in structure and semantics
- preserve the mobile menu behavior

- [ ] **Step 5: Update footer markup**

In `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/layout/SiteFooter.tsx`:
- render only the clean logo symbol visually
- avoid duplicating a full logo lockup beside it
- preserve all legal and contact links

- [ ] **Step 6: Soften header and footer styling**

In the CSS modules:
- remove the bubble/capsule treatment from the header logo holder
- reduce shadow drama around the logo
- soften the header CTA trigger into a lighter accent
- add only a minimal milk-toned support behind the footer logo for dark-background contrast

- [ ] **Step 7: Re-run the header/footer tests**

Run:
```powershell
npm run test -- --run src/components/layout/SiteHeader.test.tsx src/components/layout/SiteFooter.test.tsx
```

Expected:
- PASS

- [ ] **Step 8: Commit the branding refactor**

Run:
```powershell
git add web/src/components/branding/DonutLogo.tsx web/src/components/layout/SiteHeader.tsx web/src/components/layout/SiteHeader.module.css web/src/components/layout/SiteFooter.tsx web/src/components/layout/SiteFooter.module.css
git commit -m "feat: replace interface branding with project logo"
```

Expected:
- a commit exists with the new logo usage and calmer header/footer presentation

---

### Task 4: Turn the page into one soft canvas and remove decorative clutter

**Files:**
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/styles/tokens.css`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/styles/global.css`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/AboutSection.module.css`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ContactPlaceholderSection.module.css`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/HeroSection.module.css`

- [ ] **Step 1: Write the failing style assertions for the new canvas rules**

Update style tests so they assert:
- no story-trail hanging lamps remain in `global.css`
- softer page-wide gradients exist
- pink and muted blue tokens exist in `tokens.css`
- panel shadows and borders are lighter than before

Examples:
```ts
expect(globalCss).not.toContain('.site-shell[data-motion-path=\'story-trail\'] > #about::before');
expect(globalCss).toContain('radial-gradient(circle at 18% 12%, rgba(');
expect(tokensCss).toContain('--accent-blue-soft:');
```

- [ ] **Step 2: Run the style-focused tests**

Run:
```powershell
npm run test -- --run src/styles/MotionTheme.test.ts
```

Expected:
- FAIL because the old decorative trails and glow lamps still exist

- [ ] **Step 3: Expand the token palette**

In `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/styles/tokens.css`, add or adjust tokens for:
- gentle pink
- muted soft blue
- milk/cream transitions
- lighter panel shadows and borders

- [ ] **Step 4: Rewrite the global canvas styling**

In `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/styles/global.css`:
- remove all hanging lamp and bead-style decorative pseudo-elements
- replace them with broad page-wide color drifts
- keep section structure intact but visually softer
- reduce the feeling of isolated panels

- [ ] **Step 5: Lighten local section surfaces**

In the section CSS modules, reduce:
- border strength
- shadow depth
- local surface isolation

Keep enough structure for readability, but remove the “mini-page” feeling.

- [ ] **Step 6: Re-run the style tests**

Run:
```powershell
npm run test -- --run src/styles/MotionTheme.test.ts
```

Expected:
- PASS after the assertions are updated to the new visual system

- [ ] **Step 7: Commit the page-canvas styling**

Run:
```powershell
git add web/src/styles/tokens.css web/src/styles/global.css web/src/components/sections/AboutSection.module.css web/src/components/sections/ContactPlaceholderSection.module.css web/src/components/sections/HeroSection.module.css web/src/styles/MotionTheme.test.ts
git commit -m "feat: unify page sections into a single canvas"
```

Expected:
- a commit exists with the new background flow and decorative cleanup

---

### Task 5: Rebuild the hero, shrink the about section, and compact the inline CTA

**Files:**
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/HeroSection.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/scene/HeroScene.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/scene/HeroScene.module.css`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/AboutSection.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ContactPlaceholderSection.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/e2e/landing.spec.ts`

- [ ] **Step 1: Write the failing structural tests for the new hero and about section**

Assert:
- hero contains only the approved heading and two actions
- hero no longer contains the old descriptive paragraph
- `О нас` contains a short manifesto and the 3 mini-facts
- CTA remains in the current page position but uses a smaller form shell

- [ ] **Step 2: Run the targeted section tests**

Run:
```powershell
npm run test -- --run src/App.test.tsx src/components/sections/HeroSection.test.tsx src/components/sections/AboutSection.test.tsx src/components/sections/ContactPlaceholderSection.test.tsx
```

Expected:
- FAIL because the current hero/about/CTA still use the old structure

- [ ] **Step 3: Rebuild the hero structure**

In `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/HeroSection.tsx`:
- remove the support paragraph
- keep only the approved heading
- render a primary `Заказать` action that opens the existing popup flow
- render a secondary `В каталог` anchor to `#services`

- [ ] **Step 4: Strip HeroScene down to a soft-light field**

In `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/scene/HeroScene.tsx` and its CSS:
- remove object cards and decorative image composition
- keep a clean right-side light field
- preserve enough structure for future art-directed content

- [ ] **Step 5: Compact the about section**

In `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/AboutSection.tsx`:
- replace the heavy atelier composition with a short manifesto
- add the 3 confirmed fact items
- keep the section readable, but substantially smaller

- [ ] **Step 6: Compact the inline CTA**

In `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ContactPlaceholderSection.tsx`:
- preserve the short inline form
- preserve current CTA messaging semantics
- remove the oversized section feeling
- keep it integrated with the page canvas instead of a hard block

- [ ] **Step 7: Update e2e coverage to the new composition**

In `C:/Users/606ru/OneDrive/Desktop/але/site/web/e2e/landing.spec.ts`:
- drop assertions that depend on hero object cards or the decorative hanging lights
- keep navigation, services access, mobile menu, CTA visibility, and section flow checks
- add assertions for the clean hero and compact about/CTA structure where useful

- [ ] **Step 8: Re-run the targeted unit suite**

Run:
```powershell
npm run test -- --run src/App.test.tsx src/components/sections/HeroSection.test.tsx src/components/sections/AboutSection.test.tsx src/components/sections/ContactPlaceholderSection.test.tsx
```

Expected:
- PASS

- [ ] **Step 9: Run the Playwright suite**

Run:
```powershell
npm run test:e2e
```

Expected:
- PASS against the dedicated local dev server, not a reused preview process

- [ ] **Step 10: Commit the section redesign**

Run:
```powershell
git add web/src/components/sections/HeroSection.tsx web/src/components/scene/HeroScene.tsx web/src/components/scene/HeroScene.module.css web/src/components/sections/AboutSection.tsx web/src/components/sections/ContactPlaceholderSection.tsx web/e2e/landing.spec.ts
git commit -m "feat: redesign hero about and inline cta"
```

Expected:
- a commit exists with the section-level redesign

---

### Task 6: Run full verification and guard against encoding regressions

**Files:**
- Verify only, unless a fix is required

- [ ] **Step 1: Run the linter**

Run:
```powershell
npm run lint
```

Expected:
- PASS

- [ ] **Step 2: Run the full unit suite**

Run:
```powershell
npm run test
```

Expected:
- PASS

- [ ] **Step 3: Run the production build**

Run:
```powershell
npm run build
```

Expected:
- PASS, with prerendered `/`, `/privacy`, `/terms`, and `/consent`

- [ ] **Step 4: Spot-check rendered Russian text in the generated HTML**

Run:
```powershell
Get-Content -Raw 'C:\Users\606ru\OneDrive\Desktop\але\site\web\dist\index.html'
```

Expected:
- the approved Russian strings are readable and not mojibake in the built output

- [ ] **Step 5: Commit final verification and cleanup**

Run:
```powershell
git add web
git commit -m "test: verify canvas redesign"
```

Expected:
- a final verification commit exists with green checks and no encoding regressions
