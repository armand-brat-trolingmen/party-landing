# Wide Canvas Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Перестроить главную страницу в wide-canvas композицию без больших секционных рамок, сохранить карточки только в услугах и обновить header/mobile hero под новый ритм.

**Architecture:** Основное изменение пройдет через глобальную систему `shell`-поверхностей и секционных контейнеров в `global.css`, после чего точечно будут адаптированы `SiteHeader`, `Hero`, `About`, `Services`, `FAQ`, `Contacts` и соседние секции, чтобы убрать boxed-layout без поломки структуры и тестов. Поведение мобильного меню и hero будет обновляться вместе с тестами, начиная с red-green TDD цикла.

**Tech Stack:** React 19, TypeScript, CSS Modules, Vitest, Testing Library, Vite

---

### Task 1: Lock the shell and header direction in tests

**Files:**
- Modify: `web/src/components/layout/SiteHeader.test.tsx`
- Modify: `web/src/App.test.tsx`
- Modify: `web/src/styles/MotionTheme.test.ts`

- [ ] **Step 1: Write failing tests for the new header expectations**

Add assertions that mobile header no longer renders a top-row order CTA and that the order action appears in the mobile panel as a text-heavy entry.

- [ ] **Step 2: Run the targeted tests to verify they fail**

Run: `npm run test -- --run web/src/components/layout/SiteHeader.test.tsx web/src/styles/MotionTheme.test.ts`

Expected: FAIL because current header and shell styles still expose the old island/section-frame behavior.

- [ ] **Step 3: Add shell-level failing expectations**

Add style expectations that `global.css` no longer uses section surface pseudo-panels as large framed islands for homepage sections.

- [ ] **Step 4: Re-run the targeted tests**

Run: `npm run test -- --run web/src/components/layout/SiteHeader.test.tsx web/src/styles/MotionTheme.test.ts`

Expected: FAIL with the new intended assertions, confirming the tests are actually catching the old behavior.

### Task 2: Rebuild the full-width shell and section surface system

**Files:**
- Modify: `web/src/styles/global.css`
- Modify: `web/src/styles/tokens.css`
- Test: `web/src/styles/MotionTheme.test.ts`

- [ ] **Step 1: Remove the large framed section surfaces**

Replace the current `[data-section-surface]::before` island treatment with wide canvas gradients and simpler section spacing rules.

- [ ] **Step 2: Keep only the boundaries we still want**

Preserve support for:
- service cards
- faq items
- subtle local dividers

while removing the impression of large boxed sections.

- [ ] **Step 3: Run the shell style tests**

Run: `npm run test -- --run web/src/styles/MotionTheme.test.ts`

Expected: PASS

### Task 3: Rework the header for full-width desktop and simplified mobile

**Files:**
- Modify: `web/src/components/layout/SiteHeader.tsx`
- Modify: `web/src/components/layout/SiteHeader.module.css`
- Test: `web/src/components/layout/SiteHeader.test.tsx`

- [ ] **Step 1: Update the failing header tests if needed**

Cover:
- full-width header container behavior
- no mobile top-row CTA button
- `Заказать →` moved into mobile menu

- [ ] **Step 2: Run the header test to keep the red state honest**

Run: `npm run test -- --run web/src/components/layout/SiteHeader.test.tsx`

Expected: FAIL

- [ ] **Step 3: Implement the header structure changes**

Adjust markup so:
- desktop keeps text CTA in the header row
- mobile top row keeps only brand + burger
- mobile menu includes a bold `Заказать →` action

- [ ] **Step 4: Implement the full-width header styling**

Make the header span the page width cleanly on desktop and mobile, removing the centered island feel.

- [ ] **Step 5: Run the header test again**

Run: `npm run test -- --run web/src/components/layout/SiteHeader.test.tsx`

Expected: PASS

### Task 4: Lift the mobile hero and preserve the clean hero composition

**Files:**
- Modify: `web/src/components/sections/HeroSection.module.css`
- Possibly modify: `web/src/components/sections/HeroSection.tsx`
- Test: `web/src/components/sections/HeroSection.test.tsx`

- [ ] **Step 1: Add or update a test for the intended mobile hero rhythm**

Capture the mobile-oriented expectation through CSS assertions or existing semantic structure checks where practical.

- [ ] **Step 2: Run the hero test to confirm the red state if the test changed**

Run: `npm run test -- --run web/src/components/sections/HeroSection.test.tsx`

Expected: FAIL if new assertions were added.

- [ ] **Step 3: Adjust hero spacing**

Move the text/buttons group higher on mobile while preserving the clean three-line heading and keeping free space below.

- [ ] **Step 4: Re-run the hero test**

Run: `npm run test -- --run web/src/components/sections/HeroSection.test.tsx`

Expected: PASS

### Task 5: Turn About into editorial content with a vertical fact ladder

**Files:**
- Modify: `web/src/components/sections/AboutSection.tsx`
- Modify: `web/src/components/sections/AboutSection.module.css`
- Test: `web/src/components/sections/AboutSection.test.tsx`

- [ ] **Step 1: Add a failing test for the new fact presentation if the current test does not cover it**

