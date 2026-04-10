# Content Hub Centralization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Centralize all site content, contacts, legal data, and SEO-facing copy behind a single `siteConfig` content hub without changing the visible UI or route structure.

**Architecture:** Introduce a new `web/src/content` hub with a single public `siteConfig` export plus a few official selectors. Migrate existing `data/*` modules into thin adapters first, then move components and pages to import only from `src/content`, and finally remove duplication once tests prove the new data flow is stable.

**Tech Stack:** React 19, TypeScript, Vite, react-router, react-helmet-async, CSS Modules, Vitest, existing SSG/prerender pipeline.

---

## Pre-Execution Notes

- Current repo state is **not clean**. Before executing the plan, either:
  - create a fresh worktree/branch for this refactor, or
  - commit/stash unrelated local footer/legal edits first.
- Do **not** mix this refactor with visual redesign work.
- `web/site.config.js` stays the runtime/env-facing site config for domain/URL defaults. This plan centralizes **content**, not deployment environment variables.

---

## File Map

### Create

- `web/src/content/index.ts` — single public entry exporting `siteConfig` and official selectors
- `web/src/content/types.ts` — shared content types to prevent cycles
- `web/src/content/formatters.ts` — `formatPrice`, `buildPhoneHref`, `buildMailtoHref`, display helpers
- `web/src/content/brand.ts` — brand name, geography, descriptor, shared labels
- `web/src/content/contacts.ts` — canonical contact data, display/raw/href variants, messenger links
- `web/src/content/navigation.ts` — nav items and section ids
- `web/src/content/homepage.ts` — homepage section copy, hero, concept loop, FAQ, contact prompts
- `web/src/content/offerings.ts` — services, extras, media, price models, lookup helpers
- `web/src/content/testimonials.ts` — reviews/testimonials data if kept separate from homepage
- `web/src/content/legal.ts` — business/legal details, legal links, legal documents
- `web/src/content/seo.ts` — content-owned SEO copy builders and route-specific metadata
- `web/src/content/siteConfig.test.ts` — content integrity tests
- `web/src/content/contentImportBoundaries.test.ts` — guard against new direct imports from legacy `data/*`

### Modify

- `web/src/data/siteContent.ts` — temporary adapter/re-export layer to the new hub
- `web/src/data/catalogContent.ts` — temporary adapter/re-export layer to the new hub
- `web/src/data/footerContent.ts` — temporary adapter/re-export layer to the new hub
- `web/src/config/seo.ts` — switch to `src/content` selectors instead of reading legacy data files
- `web/src/components/layout/SiteHeader.tsx`
- `web/src/components/layout/SiteFooter.tsx`
- `web/src/components/legal/LegalPageLayout.tsx`
- `web/src/components/sections/AboutSection.tsx`
- `web/src/components/sections/ConceptLoopSection.tsx`
- `web/src/components/sections/ContactPlaceholderSection.tsx`
- `web/src/components/sections/CtaSection.tsx`
- `web/src/components/sections/ExtrasSection.tsx`
- `web/src/components/sections/FaqSection.tsx`
- `web/src/components/sections/HeroSection.tsx`
- `web/src/components/sections/ReviewsSection.tsx`
- `web/src/components/sections/ServicesSection.tsx`
- `web/src/components/sections/TestimonialsSection.tsx`
- `web/src/components/cta/OrderModal.tsx`
- `web/src/components/pages/OfferingPageTemplate.tsx`
- `web/src/components/ui/OfferingVisual.tsx`
- `web/src/pages/index.tsx`
- `web/src/pages/service.tsx`
- `web/src/pages/extra.tsx`
- `web/src/pages/privacy.tsx`
- `web/src/pages/terms.tsx`
- `web/src/pages/consent.tsx`

### Verify / likely touch tests

- `web/src/App.test.tsx`
- `web/src/AppRoutes.test.tsx`
- `web/src/components/layout/SiteFooter.test.tsx`
- `web/src/components/layout/SiteHeader.test.tsx`
- `web/src/components/legal/LegalPageLayout.test.tsx`
- `web/src/components/sections/ConceptLoopSection.test.tsx`
- `web/src/components/sections/ContactPlaceholderSection.test.tsx`
- `web/src/components/sections/ExtrasSection.test.tsx`
- `web/src/components/sections/FaqSection.test.tsx`
- `web/src/components/sections/ServicesSection.test.tsx`
- `web/src/seoMeta.test.ts`

