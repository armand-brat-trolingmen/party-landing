# Multipage Catalog Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the current Party Everyday landing into a multipage catalog website with internal service and extra-service pages, a unified CTA modal, and a shared brand shell, while keeping the current visual language intact.

**Architecture:** Treat the homepage as the brand hub and add dynamic internal routes for main services and extra services. Move content from section-first data to entity-first catalog data, introduce reusable page templates for offer pages, and update SEO/prerender/sitemap so each service-like page becomes a real pre-rendered internal URL.

**Tech Stack:** React 19, TypeScript, Vite, React Router, react-helmet-async, current SSG/prerender flow, CSS Modules, Vitest, Playwright.

---

## File Map

**Create**
- `src/data/catalogContent.ts` — entity-first content store for `services`, `extras`, `moments`, `reviews`, CTA copy, and homepage copy
- `src/components/sections/ExtrasSection.tsx` — horizontal extra-services ribbon on the homepage
- `src/components/sections/ExtrasSection.module.css` — styling for the extra-services ribbon
- `src/components/sections/CtaSection.tsx` — reusable CTA block rendered on homepage and offer pages
- `src/components/sections/CtaSection.module.css` — CTA block styling
- `src/components/sections/TestimonialsSection.tsx` — screenshot-based reviews section with Avito proof link
- `src/components/sections/TestimonialsSection.module.css` — reviews section styling
- `src/components/cta/OrderModal.tsx` — unified order modal with name/phone form
- `src/components/cta/OrderModal.module.css` — modal styling
- `src/components/pages/OfferingPageTemplate.tsx` — shared template for `/services/:slug` and `/extras/:slug`
- `src/components/pages/OfferingPageTemplate.module.css` — template-specific layout styling
- `src/pages/service.tsx` — main service detail route page using route params
- `src/pages/extra.tsx` — extra-service detail route page using route params
- `src/components/sections/TestimonialsSection.test.tsx` — tests for review screenshots and Avito link
- `src/components/cta/OrderModal.test.tsx` — tests for modal behavior and consent links
- `src/pages/service.test.tsx` — route-data rendering tests for service pages
- `src/pages/extra.test.tsx` — route-data rendering tests for extra-service pages

**Modify**
- `src/App.tsx` — rebuild homepage section order
- `src/AppRoutes.tsx` — add `/services/:slug` and `/extras/:slug`
- `src/pages/index.tsx` — homepage SEO/schema may change after content model move
- `src/components/layout/SiteHeader.tsx` — route-aware header, section navigation, header CTA button
- `src/components/layout/SiteHeader.module.css` — header styling adjustments for new CTA and nav labels
- `src/components/sections/HeroSection.tsx` — keep existing design but update copy/actions for new hub flow
- `src/components/sections/HeroSection.module.css` — button and copy adjustments if needed
- `src/components/sections/AboutSection.tsx` — add counter/fact presentation
- `src/components/sections/AboutSection.module.css` — counter styling
- `src/components/sections/ServicesSection.tsx` — transform into revealable menu-style catalog
- `src/components/sections/ServicesSection.module.css` — grid, reveal, action button styling
- `src/components/sections/ReviewsSection.tsx` — repurpose into pure moments gallery before actual reviews
- `src/components/sections/ReviewsSection.module.css` — keep gallery styling aligned with new role
- `src/components/sections/ContactPlaceholderSection.tsx` — reuse as final Contacts section in hub and internal pages
- `src/data/siteContent.ts` — trim old landing-specific structures or move reusable values out
- `src/config/seo.ts` — add SEO builders for homepage, service pages, and extra-service pages; update schema helpers
- `src/components/StructuredData.tsx` — verify compatibility with page-specific service schema
- `prerender.js` — generate all dynamic service and extra-service HTML pages
- `generate-sitemap.js` — include every service and extra-service URL
- `src/AppRoutes.test.tsx` — cover new route set
- `src/App.test.tsx` — update homepage content expectations
- `src/seoMeta.test.ts` — validate route-level SEO for homepage and offer pages

**Verify / output**
- `dist/index.html`
- `dist/services/<slug>/index.html`
- `dist/extras/<slug>/index.html`
- `dist/sitemap.xml`

---

### Task 1: Refactor content into an entity-first catalog model

