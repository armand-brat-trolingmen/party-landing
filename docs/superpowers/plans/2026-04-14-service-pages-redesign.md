# Service Pages Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign only dedicated service pages so each service has a richer product-like layout with per-service tariffs, delivery details, and CTA behavior, while leaving the homepage services section visually intact.

**Architecture:** Keep the homepage catalog data contract stable, and add a nested `servicePage` data object to each service for dedicated-page-only content. Rebuild `OfferingPageTemplate` around that service-page data, with shared rendering for standard tariffs, package tariffs, included details, delivery, and combo badges.

**Tech Stack:** React, TypeScript, CSS Modules, Vitest, React Testing Library, Vite.

---

### Task 1: Protect The New Page Contract With Tests

**Files:**
- Modify: `web/src/components/pages/OfferingPageTemplate.tsx`
- Modify: `web/src/components/pages/OfferingPageTemplate.module.css`
- Modify: `web/src/components/sections/ServicesSection.tsx`
- Modify: `web/src/content/offerings.ts`
- Modify: `web/src/pages/service.tsx`
- Test: `web/src/pages/service.test.tsx`
- Test: `web/src/content/siteConfig.test.ts`

- [ ] Add tests that the cotton candy service page renders a placeholder visual, duration, age, included items, delivery, tariffs, and CTA button.
- [ ] Add tests that chocolate fountain renders Standard/VIP package details and the combo discount badge.
- [ ] Add tests that champagne pyramid renders 18+ age, free MKAD delivery, and combo discount badge.
- [ ] Add tests that "Сладкая вата + попкорн" is gone and "Сахарная вата + попкорн" is present.
- [ ] Add tests that the current service is excluded from the "Other services" list.
- [ ] Add tests that the service page shell no longer uses `story-trail`.

### Task 2: Extend Service Content Data

**Files:**
- Modify: `web/src/content/offerings.ts`

- [ ] Add dedicated page types: service highlights, delivery, standard tariffs, package tariffs, package details, and combo badge.
- [ ] Add a default `servicePage` builder for common service page copy.
- [ ] Enter known tariff data for all 16 services.
- [ ] Add special package details for chocolate fountain and foam cannon.
- [ ] Add champagne pyramid details, 18+ age, free MKAD delivery, and combo badge.
- [ ] Rename "Сладкая вата + попкорн" to "Сахарная вата + попкорн" globally through the single service config.

### Task 3: Rebuild Dedicated Service Page Layout

**Files:**
- Modify: `web/src/components/pages/OfferingPageTemplate.tsx`
- Modify: `web/src/components/pages/OfferingPageTemplate.module.css`

- [ ] Render service-page-only hero: title/description/button on the left and a plain white placeholder media area on the right.
- [ ] Render transparent highlight boxes for duration and recommended age.
- [ ] Render shared included and materials sections without overloading generic homepage service cards.
- [ ] Render delivery as a dedicated additional service block.
- [ ] Render standard tariff cards and package tariff cards without images.
- [ ] Render combo discount as a small badge on champagne pyramid and chocolate fountain pages.
- [ ] Keep CTA opening the current order modal.

### Task 4: Preserve Lower Page Sections

**Files:**
- Modify: `web/src/components/pages/OfferingPageTemplate.tsx`
- Modify: `web/src/pages/service.tsx`

- [ ] Keep other services, extras, testimonials, FAQ, contact, and CTA below the dedicated service content.
- [ ] Pass the service list without the current service to the lower `ServicesSection`.
- [ ] Keep extra-service pages compatible with the existing data, or provide a fallback page structure if they do not have `servicePage`.
- [ ] Remove `motionPath="story-trail"` from dedicated service pages only.

### Task 5: Verify Locally

**Files:**
- Test: `web/src/pages/service.test.tsx`
- Test: `web/src/content/siteConfig.test.ts`

- [ ] Run the targeted tests and confirm they fail before implementation.
- [ ] Run the targeted tests after implementation and confirm they pass.
- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run build`.
- [ ] Run `npm.cmd test`.
- [ ] Browser-check `/services/cotton-candy`, `/services/chocolate-fountain`, and `/services/champagne-pyramid` at mobile and desktop widths.