---

### Task 1: Scaffold the content hub shell

**Files:**
- Create: `web/src/content/types.ts`
- Create: `web/src/content/formatters.ts`
- Create: `web/src/content/brand.ts`
- Create: `web/src/content/contacts.ts`
- Create: `web/src/content/navigation.ts`
- Create: `web/src/content/index.ts`
- Test: `web/src/content/siteConfig.test.ts`

- [ ] **Step 1: Write the failing test**

Create `web/src/content/siteConfig.test.ts` with:

```ts
import { siteConfig } from './index';

test('siteConfig exposes the required top-level content domains', () => {
  expect(siteConfig).toHaveProperty('brand');
  expect(siteConfig).toHaveProperty('contacts');
  expect(siteConfig).toHaveProperty('navigation');
  expect(siteConfig).toHaveProperty('homepage');
  expect(siteConfig).toHaveProperty('services');
  expect(siteConfig).toHaveProperty('extras');
  expect(siteConfig).toHaveProperty('legal');
  expect(siteConfig).toHaveProperty('seo');
});

test('contacts expose raw, display, and href-ready values', () => {
  expect(siteConfig.contacts.phone.raw).toBe('+79263919225');
  expect(siteConfig.contacts.phone.href).toBe('tel:+79263919225');
  expect(siteConfig.contacts.email.raw).toBe('Glad_2015@bk.ru');
  expect(siteConfig.contacts.email.href).toBe('mailto:Glad_2015@bk.ru');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm.cmd test -- src/content/siteConfig.test.ts
```

Expected:
- FAIL because `src/content/index.ts` does not exist yet

- [ ] **Step 3: Create the minimal content shell**

Create the first-pass hub:

```ts
// src/content/index.ts
import { brand } from './brand';
import { contacts } from './contacts';
import { navigation } from './navigation';

export const siteConfig = {
  brand,
  contacts,
  navigation,
  homepage: {},
  services: [],
  extras: [],
  testimonials: [],
  faq: [],
  legal: {},
  seo: {},
} as const;
```

And create formatters like:

```ts
export function buildPhoneHref(raw: string) {
  return `tel:${raw}`;
}

export function buildMailtoHref(raw: string) {
  return `mailto:${raw}`;
}
```

- [ ] **Step 4: Run the test again**

Run:

```powershell
npm.cmd test -- src/content/siteConfig.test.ts
```

Expected:
- PASS

- [ ] **Step 5: Commit**

```bash
git add web/src/content/types.ts web/src/content/formatters.ts web/src/content/brand.ts web/src/content/contacts.ts web/src/content/navigation.ts web/src/content/index.ts web/src/content/siteConfig.test.ts
git commit -m "refactor: scaffold centralized content hub"
```

---

### Task 2: Centralize legal, footer, and contact domains

**Files:**
- Create: `web/src/content/legal.ts`
- Modify: `web/src/content/index.ts`
- Modify: `web/src/data/footerContent.ts`
- Modify: `web/src/components/layout/SiteFooter.tsx`
- Modify: `web/src/components/legal/LegalPageLayout.tsx`
- Modify: `web/src/components/sections/ContactPlaceholderSection.tsx`
- Modify: `web/src/components/cta/OrderModal.tsx`
- Modify: `web/src/components/sections/CtaSection.tsx`
- Test: `web/src/components/layout/SiteFooter.test.tsx`
- Test: `web/src/components/legal/LegalPageLayout.test.tsx`
- Test: `web/src/components/sections/ContactPlaceholderSection.test.tsx`

- [ ] **Step 1: Extend tests before moving code**

Add or update assertions so they read real values from the canonical source:

```ts
import { siteConfig } from '../../content';

expect(screen.getByRole('link', { name: siteConfig.contacts.phone.display })).toHaveAttribute(
  'href',
  siteConfig.contacts.phone.href,
);
expect(screen.getByRole('link', { name: siteConfig.contacts.email.display })).toHaveAttribute(
  'href',
  siteConfig.contacts.email.href,
);
```

- [ ] **Step 2: Run the targeted tests to verify the refactor target is covered**

Run:

```powershell
npm.cmd test -- src/components/layout/SiteFooter.test.tsx src/components/legal/LegalPageLayout.test.tsx src/components/sections/ContactPlaceholderSection.test.tsx
```