**Files:**
- Create: `src/data/catalogContent.ts`
- Modify: `src/data/siteContent.ts`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Write the failing content-shape test**

Add or update tests so they assert the new content layer can provide:
- homepage hero/about/CTA copy
- a `services` collection
- an `extras` collection
- a `moments` collection
- a `reviews` collection

- [ ] **Step 2: Run the failing test**

Run:
```powershell
npm test -- src/App.test.tsx --maxWorkers=1
```

Expected:
- FAIL because the current homepage still depends on section-first landing data

- [ ] **Step 3: Create `catalogContent.ts`**

Define centralized content buckets:
- `homePageContent`
- `services`
- `extras`
- `moments`
- `reviews`
- `ctaContent`

For now, use placeholder services/extras that support:
- `slug`
- `name`
- `shortDescription`
- `fullDescription`
- `image`
- `priceFrom`
- `included`
- `seoTitle`
- `seoDescription`

Use generated working copy for descriptions until final business data is provided.

- [ ] **Step 4: Reduce `siteContent.ts` to reusable global data**

Keep in `siteContent.ts` only what is truly global:
- header labels
- global brand copy
- FAQ
- contact/final section data

Move catalog-specific data out of it.

- [ ] **Step 5: Re-run the test**

Run:
```powershell
npm test -- src/App.test.tsx --maxWorkers=1
```

Expected:
- PASS or a smaller, more focused failure that now belongs to the next task

- [ ] **Step 6: Commit**

```bash
git add src/data/catalogContent.ts src/data/siteContent.ts src/App.test.tsx
git commit -m "refactor: add entity-first catalog content model"
```

---

### Task 2: Add dynamic routes and shared internal-page template

**Files:**
- Create: `src/components/pages/OfferingPageTemplate.tsx`
- Create: `src/components/pages/OfferingPageTemplate.module.css`
- Create: `src/pages/service.tsx`
- Create: `src/pages/extra.tsx`
- Modify: `src/AppRoutes.tsx`
- Test: `src/AppRoutes.test.tsx`
- Test: `src/pages/service.test.tsx`
- Test: `src/pages/extra.test.tsx`

- [ ] **Step 1: Write failing route tests**

Add tests for:
- `/services/:slug`
- `/extras/:slug`
- fallback behavior when slug is missing or unknown

Also add page tests that assert:
- service pages render the correct title from route data
- extra-service pages render the correct title from route data

- [ ] **Step 2: Run tests to confirm failure**

Run:
```powershell
npm test -- src/AppRoutes.test.tsx src/pages/service.test.tsx src/pages/extra.test.tsx --maxWorkers=1
```

Expected:
- FAIL because those routes/pages do not exist yet

- [ ] **Step 3: Implement the shared offering template**

Create `OfferingPageTemplate.tsx` to render:
- lead visual
- offer name
- concise full description
- included items
- starting price
- main CTA block
- main services catalog
- extras section
- moments gallery
- testimonials
- FAQ
- contacts

The template should accept an offering entity and a type (`service` or `extra`).

- [ ] **Step 4: Implement route pages**

Create:
- `src/pages/service.tsx`
- `src/pages/extra.tsx`

Use route params to look up content from `catalogContent.ts`.
If the slug is missing or invalid, redirect/fallback safely to the homepage or a known safe state.

- [ ] **Step 5: Wire routes in `AppRoutes.tsx`**

Add:
- `/services/:slug`
- `/extras/:slug`

Keep:
- `/`
- `/privacy`
- `/terms`
- `/consent`

- [ ] **Step 6: Re-run tests**

Run:
```powershell
npm test -- src/AppRoutes.test.tsx src/pages/service.test.tsx src/pages/extra.test.tsx --maxWorkers=1
```

Expected:
- PASS

- [ ] **Step 7: Commit**

```bash
git add src/AppRoutes.tsx src/components/pages/OfferingPageTemplate.tsx src/components/pages/OfferingPageTemplate.module.css src/pages/service.tsx src/pages/extra.tsx src/AppRoutes.test.tsx src/pages/service.test.tsx src/pages/extra.test.tsx
git commit -m "feat: add service and extra-service routes"
```

---

