# Canvas Shell Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove outer section frames from the homepage shell and rebuild the main page as one continuous canvas with one large title per section.

**Architecture:** Keep the current React/Vite section structure and existing section order, but move visual separation out of framed wrappers and into a shared heading system, larger vertical rhythm, and soft section tint zones. Implement the redesign in three layers: first normalize the shared `SectionHeading` primitive, then refactor section markup to a frameless shell with explicit surface/tone semantics, then rebuild the CSS and tests so the page reads as one long composition while preserving service-card framing.

**Tech Stack:** React 19, TypeScript, Vite, CSS Modules, React Router, Vitest

---

## File Map

**Create**
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ExtrasSection.test.tsx` — coverage for the extras section after the shell refactor

**Modify**
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/App.tsx` — switch the shell away from the legacy `story-trail` motion preset if the new canvas naming is clearer
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/App.test.tsx` — keep section order assertions, but align shell expectations with the frameless canvas
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/ui/SectionHeading.tsx` — simplify to a single-title primitive with optional alignment only
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/ui/SectionHeading.test.tsx` — assert the new one-title heading contract
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/AboutSection.tsx` — remove outer frame wrapper and use the shared section heading
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/AboutSection.module.css` — replace framed shell styles with tint/spacing styles
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/AboutSection.test.tsx` — assert the compact frameless section semantics
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ServicesSection.tsx` — remove the outer frame while keeping the service cards framed and center the heading
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ServicesSection.module.css` — keep card borders, drop the section shell, tune centered heading spacing
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ServicesSection.test.tsx` — assert centered heading and preserved card behavior
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ExtrasSection.tsx` — switch to a frameless section body and shared title rhythm
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ExtrasSection.module.css` — keep the offerings readable without a heavy outer wrapper
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ReviewsSection.tsx` — remove the outer frame and keep the photo slider embedded in the canvas
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ReviewsSection.module.css` — move the section from card-shell styling to tinted canvas styling
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ReviewsSection.test.tsx` — assert the section still behaves as a manual gallery in the frameless shell
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/TestimonialsSection.tsx` — remove the outer frame and keep internal review cards/proof readable
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/TestimonialsSection.module.css` — soften internal grouping while keeping text proof readable
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/TestimonialsSection.test.tsx` — assert the section remains the proof block for reviews
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/FaqSection.tsx` — remove the outer frame while keeping the accordion items structured
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/FaqSection.module.css` — keep accordion item borders and reduce the sense of a boxed section wrapper
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/FaqSection.test.tsx` — assert FAQ keeps its accordion behavior in the new shell
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ContactPlaceholderSection.tsx` — remove the outer frame and keep only softer internal grouping
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ContactPlaceholderSection.module.css` — replace section-shell styling with tint, spacing, and light dividers
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ContactPlaceholderSection.test.tsx` — assert contact actions still render correctly in the frameless shell
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/CtaSection.tsx` — update heading usage to the one-title pattern and keep the CTA embedded in the flow
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/CtaSection.module.css` — tune CTA adjacency so it blends into nearby sections
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/CtaSection.test.tsx` — assert the CTA still exposes the inline form and legal links
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/styles/tokens.css` — strengthen the section-tone palette (blush, lemon, blue, milk) without making it loud
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/styles/global.css` — define the page-wide canvas, section spacing, heading rhythm, and frame-free shell behavior
- `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/styles/MotionTheme.test.ts` — update style assertions for the new frameless shell and section-tone system

---

### Task 1: Normalize the shared section heading to a one-title system

**Files:**
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/ui/SectionHeading.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/ui/SectionHeading.test.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/AboutSection.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ServicesSection.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ExtrasSection.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ReviewsSection.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/TestimonialsSection.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/FaqSection.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ContactPlaceholderSection.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/CtaSection.tsx`

- [ ] **Step 1: Rewrite the shared heading test to the new contract**

Update `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/ui/SectionHeading.test.tsx` so it no longer expects an eyebrow paragraph and instead checks alignment support.

Example:
```tsx
render(<SectionHeading title="Заголовок" description="Описание" align="center" />);

