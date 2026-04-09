# Premium Shell Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved premium redesign across the full shell, homepage, and inner offering pages, including the new hero poster carousel built from local images.

**Architecture:** The work starts with a theme reset: global tokens, typography, and shell surfaces define the new design language for every page. Then the homepage hierarchy is rebuilt section-by-section, while the new hero carousel is extracted into its own focused component and the inner service pages inherit the same visual system.

**Tech Stack:** React, TypeScript, Vite, CSS Modules, Vitest, Testing Library

---

### Task 1: Save the Approved Design Baseline

**Files:**
- Create: `docs/superpowers/specs/2026-04-09-premium-shell-redesign-design.md`
- Create: `docs/superpowers/plans/2026-04-09-premium-shell-redesign-implementation.md`

- [ ] Add the approved redesign spec covering the full shell and the new hero.
- [ ] Keep the plan and spec together in the clean redesign worktree.

### Task 2: Prepare Hero Assets for a Shared Poster System

**Files:**
- Create: `web/public/images/hero/hero-main.png`
- Create: `web/public/images/hero/hero-cotton.jpg`
- Create: `web/public/images/hero/hero-truck.jpg`
- Modify: `web/src/data/siteContent.ts`

- [ ] Prepare portrait-oriented hero source assets from `hero.png`, `hero1.jpg`, and `hero2.jpg`.
- [ ] Add declarative slide metadata for the hero poster carousel: path, alt, and object-position.
- [ ] Keep the slide order fixed and start with the premium fountain image.

### Task 3: Reset Global Theme and Typography for the Whole Shell

**Files:**
- Modify: `web/src/styles/tokens.css`
- Modify: `web/src/styles/global.css`
- Modify: `web/src/components/layout/SiteShell.tsx`
- Test: `web/src/styles/MotionTheme.test.ts`

- [ ] Write or update failing tests that assert the new premium shell contract rather than the old wide-canvas color zones.
- [ ] Replace the current shell theme with the approved milk-white / blue / pink token system.
- [ ] Apply the new typography stack and global surface rules so the shell works for the homepage and inner pages.
- [ ] Run the targeted tests to verify the new shell contract passes.

### Task 4: Redesign Header and Footer as Shared Premium Shell Surfaces

**Files:**
- Modify: `web/src/components/layout/SiteHeader.tsx`
- Modify: `web/src/components/layout/SiteHeader.module.css`
- Modify: `web/src/components/layout/SiteFooter.tsx`
- Modify: `web/src/components/layout/SiteFooter.module.css`
- Test: `web/src/components/layout/SiteHeader.test.tsx`

- [ ] Write or update failing tests for header behavior that must remain true during redesign.
- [ ] Restyle the header into the new airy premium system while preserving route-awareness and mobile menu behavior.
- [ ] Restyle the footer so it feels part of the same visual world as the redesigned shell.
- [ ] Run header tests and verify they pass.

### Task 5: Implement the New Hero Poster Carousel

**Files:**
- Create: `web/src/components/sections/HeroPosterCarousel.tsx`
- Create: `web/src/components/sections/HeroPosterCarousel.module.css`
- Modify: `web/src/components/sections/HeroSection.tsx`
- Modify: `web/src/components/sections/HeroSection.module.css`
- Test: `web/src/components/sections/HeroSection.test.tsx`
- Test: `web/src/components/sections/HeroPosterCarousel.test.tsx`

- [ ] Write failing tests for the hero carousel: fixed slide order, autoplay behavior, and reduced-motion fallback.
- [ ] Implement the new portrait poster component with autoplay-only premium slide transitions.
- [ ] Rebuild `HeroSection` around static copy on the left and the poster on the right.
- [ ] Run hero tests and verify they pass.

### Task 6: Rebuild About into a Short Manifest + Social Proof Band

**Files:**
- Modify: `web/src/components/sections/AboutSection.tsx`
- Modify: `web/src/components/sections/AboutSection.module.css`
- Test: `web/src/components/sections/AboutSection.test.tsx`

- [ ] Write a failing test for the new lighter about structure if current coverage does not match it.
- [ ] Remove the heavy ladder feel and reshape the section into a compact manifest + stats presentation.
- [ ] Keep the approved `7+ / 300+ / 1000+` proof.
- [ ] Run the about tests and verify they pass.

### Task 7: Redesign Services and Extras Into a Stronger Product Showcase

**Files:**
- Modify: `web/src/components/sections/ServicesSection.tsx`
- Modify: `web/src/components/sections/ServicesSection.module.css`
- Modify: `web/src/components/sections/ExtrasSection.tsx`
- Modify: `web/src/components/sections/ExtrasSection.module.css`
- Modify: `web/src/components/ui/OfferingVisual.tsx`
- Test: `web/src/components/sections/ServicesSection.test.tsx`

- [ ] Write or update failing tests for service cards and reveal behavior if needed.
- [ ] Introduce the stronger premium service-card styling and, if feasible in scope, the approved filter-chip row.
- [ ] Pull extras visually closer to services so they feel like a continuation rather than an isolated block.
- [ ] Run the services tests and verify they pass.

### Task 8: Reshape Moments, Testimonials, FAQ, and Contact Around the New Hierarchy

**Files:**
- Modify: `web/src/components/sections/ReviewsSection.tsx`
- Modify: `web/src/components/sections/ReviewsSection.module.css`
- Modify: `web/src/components/sections/TestimonialsSection.tsx`
- Modify: `web/src/components/sections/TestimonialsSection.module.css`
- Modify: `web/src/components/sections/FaqSection.tsx`
- Modify: `web/src/components/sections/FaqSection.module.css`
- Modify: `web/src/components/sections/ContactPlaceholderSection.tsx`
- Modify: `web/src/components/sections/ContactPlaceholderSection.module.css`
- Test: `web/src/styles/MotionTheme.test.ts`

- [ ] Keep the moments block as the most visually appetizing section after services.
- [ ] Merge the feeling of testimonials and external proof into a cleaner trust area.
- [ ] Simplify FAQ into a lighter premium accordion.
- [ ] Refine contacts into a cleaner split-layout compatible with the new shell.

### Task 9: Rebuild the Final CTA and Shared Form Language

**Files:**
- Modify: `web/src/components/sections/CtaSection.tsx`
- Modify: `web/src/components/sections/CtaSection.module.css`
- Test: `web/src/components/sections/CtaSection.test.tsx`

- [ ] Write or update a failing CTA test if the current structure changes materially.
- [ ] Restyle the CTA into the approved premium band with cleaner value-first messaging.
- [ ] Align form fields, focus styles, and button rhythm with the new shell tokens.
- [ ] Run the CTA tests and verify they pass.

### Task 10: Carry the System Into Inner Offering Pages

**Files:**
- Modify: `web/src/components/...` files used by service and extra detail pages after inspection
- Test: relevant inner-page tests if present

- [ ] Inspect the inner offering page components and apply the same token, typography, and shell improvements.
- [ ] Ensure detail pages do not visually fall back to the old style.

### Task 11: Full Verification and Local Preview

**Files:**
- No source changes expected

- [ ] Run `npm run test -- --run`
- [ ] Run `npm run build`
- [ ] Start or refresh local preview on `http://127.0.0.1:4180`
- [ ] Summarize what to review first: hero, services, social proof, CTA, and inner pages