### Task 3: Rebuild the homepage into a hub structure

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/sections/HeroSection.tsx`
- Modify: `src/components/sections/HeroSection.module.css`
- Modify: `src/components/sections/AboutSection.tsx`
- Modify: `src/components/sections/AboutSection.module.css`
- Modify: `src/components/sections/ServicesSection.tsx`
- Modify: `src/components/sections/ServicesSection.module.css`
- Create: `src/components/sections/ExtrasSection.tsx`
- Create: `src/components/sections/ExtrasSection.module.css`
- Create: `src/components/sections/CtaSection.tsx`
- Create: `src/components/sections/CtaSection.module.css`
- Create: `src/components/sections/TestimonialsSection.tsx`
- Create: `src/components/sections/TestimonialsSection.module.css`
- Modify: `src/components/sections/ReviewsSection.tsx`
- Modify: `src/components/sections/ReviewsSection.module.css`
- Test: `src/App.test.tsx`
- Test: `src/components/sections/ServicesSection.test.tsx`
- Test: `src/components/sections/AboutSection.test.tsx`
- Test: `src/components/sections/TestimonialsSection.test.tsx`

- [ ] **Step 1: Write failing section tests**

Cover:
- hero has `Смотреть услуги` and `Заказать`
- About section renders counters/facts
- Services section shows only initial items first
- `Показать ещё` reveals remaining services
- Extras section renders separately
- CTA section renders once on homepage
- Reviews/moments split into two sections

- [ ] **Step 2: Run the tests**

Run:
```powershell
npm test -- src/App.test.tsx src/components/sections/ServicesSection.test.tsx src/components/sections/AboutSection.test.tsx src/components/sections/TestimonialsSection.test.tsx --maxWorkers=1
```

Expected:
- FAIL because the homepage is still the previous landing structure

- [ ] **Step 3: Update hero behavior**

Adjust `HeroSection` so:
- `Смотреть услуги` scrolls to the services catalog
- `Заказать` opens the unified CTA modal trigger

- [ ] **Step 4: Update About section**

Add a restrained counter/fact block for:
- years of work
- number of events served

Keep it visually aligned with the current brand language.

- [ ] **Step 5: Rebuild Services section**

Turn it into a menu-vitrine section:
- render 6–9 visible items by default
- add `Показать ещё`
- reveal the rest smoothly
- no `Заказать` inside cards
- use a lower-right arrow action / whole-card navigation

- [ ] **Step 6: Add Extras and CTA sections**

Add:
- a separate extras ribbon
- one dedicated homepage CTA block

- [ ] **Step 7: Split moments and reviews**

Repurpose `ReviewsSection` into the visual moments gallery, then add a new `TestimonialsSection` for Avito review screenshots and proof CTA.

- [ ] **Step 8: Recompose `App.tsx`**

The homepage order must become:
- Hero
- About
- Services
- Extras
- CTA
- Moments
- Testimonials
- FAQ
- Contacts
- Footer

- [ ] **Step 9: Re-run tests**

Run:
```powershell
npm test -- src/App.test.tsx src/components/sections/ServicesSection.test.tsx src/components/sections/AboutSection.test.tsx src/components/sections/TestimonialsSection.test.tsx --maxWorkers=1
```

Expected:
- PASS

- [ ] **Step 10: Commit**

```bash
git add src/App.tsx src/components/sections/HeroSection.tsx src/components/sections/HeroSection.module.css src/components/sections/AboutSection.tsx src/components/sections/AboutSection.module.css src/components/sections/ServicesSection.tsx src/components/sections/ServicesSection.module.css src/components/sections/ExtrasSection.tsx src/components/sections/ExtrasSection.module.css src/components/sections/CtaSection.tsx src/components/sections/CtaSection.module.css src/components/sections/ReviewsSection.tsx src/components/sections/ReviewsSection.module.css src/components/sections/TestimonialsSection.tsx src/components/sections/TestimonialsSection.module.css src/App.test.tsx src/components/sections/ServicesSection.test.tsx src/components/sections/AboutSection.test.tsx src/components/sections/TestimonialsSection.test.tsx
git commit -m "feat: rebuild homepage as catalog hub"
```

---

### Task 4: Add the unified CTA modal

**Files:**
- Create: `src/components/cta/OrderModal.tsx`
- Create: `src/components/cta/OrderModal.module.css`
- Modify: `src/components/layout/SiteHeader.tsx`
- Modify: `src/components/layout/SiteHeader.module.css`
- Modify: `src/components/sections/HeroSection.tsx`
- Modify: `src/components/sections/CtaSection.tsx`
- Modify: `src/components/pages/OfferingPageTemplate.tsx`
- Test: `src/components/cta/OrderModal.test.tsx`
- Test: `src/components/layout/SiteHeader.test.tsx`

- [ ] **Step 1: Write failing CTA tests**

Cover:
- header `Заказать` button exists
- homepage CTA button opens modal
- service page CTA button opens same modal
- modal contains name + phone only
- consent note includes links to `/privacy`, `/terms`, `/consent`

- [ ] **Step 2: Run tests to confirm failure**

Run:
```powershell
npm test -- src/components/cta/OrderModal.test.tsx src/components/layout/SiteHeader.test.tsx --maxWorkers=1
```

Expected:
- FAIL because no shared modal exists yet

- [ ] **Step 3: Build the modal**

Implement:
- open/close behavior
- name field
- phone field
- submit button
- legal consent note with three internal links

Keep it as a UI shell only unless a real submit transport already exists.

- [ ] **Step 4: Wire all CTA triggers**

Hook modal opening from:
- header
- hero
- homepage CTA section
- offering pages

Do not render CTA sections on legal pages.

- [ ] **Step 5: Re-run tests**

Run:
```powershell
npm test -- src/components/cta/OrderModal.test.tsx src/components/layout/SiteHeader.test.tsx --maxWorkers=1
```

Expected:
- PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/cta/OrderModal.tsx src/components/cta/OrderModal.module.css src/components/layout/SiteHeader.tsx src/components/layout/SiteHeader.module.css src/components/sections/HeroSection.tsx src/components/sections/CtaSection.tsx src/components/pages/OfferingPageTemplate.tsx src/components/cta/OrderModal.test.tsx src/components/layout/SiteHeader.test.tsx
git commit -m "feat: add unified order modal"
```