expect(screen.queryByText('Раздел')).not.toBeInTheDocument();
expect(screen.getByRole('heading', { level: 2, name: 'Заголовок' })).toBeInTheDocument();
expect(screen.getByRole('heading', { level: 2, name: 'Заголовок' }).closest('header')).toHaveAttribute(
  'data-heading-align',
  'center',
);
```

- [ ] **Step 2: Run the targeted shared-heading test and verify it fails**

Run:
```powershell
npm run test -- --run src/components/ui/SectionHeading.test.tsx
```

Expected:
- FAIL because `SectionHeading` still renders `eyebrow`

- [ ] **Step 3: Implement the simplified heading primitive**

Refactor `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/ui/SectionHeading.tsx` to use title, description, and alignment only.

Target shape:
```tsx
type SectionHeadingProps = {
  title: ReactNode;
  description?: ReactNode;
  align?: 'start' | 'center';
};

export function SectionHeading({ title, description, align = 'start' }: SectionHeadingProps) {
  return (
    <header className="site-section__header" data-heading-align={align}>
      <h2>{title}</h2>
      {description ? <p className="site-section__description">{description}</p> : null}
    </header>
  );
}
```

- [ ] **Step 4: Update all homepage section callsites**

In each section component listed above:
- remove the `eyebrow` prop from `SectionHeading`
- keep one large heading per section
- pass `align="center"` only for `ServicesSection`
- let all other sections use the default left alignment

- [ ] **Step 5: Re-run the shared-heading test**

Run:
```powershell
npm run test -- --run src/components/ui/SectionHeading.test.tsx
```

Expected:
- PASS

- [ ] **Step 6: Commit the heading-system refactor**

Run:
```powershell
git add web/src/components/ui/SectionHeading.tsx web/src/components/ui/SectionHeading.test.tsx web/src/components/sections/AboutSection.tsx web/src/components/sections/ServicesSection.tsx web/src/components/sections/ExtrasSection.tsx web/src/components/sections/ReviewsSection.tsx web/src/components/sections/TestimonialsSection.tsx web/src/components/sections/FaqSection.tsx web/src/components/sections/ContactPlaceholderSection.tsx web/src/components/sections/CtaSection.tsx
git commit -m "refactor: simplify homepage section headings"
```

Expected:
- a commit exists with the one-title heading primitive

---

### Task 2: Remove homepage section frames in markup while preserving service cards

**Files:**
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/App.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/App.test.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/AboutSection.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/AboutSection.test.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ServicesSection.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ServicesSection.test.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ExtrasSection.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ExtrasSection.test.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ReviewsSection.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ReviewsSection.test.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/TestimonialsSection.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/TestimonialsSection.test.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/FaqSection.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/FaqSection.test.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ContactPlaceholderSection.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ContactPlaceholderSection.test.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/CtaSection.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/CtaSection.test.tsx`

- [ ] **Step 1: Write failing tests for frame-free section surfaces**

Use small surface markers instead of brittle DOM-shape assertions. For each main section, add `data-section-surface` and `data-section-tone` expectations.

Examples:
```tsx
expect(screen.getByTestId('section-about').querySelector('[data-section-surface="canvas"]')).toBeTruthy();
expect(screen.getByTestId('section-services').querySelector('[data-section-surface="cards"]')).toBeTruthy();
expect(screen.getByTestId('section-services').querySelector('[data-heading-align="center"]')).toBeTruthy();
```

Create `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ExtrasSection.test.tsx` with a basic assertion for:
- heading `Доп. услуги`
- `data-section-surface="canvas"`
- `data-testid="extras-track"` remains present

- [ ] **Step 2: Run the targeted section test batch and verify it fails**