The section should still expose the three fact labels, but no longer depend on card styling.

- [ ] **Step 2: Run the About test to verify the failure**

Run: `npm run test -- --run web/src/components/sections/AboutSection.test.tsx`

Expected: FAIL if new structure assertions were added.

- [ ] **Step 3: Replace card-like facts with a vertical editorial ladder**

Keep:
- accent value
- supporting label below each value

Remove:
- card/pill framing
- boxed grouping

- [ ] **Step 4: Re-run the About test**

Run: `npm run test -- --run web/src/components/sections/AboutSection.test.tsx`

Expected: PASS

### Task 6: Remove the outer services frame and keep only service cards

**Files:**
- Modify: `web/src/components/sections/ServicesSection.tsx`
- Modify: `web/src/components/sections/ServicesSection.module.css`
- Test: `web/src/components/sections/ServicesSection.test.tsx`

- [ ] **Step 1: Write the failing test for “cards only, no outer frame”**

Add a check that the section still renders service cards but no longer depends on a large outer framed surface.

- [ ] **Step 2: Run the services test to verify it fails**

Run: `npm run test -- --run web/src/components/sections/ServicesSection.test.tsx`

Expected: FAIL

- [ ] **Step 3: Remove the outer frame styling and keep the centered heading**

Retain:
- centered heading
- card grid

Remove:
- large surrounding panel feel

- [ ] **Step 4: Re-run the services test**

Run: `npm run test -- --run web/src/components/sections/ServicesSection.test.tsx`

Expected: PASS

### Task 7: Keep FAQ item framing while removing section-level boxing

**Files:**
- Modify: `web/src/components/sections/FaqSection.tsx`
- Modify: `web/src/components/sections/FaqSection.module.css`
- Test: `web/src/components/sections/FaqSection.test.tsx`

- [ ] **Step 1: Add a failing test that preserves FAQ item framing only**

The section should still show interactive framed items, but not a large framed wrapper around the whole section.

- [ ] **Step 2: Run the FAQ test to verify it fails**

Run: `npm run test -- --run web/src/components/sections/FaqSection.test.tsx`

Expected: FAIL

- [ ] **Step 3: Simplify section-level layout while preserving item affordance**

Remove the section container island but keep each question/answer item visually structured.

- [ ] **Step 4: Re-run the FAQ test**

Run: `npm run test -- --run web/src/components/sections/FaqSection.test.tsx`

Expected: PASS

### Task 8: Recompose Contacts with a left info column and right visual placeholder

**Files:**
- Modify: `web/src/components/sections/ContactPlaceholderSection.tsx`
- Modify: `web/src/components/sections/ContactPlaceholderSection.module.css`
- Test: `web/src/components/sections/ContactPlaceholderSection.test.tsx`

- [ ] **Step 1: Add a failing test for the new contact composition**

Cover:
- left-aligned contact content
- social/action group remains visible
- right-side placeholder area exists for future artwork

- [ ] **Step 2: Run the contact section test to verify it fails**

Run: `npm run test -- --run web/src/components/sections/ContactPlaceholderSection.test.tsx`

Expected: FAIL

- [ ] **Step 3: Implement the new two-column composition**

Use a calm wide layout inspired by the reference:
- text and contacts on the left
- empty visual slot on the right instead of a map

- [ ] **Step 4: Re-run the contact section test**

Run: `npm run test -- --run web/src/components/sections/ContactPlaceholderSection.test.tsx`

Expected: PASS

### Task 9: Blend CTA into the new wide shell without changing its concept

**Files:**
- Modify: `web/src/components/sections/CtaSection.module.css`
- Possibly modify: `web/src/components/sections/CtaSection.tsx`
- Test: `web/src/components/sections/CtaSection.test.tsx`

- [ ] **Step 1: Add a failing test only if the current CTA test misses the new shell expectation**

The CTA should remain semantically the same while fitting the new wide-shell rhythm.

- [ ] **Step 2: Run the CTA test**

Run: `npm run test -- --run web/src/components/sections/CtaSection.test.tsx`

Expected: FAIL if new assertions were added.

- [ ] **Step 3: Adjust layout/styling only**

Do not redesign CTA conceptually; only make it sit naturally in the new canvas system.

- [ ] **Step 4: Re-run the CTA test**

Run: `npm run test -- --run web/src/components/sections/CtaSection.test.tsx`

Expected: PASS

### Task 10: Run full regression verification

**Files:**
- Test: `web/src/**/*.test.tsx`
- Test: `web/src/**/*.test.ts`

- [ ] **Step 1: Run the complete test suite**

Run: `npm run test -- --run`

Expected: all tests pass

- [ ] **Step 2: Run lint**

Run: `npm run lint`

Expected: exit 0

- [ ] **Step 3: Run production build**

Run: `npm run build`

Expected: exit 0 and prerender/sitemap succeed

- [ ] **Step 4: Start a local preview for visual review**

Run the local preview command and verify the rebuilt wide-canvas homepage manually in the browser.

- [ ] **Step 5: Commit the implementation locally**

```bash
git add .
git commit -m "feat: reshape homepage into a wide canvas shell"
```