---

### Task 5: Make header navigation route-aware and catalog-friendly

**Files:**
- Modify: `src/components/layout/SiteHeader.tsx`
- Modify: `src/components/layout/SiteHeader.module.css`
- Modify: `src/data/siteContent.ts`
- Test: `src/components/layout/SiteHeader.test.tsx`

- [ ] **Step 1: Write the failing header-nav test**

Cover:
- homepage nav still scrolls to sections
- logo always routes home
- service/extra pages keep a useful header state
- header CTA remains present on all non-legal pages

- [ ] **Step 2: Run the failing test**

Run:
```powershell
npm test -- src/components/layout/SiteHeader.test.tsx --maxWorkers=1
```

Expected:
- FAIL because the current header assumes only a single-page landing flow

- [ ] **Step 3: Update header logic**

Implement route-aware behavior:
- on homepage, nav items scroll to sections
- on service/extra pages, nav items either route home with hash targets or scroll within the shared downstream sections if rendered on the same page
- logo links to `/`

- [ ] **Step 4: Keep mobile behavior stable**

Verify:
- mobile menu still opens/closes correctly
- header CTA remains visible or reachable
- no horizontal overflow is introduced

- [ ] **Step 5: Re-run tests**

Run:
```powershell
npm test -- src/components/layout/SiteHeader.test.tsx --maxWorkers=1
```