Run:
```powershell
npm run test -- --run src/App.test.tsx src/components/sections/AboutSection.test.tsx src/components/sections/ServicesSection.test.tsx src/components/sections/ExtrasSection.test.tsx src/components/sections/ReviewsSection.test.tsx src/components/sections/TestimonialsSection.test.tsx src/components/sections/FaqSection.test.tsx src/components/sections/ContactPlaceholderSection.test.tsx src/components/sections/CtaSection.test.tsx
```

Expected:
- FAIL because the sections still render outer `.frame` wrappers and no explicit surface semantics

- [ ] **Step 3: Refactor section markup to use lightweight canvas surfaces**

In each homepage section component:
- remove the outer `article` shell with `styles.frame`
- introduce a lightweight section body container with a semantic marker
- keep inner content structure intact where it matters

Recommended pattern:
```tsx
<section ...>
  <div className="site-container site-reveal" ...>
    <div className={styles.sectionBody} data-section-surface="canvas" data-section-tone="rose">
      <SectionHeading ... />
      <div className={styles.layout}>...</div>
    </div>
  </div>
</section>
```

For `ServicesSection`, keep the service cards framed and mark the section body differently:
```tsx
<div className={styles.sectionBody} data-section-surface="cards" data-section-tone="lemon">
```

- [ ] **Step 4: Clean up the shell naming in `App.tsx` and `App.test.tsx`**

If `motionPath="story-trail"` now reads as legacy decoration, rename it to a neutral canvas value such as `canvas-flow`, or remove it entirely if it is no longer needed.

Update `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/App.test.tsx` so the main shell assertion matches the new value.

- [ ] **Step 5: Re-run the targeted section test batch**

Run:
```powershell
npm run test -- --run src/App.test.tsx src/components/sections/AboutSection.test.tsx src/components/sections/ServicesSection.test.tsx src/components/sections/ExtrasSection.test.tsx src/components/sections/ReviewsSection.test.tsx src/components/sections/TestimonialsSection.test.tsx src/components/sections/FaqSection.test.tsx src/components/sections/ContactPlaceholderSection.test.tsx src/components/sections/CtaSection.test.tsx
```

Expected:
- PASS

- [ ] **Step 6: Commit the frame-free section markup**

Run:
```powershell
git add web/src/App.tsx web/src/App.test.tsx web/src/components/sections/AboutSection.tsx web/src/components/sections/AboutSection.test.tsx web/src/components/sections/ServicesSection.tsx web/src/components/sections/ServicesSection.test.tsx web/src/components/sections/ExtrasSection.tsx web/src/components/sections/ExtrasSection.test.tsx web/src/components/sections/ReviewsSection.tsx web/src/components/sections/ReviewsSection.test.tsx web/src/components/sections/TestimonialsSection.tsx web/src/components/sections/TestimonialsSection.test.tsx web/src/components/sections/FaqSection.tsx web/src/components/sections/FaqSection.test.tsx web/src/components/sections/ContactPlaceholderSection.tsx web/src/components/sections/ContactPlaceholderSection.test.tsx web/src/components/sections/CtaSection.tsx web/src/components/sections/CtaSection.test.tsx
git commit -m "refactor: remove homepage section frame wrappers"
```

Expected:
- a commit exists with frameless section markup and preserved service-card structure

---

### Task 3: Rebuild the shell styling as color chapters instead of framed panels

