# Canvas Redesign Design

## Context

Update the current `Праздник каждый день` landing page so it stops feeling like a stack of separate mini-pages and instead reads as one large artistic canvas. Keep the existing section order and overall information architecture, but soften boundaries, simplify visual noise, and rebuild the first-screen composition around a cleaner hero.

This design pass covers:

- replacing the interface logo usage with the real project logo from the workspace root
- removing decorative floating elements
- introducing a more unified page-wide color flow
- rebuilding the hero into a cleaner poster-style composition
- shrinking and softening the inline CTA section
- reducing the size and visual weight of the `О нас` section
- stabilizing tests and encoding-sensitive parts of the project

## Core Visual Direction

### Page As One Canvas

The page must still be made of sections, but it should no longer feel like a set of isolated screen-sized blocks. The whole homepage should read as one continuous composition with gradual color drift and much softer local framing.

### Color Strategy

Use one bright, airy base canvas with soft section-to-section tint changes. Keep the existing warm dessert-like direction, but add more gentle color presence with:

- delicate pink
- muted soft blue
- warm cream / milk tones

Every section may have its own subtle tint, but transitions between sections should feel blended rather than segmented.

### Decorative Cleanup

Remove all floating decorative elements for now, including:

- hanging lamp-like accents
- floating dots
- candy-like particles
- bubble-like ornaments
- similar ambient fillers

The background must stay intentionally open so it can be art-directed later.

## Header And Logo

### Logo Usage

Use the real logo file from the workspace root:

- `C:/Users/606ru/OneDrive/Desktop/але/site/логотип.png`

The user confirmed the file is already suitable for insertion and should be used as-is.

### Header

The header should show:

- the cleaned logo presentation without any bubble/capsule effect
- the text brand name `Праздник каждый день` next to the logo

The header CTA should become calmer and lighter. It should feel closer to an accented text action than to a large standalone button.

### Footer

The footer should also use the real logo, but without the old bubble effect. Because the footer is dark, the logo may sit on a very light milk-toned support surface purely for legibility. This support should feel subtle and functional, not like a decorative badge.

## Hero

### Goal

Rebuild the first screen into a stronger, cleaner poster-style hero inspired by the composition approach of [slip-shop.ru](https://slip-shop.ru/), but without borrowing that site's palette or decorative language.

### Copy

Hero copy should contain only:

- heading: `Фуд-станции на ваше мероприятие`
- primary button: `Заказать`
- secondary button: `В каталог`

No supporting paragraph should remain in this iteration.

### Layout

The hero should become a cleaner left/right composition:

- left side: strong headline + two large buttons
- right side: intentionally empty clean space with soft light only

The right side is a prepared visual field for future art direction, not a placeholder object block.

### Hero Actions

- `Заказать` opens the existing pop-up CTA flow
- `В каталог` scrolls to the services section

## About Section

The `О нас` section should become smaller, calmer, and more compact.

Replace the current heavier composition with:

- a short brand manifesto
- a compact line or grid of mini-facts

Confirmed fact set:

- `7+ лет в праздничных форматах`
- `300+ событий обслужено`
- `1000+ довольных клиентов`

This section should feel like a short meaning anchor inside the page-wide canvas, not like a self-contained presentation card.

## CTA Section

Keep the inline CTA in its current page position, but redesign it into a much smaller embedded accent.

### Must Keep

- the CTA remains on the homepage
- the short inline form stays on the homepage
- the current form logic/content structure stays in place for now
- pop-up CTA flows remain unchanged outside this inline block

### Must Change

- it should no longer feel like a full-width independent block
- it should no longer create a harsh visual break
- it should sit inside the page canvas as a compact mini-section
- it should use the project's own palette, not the reference palette

## Section Framing

Keep the current section order, but visually soften the sense of hard-separated cards:

- reduce border strength
- reduce panel heaviness
- make section shells lighter
- preserve enough structure for readability and future iteration

The result should still be organized, but much less modular-looking.

## Technical Stabilization

This redesign must also improve project stability before deeper UI work continues.

### Required Stabilization Work

- fix the brittle CSS-related unit test that fails due to Windows line ending expectations
- fix Playwright dev-server reuse issues so e2e tests do not accidentally bind to another local server
- verify Russian text remains intact in source files and rendered output
- avoid introducing new encoding problems while editing

### Verification Goals

After implementation, validate at minimum:

- `npm run lint`
- `npm run test`
- `npm run build`

E2E should also be re-checked after server configuration is stabilized.

## Acceptance Criteria

- The page keeps its current section order
- The page feels like one unified artistic canvas instead of stacked mini-pages
- Soft pink and muted blue are introduced into the global color flow
- All floating decorative elements are removed
- The real project logo replaces the current interface logo usage
- Header logo has text brand `Праздник каждый день` beside it
- Footer logo remains visible on the dark background with only a subtle milk-toned support if needed
- Hero contains only the approved heading and two buttons
- Hero right side is clean space with soft light, without temporary objects
- `Заказать` opens the pop-up CTA
- `В каталог` scrolls to services
- `О нас` becomes smaller and consists of a manifesto plus the approved mini-facts
- Inline CTA stays in its current page position but becomes a compact embedded mini-block
- Borders and section shells become lighter and less block-like
- Encoding remains intact
- Lint, unit tests, and build succeed after stabilization
