# Canvas Redesign Design

## Context

Refine the current `Праздник каждый день` landing page so the homepage reads like one continuous artistic canvas instead of a stack of separate framed blocks. Keep the existing section order and information architecture, but remove the outer shells that make each section feel like its own mini-page.

This design pass continues the already approved visual cleanup and adds a second stage of shell redesign:

- keep the current logo, hero, CTA, and section order direction
- remove outer frames from the homepage shell
- keep framed cards only where they are structurally useful in services
- replace duplicate heading systems with one large section title
- separate sections through spacing, title rhythm, and color-tinted canvas zones
- keep the page ready for future animation work by introducing more open space

## Core Goal

The homepage should feel closer to the composition rhythm of [slip-shop.ru](https://slip-shop.ru/) without copying its palette or layout literally.

The reference is used for:

- seamless section transitions
- stronger section headings
- a more editorial feeling of one long page
- less dependence on boxes and cards for structure

The reference must not be copied in:

- color palette
- decorative assets
- branding
- overall art direction

The site must remain recognizably its own design, using the existing sweet, airy, dessert-like visual language.

## Visual Direction

### One Canvas Instead Of Many Blocks

The homepage remains section-based in markup and navigation, but should no longer look section-based in its chrome. The page should feel painted in chapters rather than assembled from panels.

The new structure relies on:

- one large heading per section
- more vertical breathing room before and after content
- soft color shifts between sections
- minimal internal separators instead of card shells

### Color Chapters

Each major section should have its own soft tint zone so the user can still feel where they are on the page even after the outer borders disappear.

Preferred section tint language:

- blush pink
- pale lemon
- soft sky blue
- warm milk / cream

These should remain gentle and airy rather than saturated. The goal is not “more gradients,” but clearer contrast between neighboring sections so the page does not collapse into a mostly white surface.

### CTA Relationship

The inline CTA remains orange and acts as the warmest point on the page. The surrounding sections should transition toward it naturally:

- the section before CTA can lean warmer
- the section after CTA can cool slightly back toward milk-blue or milk-pink

This avoids a harsh visual break while still letting CTA stay prominent.

## Heading System

### Single Title Per Section

Every homepage section should have exactly one main heading. Remove eyebrow labels and any duplicated title-like text that repeats the section name.

This applies to sections such as:

- `О нас`
- `Услуги`
- `Доп. услуги`
- `Отзывы`
- `FAQ`
- `Контакты`

### Placement

Section titles should be placed as a separate line above the section content, not embedded inside the content layout.

This creates a cleaner reading rhythm:

1. user sees the section title
2. user gets a bit of air
3. user reads the section content

### Alignment

Use a consistent heading system with one intentional exception:

- most section titles are left-aligned
- `Услуги` is centered to make it feel like the main showcase section

## Section Treatment

### Global Rule

Remove outer framed containers from all main homepage sections.

That means the shell should no longer rely on:

- thick borders
- rounded panel wrappers
- card-like section backgrounds
- shadowed outer containers

Instead, sections are separated by:

- title rhythm
- vertical spacing
- local tint changes
- occasional very light line separators where necessary

### About

`О нас` stays compact and meaning-focused:

- one large title
- short manifesto
- mini-facts below

It should read like a compact editorial insert inside the canvas, not like a boxed brand card.

### Services

`Услуги` keeps framed service cards, but only the cards themselves.

Changes:

- remove the outer services frame
- keep the service cards framed and readable
- keep this section centered in tone and composition

This is the only major homepage section where card framing remains a key structural tool.

### Extras, Reviews, FAQ, Contacts

These sections should lose the “separate card block” treatment and move toward lighter internal structure.

Allowed structure:

- spacing
- tint shifts
- thin dividers
- softer internal grouping

Avoid:

- boxed outer wrappers
- card-heavy repeated shells
- anything that reads like a second mini-landing page inside the main page

## Hero

The hero direction already approved remains in place and should be preserved during this redesign:

- clean left-side title layout
- large CTA buttons
- right-side clean visual field
- no unnecessary decorative elements

The shell redesign must not reintroduce noisy color residue or panel framing into the hero.

## CTA

The CTA direction already approved remains in place and should be preserved:

- warm orange accent
- full-width presence inside the page flow
- no hard card shell around it
- short inline form on the homepage

During the shell redesign, neighboring sections should be tuned so the CTA feels embedded in the page composition rather than pasted between unrelated blocks.

## Decorative Restraint

Keep floating decorative elements removed for now:

- no lamp-like drops
- no drifting candy shapes
- no ambient bubbles
- no residual mini-animation traces in the canvas

The page should feel intentionally open and ready for future animation layers.

## Technical Constraints

### Encoding Safety

Do not break Russian text or asset references while editing. The project has had encoding issues already, so all changes must preserve correct text rendering and file integrity.

### Stability

Keep the earlier stabilization work intact while doing this redesign:

- lint must remain clean
- unit tests must remain clean
- build must remain clean
- the Playwright server configuration fix must not regress

## Acceptance Criteria

- Homepage section order remains unchanged
- Outer framed shells are removed from the main homepage sections
- `Услуги` keeps framed service cards but loses the outer frame
- Every major homepage section has one large section title only
- Eyebrow labels and duplicate section-name headings are removed
- Most section titles are left-aligned
- `Услуги` title is centered
- Sections are distinguished through spacing and soft tint zones instead of boxes
- The page feels more like one continuous canvas and less like stacked mini-pages
- Neighboring sections have more visible tint differences than before while staying soft
- CTA remains warm orange and visually integrated with nearby sections
- No floating decorative fillers return during this redesign
- Russian text and branding assets remain intact
- `npm run lint`, `npm run test -- --run`, and `npm run build` pass after implementation