Expected:
- PASS before code movement, proving current behavior is covered

- [ ] **Step 3: Move legal and contact data into the hub**

Create `web/src/content/legal.ts` with:

```ts
export const legal = {
  business: {
    name: 'ИП Гладышев Александр Андреевич',
    inn: 'ИНН 501806886358',
    ogrnip: 'ОГРНИП 319508100076437',
    address: 'Юр. адрес: М.о., г.о. Королев, пр-д Матроросова, д. 3 А, кв. 28.',
  },
  links: [
    { href: '/privacy', label: 'Политика конфиденциальности' },
    { href: '/terms', label: 'Пользовательское соглашение' },
    { href: '/consent', label: 'Согласие на обработку персональных данных' },
  ],
  documents: {
    privacy: { ... },
    terms: { ... },
    consent: { ... },
  },
} as const;
```

Update `src/data/footerContent.ts` into a compatibility adapter:

```ts
import { siteConfig } from '../content';

export const footerContent = {
  brand: siteConfig.brand.name,
  descriptor: siteConfig.brand.descriptor,
  phoneLabel: siteConfig.contacts.phone.display,
  phoneHref: siteConfig.contacts.phone.href,
  emailLabel: siteConfig.contacts.email.display,
  emailHref: siteConfig.contacts.email.href,
  businessName: siteConfig.legal.business.name,
  inn: siteConfig.legal.business.inn,
  ogrnip: siteConfig.legal.business.ogrnip,
  legalAddress: siteConfig.legal.business.address,
  socialLinks: siteConfig.contacts.socialLinks,
  legalLinks: siteConfig.legal.links,
} as const;
```

- [ ] **Step 4: Migrate components from `data/footerContent` to `content`**

Switch imports in:
- `SiteFooter.tsx`
- `LegalPageLayout.tsx`
- `ContactPlaceholderSection.tsx`
- `OrderModal.tsx`
- `CtaSection.tsx`

Use `siteConfig.contacts` and `siteConfig.legal` directly instead of legacy adapters.

- [ ] **Step 5: Run targeted tests**

Run:

```powershell
npm.cmd test -- src/components/layout/SiteFooter.test.tsx src/components/legal/LegalPageLayout.test.tsx src/components/sections/ContactPlaceholderSection.test.tsx
```

Expected:
- PASS with components importing from `src/content`

- [ ] **Step 6: Commit**

```bash
git add web/src/content/legal.ts web/src/content/index.ts web/src/data/footerContent.ts web/src/components/layout/SiteFooter.tsx web/src/components/legal/LegalPageLayout.tsx web/src/components/sections/ContactPlaceholderSection.tsx web/src/components/cta/OrderModal.tsx web/src/components/sections/CtaSection.tsx web/src/components/layout/SiteFooter.test.tsx web/src/components/legal/LegalPageLayout.test.tsx web/src/components/sections/ContactPlaceholderSection.test.tsx
git commit -m "refactor: centralize contact and legal content"
```

---

### Task 3: Move homepage and brand copy into the hub

**Files:**
- Create: `web/src/content/homepage.ts`
- Modify: `web/src/content/index.ts`
- Modify: `web/src/data/siteContent.ts`
- Modify: `web/src/components/layout/SiteHeader.tsx`
- Modify: `web/src/components/sections/HeroSection.tsx`
- Modify: `web/src/components/sections/AboutSection.tsx`
- Modify: `web/src/components/sections/ConceptLoopSection.tsx`
- Modify: `web/src/components/sections/FaqSection.tsx`
- Modify: `web/src/components/sections/ContactPlaceholderSection.tsx`
- Modify: `web/src/pages/index.tsx`
- Test: `web/src/components/layout/SiteHeader.test.tsx`
- Test: `web/src/components/sections/ConceptLoopSection.test.tsx`
- Test: `web/src/components/sections/FaqSection.test.tsx`

- [ ] **Step 1: Expand tests around homepage consumers**

Add assertions that components consume values from centralized copy objects:

```ts
import { siteConfig } from '../../content';

expect(screen.getByRole('link', { name: siteConfig.brand.name })).toBeInTheDocument();
expect(screen.getByText(siteConfig.homepage.faq.items[0].question)).toBeInTheDocument();
```

- [ ] **Step 2: Run targeted tests**

Run:

```powershell
npm.cmd test -- src/components/layout/SiteHeader.test.tsx src/components/sections/ConceptLoopSection.test.tsx src/components/sections/FaqSection.test.tsx
```

Expected:
- PASS before migration

- [ ] **Step 3: Create `homepage.ts` and move homepage blocks**

Move into `web/src/content/homepage.ts`:
- hero copy and slide config
- about copy
- concept loop items and separator
- FAQ copy and items
- contact guided copy and prompt items
- homepage CTA labels

Recommended shape:

```ts
export const homepage = {
  hero: { ... },
  about: { ... },
  conceptLoop: { separator: '•', items: [...] },
  faq: { eyebrow: 'Часто спрашивают', items: [...] },
  contact: { ... },
  cta: { ... },
} as const;
```

- [ ] **Step 4: Convert `src/data/siteContent.ts` into a compatibility adapter**

Re-export from the hub:

```ts
import { siteConfig } from '../content';

export const navItems = siteConfig.navigation;
export const siteContent = {
  brand: siteConfig.brand.name,
  tagline: siteConfig.homepage.hero.title,
  heroDescription: siteConfig.homepage.hero.description,
  heroSupportingNote: siteConfig.brand.serviceArea,
} as const;
```

- [ ] **Step 5: Update component imports to `src/content`**

Migrate:
- `SiteHeader.tsx`
- `HeroSection.tsx`
- `AboutSection.tsx`
- `ConceptLoopSection.tsx`
- `FaqSection.tsx`
- `ContactPlaceholderSection.tsx`
- `pages/index.tsx`

- [ ] **Step 6: Run targeted tests**

Run:

```powershell
npm.cmd test -- src/components/layout/SiteHeader.test.tsx src/components/sections/ConceptLoopSection.test.tsx src/components/sections/FaqSection.test.tsx src/App.test.tsx
```

Expected:
- PASS

- [ ] **Step 7: Commit**

```bash
git add web/src/content/homepage.ts web/src/content/index.ts web/src/data/siteContent.ts web/src/components/layout/SiteHeader.tsx web/src/components/sections/HeroSection.tsx web/src/components/sections/AboutSection.tsx web/src/components/sections/ConceptLoopSection.tsx web/src/components/sections/FaqSection.tsx web/src/components/sections/ContactPlaceholderSection.tsx web/src/pages/index.tsx web/src/components/layout/SiteHeader.test.tsx web/src/components/sections/ConceptLoopSection.test.tsx web/src/components/sections/FaqSection.test.tsx web/src/App.test.tsx
git commit -m "refactor: centralize homepage and brand content"
```

---

### Task 4: Move offerings, prices, and offering helpers into the hub

**Files:**
- Create: `web/src/content/offerings.ts`
- Modify: `web/src/content/index.ts`
- Modify: `web/src/data/catalogContent.ts`
- Modify: `web/src/components/sections/ServicesSection.tsx`
- Modify: `web/src/components/sections/ExtrasSection.tsx`
- Modify: `web/src/components/sections/ReviewsSection.tsx`
- Modify: `web/src/components/sections/TestimonialsSection.tsx`
- Modify: `web/src/components/pages/OfferingPageTemplate.tsx`
- Modify: `web/src/components/ui/OfferingVisual.tsx`
- Modify: `web/src/pages/service.tsx`
- Modify: `web/src/pages/extra.tsx`
- Modify: `web/src/config/seo.ts`
- Test: `web/src/components/sections/ServicesSection.test.tsx`
- Test: `web/src/components/sections/ExtrasSection.test.tsx`
- Test: `web/src/AppRoutes.test.tsx`

- [ ] **Step 1: Add a failing/expanded test around price normalization**

Add assertions like:

```ts
import { siteConfig } from '../../content';

expect(siteConfig.services[0].price.display).toMatch(/^от /);
expect(siteConfig.services[0].price.display).toContain('₽');
```

If needed, add this to `src/content/siteConfig.test.ts`.

- [ ] **Step 2: Run the offerings-related tests**

Run:

```powershell
npm.cmd test -- src/components/sections/ServicesSection.test.tsx src/components/sections/ExtrasSection.test.tsx src/AppRoutes.test.tsx src/content/siteConfig.test.ts
```

Expected:
- PASS before migration, or FAIL only on the new price assertions

- [ ] **Step 3: Create `offerings.ts`**

Move services/extras/media/lookup helpers into:

```ts
export const services = [ ... ];
export const extras = [ ... ];

export function getOfferingPath(...) { ... }
export function findServiceBySlug(...) { ... }
export function findExtraBySlug(...) { ... }
```

Normalize prices centrally:

```ts
price: {
  from: 15000,
  display: formatPrice(15000),
}
```

Expose compatibility fields only if still needed during migration:

```ts
priceFrom: formatPrice(15000)
```

- [ ] **Step 4: Convert `catalogContent.ts` into an adapter**

Re-export the new offering data so old imports remain temporarily valid while the rest of the refactor is in flight.

- [ ] **Step 5: Migrate offering consumers to `src/content`**

Update:
- `ServicesSection.tsx`
- `ExtrasSection.tsx`
- `ReviewsSection.tsx`
- `TestimonialsSection.tsx`
- `OfferingPageTemplate.tsx`
- `OfferingVisual.tsx`
- `pages/service.tsx`
- `pages/extra.tsx`
- `config/seo.ts`

- [ ] **Step 6: Run targeted tests**

Run:

```powershell
npm.cmd test -- src/components/sections/ServicesSection.test.tsx src/components/sections/ExtrasSection.test.tsx src/AppRoutes.test.tsx src/pages/service.test.tsx src/pages/extra.test.tsx src/content/siteConfig.test.ts
```

Expected:
- PASS

- [ ] **Step 7: Commit**

```bash
git add web/src/content/offerings.ts web/src/content/index.ts web/src/data/catalogContent.ts web/src/components/sections/ServicesSection.tsx web/src/components/sections/ExtrasSection.tsx web/src/components/sections/ReviewsSection.tsx web/src/components/sections/TestimonialsSection.tsx web/src/components/pages/OfferingPageTemplate.tsx web/src/components/ui/OfferingVisual.tsx web/src/pages/service.tsx web/src/pages/extra.tsx web/src/config/seo.ts web/src/components/sections/ServicesSection.test.tsx web/src/components/sections/ExtrasSection.test.tsx web/src/AppRoutes.test.tsx web/src/content/siteConfig.test.ts
git commit -m "refactor: centralize offerings and pricing content"
```

---

### Task 5: Centralize SEO-facing content and builders

**Files:**
- Create: `web/src/content/seo.ts`
- Modify: `web/src/content/index.ts`
- Modify: `web/src/config/seo.ts`
- Modify: `web/src/pages/privacy.tsx`
- Modify: `web/src/pages/terms.tsx`
- Modify: `web/src/pages/consent.tsx`
- Test: `web/src/seoMeta.test.ts`
- Test: `web/src/AppRoutes.test.tsx`

- [ ] **Step 1: Extend SEO tests**

Add assertions that route/page metadata reads from centralized content:

```ts
import { siteConfig } from './content';

expect(siteConfig.seo.legal.privacy.title).toContain('Политика');
expect(siteConfig.seo.defaults.siteName).toBe(siteConfig.brand.name);
```

- [ ] **Step 2: Run SEO tests to verify the target is covered**

Run:

```powershell
npm.cmd test -- src/seoMeta.test.ts src/AppRoutes.test.tsx
```

Expected:
- PASS before migration

- [ ] **Step 3: Create content-owned SEO config**

In `web/src/content/seo.ts`, create:

```ts
export const seo = {
  defaults: {
    siteName: brand.name,
    businessDescription: `${brand.name} — ...`,
  },
  legal: {
    privacy: { title: '...', description: '...' },
    terms: { title: '...', description: '...' },
    consent: { title: '...', description: '...' },
  },
};
```

And helper builders:

```ts
export function buildOfferingSeoTitle(name: string, kind: 'service' | 'extra') {
  return kind === 'service' ? `${name} на мероприятие — ${brand.name}` : `${name} для мероприятия — ${brand.name}`;
}
```

- [ ] **Step 4: Slim down `src/config/seo.ts`**

Keep env/runtime URL utilities there, but import content-owned copy from `src/content`.

- [ ] **Step 5: Run targeted SEO tests**

Run:

```powershell
npm.cmd test -- src/seoMeta.test.ts src/AppRoutes.test.tsx src/components/legal/LegalPageLayout.test.tsx
```

Expected:
- PASS

- [ ] **Step 6: Commit**