Expected:
- PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/SiteHeader.tsx src/components/layout/SiteHeader.module.css src/data/siteContent.ts src/components/layout/SiteHeader.test.tsx
git commit -m "feat: make header work across hub and offer pages"
```

---

### Task 6: Add SEO, schema, prerender, and sitemap support for offer pages

**Files:**
- Modify: `src/config/seo.ts`
- Modify: `src/pages/index.tsx`
- Modify: `src/pages/service.tsx`
- Modify: `src/pages/extra.tsx`
- Modify: `src/components/StructuredData.tsx` if needed
- Modify: `prerender.js`
- Modify: `generate-sitemap.js`
- Modify: `src/seoMeta.test.ts`
- Modify: `src/entry-server.test.tsx` if prerender assumptions change

- [ ] **Step 1: Write failing SEO/build tests**

Cover:
- service pages get unique title, description, canonical
- extra pages get unique title, description, canonical
- structured data can include page-specific service-like information
- prerender and sitemap include dynamic slugs

- [ ] **Step 2: Run tests to confirm failure**

Run:
```powershell
npm test -- src/seoMeta.test.ts src/entry-server.test.tsx --maxWorkers=1
```

Expected:
- FAIL because dynamic offer routes are not yet represented in SEO/prerender

- [ ] **Step 3: Add SEO builders**

In `src/config/seo.ts`, add helpers for:
- homepage SEO
- service-page SEO
- extra-page SEO
- structured data for individual offers if the content justifies it

- [ ] **Step 4: Update prerender**

Teach `prerender.js` to enumerate:
- `/`
- `/privacy`
- `/terms`
- `/consent`
- every `/services/<slug>`
- every `/extras/<slug>`

- [ ] **Step 5: Update sitemap generation**

Teach `generate-sitemap.js` to use `services` and `extras` arrays so all offer pages become real sitemap entries.

- [ ] **Step 6: Re-run tests**

Run:
```powershell
npm test -- src/seoMeta.test.ts src/entry-server.test.tsx --maxWorkers=1
npm run build
```

Expected:
- PASS
- `dist/services/<slug>/index.html` exists
- `dist/extras/<slug>/index.html` exists
- `dist/sitemap.xml` contains the dynamic URLs

- [ ] **Step 7: Commit**

```bash
git add src/config/seo.ts src/pages/index.tsx src/pages/service.tsx src/pages/extra.tsx src/components/StructuredData.tsx prerender.js generate-sitemap.js src/seoMeta.test.ts src/entry-server.test.tsx
git commit -m "feat: add seo and prerender support for offer pages"
```

---

### Task 7: Full verification on desktop and mobile

**Files:**
- Verify rendered app and build output only

- [ ] **Step 1: Run focused test suite**

Run:
```powershell
npm test -- src/App.test.tsx src/AppRoutes.test.tsx src/components/layout/SiteHeader.test.tsx src/components/sections/ServicesSection.test.tsx src/components/sections/TestimonialsSection.test.tsx src/components/cta/OrderModal.test.tsx src/pages/service.test.tsx src/pages/extra.test.tsx src/seoMeta.test.ts --maxWorkers=1
```

Expected:
- PASS

- [ ] **Step 2: Run production build**

Run:
```powershell
npm run build
```

Expected:
- PASS with prerendered homepage and dynamic offer pages

- [ ] **Step 3: Start local preview**

Run:
```powershell
Start-Process -WindowStyle Hidden -FilePath npm -ArgumentList 'run','preview','--','--host','127.0.0.1','--port','4173' -WorkingDirectory 'C:\Users\606ru\OneDrive\Desktop\але\site\.worktrees\party-landing\web'
```

- [ ] **Step 4: Desktop verification**

Check:
- homepage order matches the spec
- `Показать ещё` reveals the rest of the catalog
- service and extra pages feel like the same site without the general homepage hero
- CTA modal opens from header, hero, and CTA sections
- moments and testimonials are clearly distinct

- [ ] **Step 5: Mobile verification**

Check:
- header and modal remain usable
- no horizontal overflow
- services reveal stays stable
- extras ribbon is swipe-friendly
- footer/contact targets remain comfortable

- [ ] **Step 6: Optional end-to-end verification**

Run:
```powershell
npm run test:e2e -- --workers=1
```

Expected:
- PASS or only known low-risk visual drift to review manually

- [ ] **Step 7: Final commit**

```bash
git add .
git commit -m "test: verify multipage catalog rebuild locally"
```

---

## Notes For Execution

- Keep all work local only until the user explicitly asks for a push.
- Use generated placeholder copy for services/extras until the user provides real business facts.
- Do not add a separate Contacts page.
- Do not reintroduce Team.
- Do not add video reviews.
- Main service cards should route to offer pages; they should not contain direct order buttons.
- Extra services also need internal pages, even if the homepage representation is more compact.
- The current footer, legal pages, and shared shell should survive the rebuild rather than being replaced.
- Every dynamic route added for offers must be reflected in prerender and sitemap logic, otherwise the architecture is incomplete.