**Files:**
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/styles/tokens.css`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/styles/global.css`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/styles/MotionTheme.test.ts`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/AboutSection.module.css`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ServicesSection.module.css`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ExtrasSection.module.css`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ReviewsSection.module.css`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/TestimonialsSection.module.css`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/FaqSection.module.css`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ContactPlaceholderSection.module.css`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/CtaSection.module.css`

- [ ] **Step 1: Rewrite the style assertions for the new canvas rules**

Update `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/styles/MotionTheme.test.ts` to check the new shell system rather than old `.frame` assumptions.

Examples:
```ts
expect(globalCss).toContain('[data-heading-align=\'center\']');
expect(globalCss).toContain('[data-section-tone=\'lemon\']');
expect(globalCss).not.toContain(".site-shell[data-motion-path='story-trail'] > #about::before");
expect(servicesCss).toContain('.card {');
expect(servicesCss).not.toContain('.frame {');
```

- [ ] **Step 2: Run the style-focused test file and verify it fails**

Run:
```powershell
npm run test -- --run src/styles/MotionTheme.test.ts
```

Expected:
- FAIL because the CSS modules and global shell still use old frame rules

- [ ] **Step 3: Strengthen the shared palette for section chapters**

In `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/styles/tokens.css`, add or adjust tokens for:
- blush pink chapter tones
- pale lemon chapter tones
- soft blue chapter tones
- milk/cream neutrals
- lighter dividers and softer shell shadows

- [ ] **Step 4: Rewrite the global shell rhythm**

In `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/styles/global.css`:
- increase vertical spacing between section titles and content
- define heading alignment styles through `[data-heading-align]`
- define shared section-tone behavior through `[data-section-tone]`
- keep the page as one canvas, not a set of inset cards
- remove any remaining legacy story-trail assumptions if they still exist

- [ ] **Step 5: Replace section `.frame` styling with local canvas styling**

In the section CSS modules:
- rename `.frame` to `.sectionBody` or an equivalent neutral surface class
- remove borders, rounded outer wrappers, and outer shadows from main sections
- keep card framing only where it is part of content structure:
  - service cards stay framed
  - FAQ items may keep light separators/borders
  - testimonials/review proof may keep softer inner grouping
  - contact actions may keep lighter internal tiles
- tune neighboring section tones so the page transitions naturally into and out of the orange CTA

- [ ] **Step 6: Re-run the style-focused test and the targeted section batch**

Run:
```powershell
npm run test -- --run src/styles/MotionTheme.test.ts src/components/sections/AboutSection.test.tsx src/components/sections/ServicesSection.test.tsx src/components/sections/ExtrasSection.test.tsx src/components/sections/ReviewsSection.test.tsx src/components/sections/TestimonialsSection.test.tsx src/components/sections/FaqSection.test.tsx src/components/sections/ContactPlaceholderSection.test.tsx src/components/sections/CtaSection.test.tsx
```

Expected:
- PASS

- [ ] **Step 7: Commit the canvas styling**

Run:
```powershell
git add web/src/styles/tokens.css web/src/styles/global.css web/src/styles/MotionTheme.test.ts web/src/components/sections/AboutSection.module.css web/src/components/sections/ServicesSection.module.css web/src/components/sections/ExtrasSection.module.css web/src/components/sections/ReviewsSection.module.css web/src/components/sections/TestimonialsSection.module.css web/src/components/sections/FaqSection.module.css web/src/components/sections/ContactPlaceholderSection.module.css web/src/components/sections/CtaSection.module.css
git commit -m "feat: restyle homepage as a continuous canvas"
```

Expected:
- a commit exists with the new frameless shell styling

---

### Task 4: Run full verification and prepare a local preview

**Files:**
- Verify only unless a regression fix is required

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
npm run test -- --run
```

Expected:
- PASS

- [ ] **Step 3: Run the production build**

Run:
```powershell
npm run build
```

Expected:
- PASS

- [ ] **Step 4: Start a local preview for visual review**

Run:
```powershell
npm run preview -- --host 127.0.0.1 --port 4180 --strictPort
```

Expected:
- local preview is available at `http://127.0.0.1:4180`

- [ ] **Step 5: Commit any final regression fixes only if verification required code changes**

Run:
```powershell
git add web
git commit -m "test: verify canvas shell redesign"
```

Expected:
- only needed if verification exposed and fixed real regressions
