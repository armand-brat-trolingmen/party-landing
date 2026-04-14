# Food Trucks Circular Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new homepage section for food truck catering with a user-controlled circular gallery, optimized image assets, supporting copy, pricing, and CTA between extras and testimonials.

**Architecture:** The feature is split into three focused parts: content/assets, a reusable circular gallery scene, and a homepage section that composes the scene with copy and CTA. WebGL remains isolated behind a React component so the rest of the homepage keeps the existing rendering patterns and tests can still run in jsdom.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Playwright, CSS modules, OGL, optimized WebP assets.

---

### Task 1: Prepare assets and dependencies

**Files:**
- Modify: `web/package.json`
- Modify: `web/package-lock.json`
- Create: `web/public/images/food-trucks/*`

- [ ] **Step 1: Add the runtime dependency for the circular gallery**
- [ ] **Step 2: Convert the 6 food truck source photos into optimized WebP assets**
- [ ] **Step 3: Put the processed assets into `web/public/images/food-trucks/` with stable filenames**
- [ ] **Step 4: Verify the final image set has consistent dimensions / aspect ratio targets**

### Task 2: Write failing tests for the new homepage section

**Files:**
- Modify: `web/src/App.test.tsx`
- Modify: `web/e2e/landing.spec.ts`
- Create: `web/src/components/sections/FoodTrucksSection.test.tsx`

- [ ] **Step 1: Add a failing unit test that expects the new section between extras and testimonials**
- [ ] **Step 2: Add a failing section test for headings, pricing, CTA, and 6 gallery images**
- [ ] **Step 3: Add a failing e2e expectation for the new section presence and CTA behavior**
- [ ] **Step 4: Run the targeted tests and confirm they fail for the missing feature**

### Task 3: Add content and homepage integration

**Files:**
- Modify: `web/src/content/homepage.ts`
- Modify: `web/src/content/index.ts`
- Modify: `web/src/App.tsx`

- [ ] **Step 1: Add `homepage.foodTrucks` content with titles, copy, prices, CTA label, and image metadata**
- [ ] **Step 2: Export any new content types or helpers if needed**
- [ ] **Step 3: Insert the new section between `ExtrasSection` and `TestimonialsSection` in `App.tsx`**

### Task 4: Build the circular gallery scene

**Files:**
- Create: `web/src/components/sections/CircularGallery.tsx`
- Create: `web/src/components/sections/CircularGallery.module.css`

- [ ] **Step 1: Adapt the provided OGL circular gallery into a React/TypeScript component**
- [ ] **Step 2: Remove card text textures and keep photo-only cards**
- [ ] **Step 3: Tune geometry, drag behavior, and bend for a calmer globe-like scene**
- [ ] **Step 4: Add reduced-motion and cleanup guards**
- [ ] **Step 5: Keep performance controls in place (`dpr`, no autoplay, limited card count)**

### Task 5: Build the food trucks section layout

**Files:**
- Create: `web/src/components/sections/FoodTrucksSection.tsx`
- Create: `web/src/components/sections/FoodTrucksSection.module.css`

- [ ] **Step 1: Compose the section with a full-width gallery stage**
- [ ] **Step 2: Add the two headings, supporting paragraphs, pricing, individual terms copy, and CTA**
- [ ] **Step 3: Wire the CTA to the existing order modal**
- [ ] **Step 4: Match the site's current visual language and warm-scene background**
- [ ] **Step 5: Make the mobile layout stable and keep images visually consistent**

### Task 6: Verify and refine

**Files:**
- Modify: any touched files above as needed from verification

- [ ] **Step 1: Run targeted Vitest coverage for the new section and homepage order**
- [ ] **Step 2: Run targeted Playwright coverage for desktop/mobile layout and CTA**
- [ ] **Step 3: Run `npm.cmd run lint`**
- [ ] **Step 4: Run `npm.cmd run build`**
- [ ] **Step 5: Check the live local page and keep the dev server ready for review**