```bash
git add web/src/content/seo.ts web/src/content/index.ts web/src/config/seo.ts web/src/pages/privacy.tsx web/src/pages/terms.tsx web/src/pages/consent.tsx web/src/seoMeta.test.ts web/src/AppRoutes.test.tsx
git commit -m "refactor: centralize seo content builders"
```

---

### Task 6: Enforce the new import boundary and remove duplication

**Files:**
- Create: `web/src/content/contentImportBoundaries.test.ts`
- Modify: `web/src/data/siteContent.ts`
- Modify: `web/src/data/catalogContent.ts`
- Modify: `web/src/data/footerContent.ts`
- Modify: all remaining `web/src/components/**/*` and `web/src/pages/**/*` that still import `../data/*`

- [ ] **Step 1: Write the failing boundary test**

Create `web/src/content/contentImportBoundaries.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const files = [
  'src/components/layout/SiteHeader.tsx',
  'src/components/layout/SiteFooter.tsx',
  'src/components/sections/HeroSection.tsx',
  'src/components/sections/ServicesSection.tsx',
  'src/pages/service.tsx',
  'src/pages/extra.tsx',
];

test('content consumers no longer import from legacy data modules', () => {
  for (const file of files) {
    const code = readFileSync(resolve(process.cwd(), file), 'utf8');
    expect(code).not.toMatch(/data\/siteContent|data\/catalogContent|data\/footerContent/);
  }
});
```

- [ ] **Step 2: Run the test to verify current failures**

Run:

```powershell
npm.cmd test -- src/content/contentImportBoundaries.test.ts
```

Expected:
- FAIL until all listed imports are migrated

- [ ] **Step 3: Migrate the last direct consumers**

Replace remaining legacy imports with `src/content` imports.

Keep `data/*` files only as short-term compatibility re-exports:

```ts
export { siteConfig } from '../content';
```

or remove them completely if nothing imports them anymore.

- [ ] **Step 4: Re-run the boundary test**

Run:

```powershell
npm.cmd test -- src/content/contentImportBoundaries.test.ts
```

Expected:
- PASS

- [ ] **Step 5: Commit**

```bash
git add web/src/content/contentImportBoundaries.test.ts web/src/data/siteContent.ts web/src/data/catalogContent.ts web/src/data/footerContent.ts web/src/components web/src/pages
git commit -m "refactor: enforce centralized content imports"
```

---

### Task 7: Full verification and cleanup

**Files:**
- Modify: remove dead exports from `web/src/data/*` if now unused
- Verify: `web/src/content/*`
- Verify: `web/src/components/**/*`
- Verify: `web/src/pages/**/*`

- [ ] **Step 1: Run the full test suite**

```powershell
npm.cmd test
```

Expected:
- PASS

- [ ] **Step 2: Run the production build**

```powershell
npm.cmd run build
```

Expected:
- PASS with prerendered homepage, legal pages, service pages, extra pages

- [ ] **Step 3: Run a repo-wide placeholder sweep**

```powershell
git grep -n "contact@party-everyday.ru\|\+7 (999) 999-99-99\|party-everyday.ru"
```

Expected:
- no results

- [ ] **Step 4: Run a repo-wide legacy import sweep**

```powershell
git grep -n "data/siteContent\|data/catalogContent\|data/footerContent" -- web/src
```

Expected:
- no results, or only explicit compatibility adapters that are intentionally retained

- [ ] **Step 5: Manual smoke-check on generated pages**

Check locally:
- `/`
- `/privacy`
- `/terms`
- `/consent`
- one service page
- one extra page

Verify:
- same contacts everywhere
- same pricing format everywhere
- no broken titles/descriptions

- [ ] **Step 6: Commit final cleanup**

```bash
git add web/src/content web/src/config/seo.ts web/src/components web/src/pages web/src/data
git commit -m "refactor: complete content hub centralization"
```

---

## Execution Order Summary

1. Scaffold the hub and core formatters
2. Move contacts/legal first
3. Move homepage copy
4. Move offerings/prices/helpers
5. Centralize SEO builders
6. Enforce import boundaries
7. Run full verification and cleanup

## Notes For The Implementer

- Prefer thin adapters before big-bang rewrites.
- Keep exported names stable until all consumers have moved.
- Avoid introducing circular imports between `offerings.ts`, `seo.ts`, and `index.ts`.
- If circulars appear, move shared builder functions into `formatters.ts` or `types.ts`.
- Use focused commits after each task so the refactor remains easy to bisect or rollback.
