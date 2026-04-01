# Party Landing Design

## Context And Goals

Create a one-page landing site for `Party`, a catering and celebration company. The site should feel warm, festive, sweet, and upbeat for an audience aged 30-50 who may be planning office events, children's parties, family celebrations, or other festive gatherings.

The landing page is a showcase of the company's possibilities rather than a configurator or service picker. The experience should first immerse visitors in the atmosphere and available formats, then move them toward contact later on the page.

Core brand direction:

- Brand name: `Party`
- Tagline: `Почувствуй атмосферу праздника с нашей помощью!`
- Tone: sweet-editorial, playful, warm, light, adult-friendly
- Core services: food trucks, cotton candy station, chocolate fountain, animators
- Real people should appear only in the reviews section
- Service visuals should be based on stylized object scenes, ideally using existing reference photos as a source for later illustration/stylization

## Design Direction

The visual direction is `Sweet Editorial`.

This means the landing page should combine:

- editorial composition and large expressive typography
- playful dessert-like warmth and softness
- clean, high-trust layout for an adult audience
- light decorative energy without becoming childish or cluttered

The visual reference contributes:

- expressive serif headline styling
- light hand-drawn or imperfect accents
- human, playful rhythm in the composition

The local design reference contributes:

- soft warmth
- clear layout discipline
- cozy, welcoming brand feel

The final site should not copy the dark palette of the visual example. Instead, it should reinterpret the typography and playful layout language in a bright, creamy, lemon-tinted environment.

## Layout Structure

The landing page should use anchor-based top navigation and scroll as one continuous story.

Recommended section order:

1. Hero
2. Services Showcase
3. About / Why Party
4. Atmosphere Gallery
5. Reviews
6. FAQ Placeholder
7. Final Contact CTA Placeholder

### 1. Hero

Purpose:

- establish atmosphere immediately
- present the brand identity
- communicate that Party creates festive experiences
- introduce the main service world visually

Structure:

- top anchor navigation
- logo on the left: pink donut with white sprinkles plus the `Party` wordmark
- navigation items on the right or centered, depending on final balancing:
  `О нас`, `Услуги`, `Галерея`, `Отзывы`, `FAQ`, `Контакты`
- left text column with:
  - main tagline `Почувствуй атмосферу праздника с нашей помощью!`
  - short supporting text about festive catering and event formats
- no CTA button in the hero
- right visual composition:
  - central food truck as the hero object
  - stylized in a realistic-cartoon treatment
  - cotton candy and chocolate fountain shown as side “cards” fanned around the truck, inspired by a hand of playing cards

Notes:

- the hero should feel premium-light, not corporate
- the illustration should be rich enough to anchor the page, but the text must still stay readable and calm

### 2. Services Showcase

Purpose:

- show the company's full set of festive formats
- quickly communicate range and personality

Structure:

- one large horizontal showcase rather than a conventional card grid
- four distinct visual service elements:
  - Food Trucks
  - Cotton Candy
  - Chocolate Fountain
  - Animators

Desktop behavior:

- the four elements sit in one broad rhythmic strip
- each item feels like its own mini-scene, not a generic card
- composition should vary slightly across the four items for a more editorial look

Mobile behavior:

- transform into a swipeable carousel row

### 3. About / Why Party

Purpose:

- build trust after the visual service introduction
- explain the promise behind the brand

Content direction:

- Party helps create festive atmosphere
- suitable for private and corporate celebrations
- visually memorable event formats
- warm, easy, and joyful event presence

### 4. Atmosphere Gallery

Purpose:

- deepen the emotional impression
- reinforce the brand's visual richness

Content direction:

- stylized or curated service visuals without people
- can include food truck details, cotton candy station details, chocolate fountain details, festive decor moments
- may later incorporate transformed versions of the provided source imagery

### 5. Reviews

Purpose:

- provide human trust and authenticity

Content direction:

- real photos with people are allowed only here
- final review text and selected photos will be added later
- the section should be designed now as a flexible review layout template

### 6. FAQ Placeholder

Purpose:

- hold future practical questions

Status:

- placeholder structure only for now

### 7. Final Contact CTA Placeholder

Purpose:

- provide the conversion point later in the page after the visitor has already seen services and trust signals

Status:

- placeholder layout only for now
- can later include form, messengers, phone, or a hybrid contact format

## Visual System

### Palette

The main background should not be pure white. Use a very pale lemon-cream tone as the primary page base.

Suggested palette direction:

- base background: pale lemon cream
- secondary surfaces: warm cream / near-white
- playful accent yellow: soft dessert yellow
- accent red: strawberry or tomato-warm red
- accent pink: donut pink
- supporting brown: soft chocolate or caramel brown for selective contrast

The palette must feel edible, sunny, and inviting without becoming oversaturated.

### Typography

Use:

- expressive serif for major headings
- soft sans-serif for paragraphs, labels, buttons, and navigation

Typography goals:

- large editorial impact in hero and section headers
- high readability in body content
- mature but joyful tone

### Shapes And Decoration

Allowed:

- rounded containers
- gentle asymmetry
- subtle wavy underlines
- hand-drawn style marks in small doses
- card tilts and layered compositions
- soft shadows and paper-like depth

Avoid:

- overly glossy candy effects
- aggressive gradients
- overly childish cartoon treatment
- too many doodles competing with the content

## UX Behavior

### Navigation

- one-page navigation with anchor scrolling
- top navigation should remain easy to scan and not feel heavy
- section labels should feel clean and practical to balance the playful visuals

### Reading Flow

The user journey should be:

1. Feel the celebration mood
2. Understand the service range
3. Trust the brand
4. See real proof in reviews
5. Reach contact options later

### Mobile Experience

- preserve the warmth and hero atmosphere without overcrowding
- services block becomes swipe-based
- navigation should collapse elegantly while keeping access to sections simple

## Content Standards

The writing should be:

- warm
- concise
- positive
- non-pushy

The site should sound like an inviting event partner, not a formal catering catalog.

## Acceptance Criteria

- The landing page is clearly one-page and anchor-driven
- The hero has no CTA button
- The hero centers the food truck as the main visual object
- Cotton candy and chocolate fountain appear as side-card visuals in hero
- Animators appear in the services section, not in the hero composition
- Services are presented in one large horizontal showcase on desktop
- Services become a swipeable row on mobile
- Real human photos appear only in reviews
- FAQ and final contact sections exist as placeholders
- The overall style feels sweet, playful, editorial, and adult-friendly

## Risks And Design Notes

- If the palette becomes too pink or too bright, the site may skew too childish for the target audience
- If the decorative elements are overused, they will weaken trust and clarity
- If the hero illustration becomes too detailed, it may compete with the headline
- The service showcase needs careful responsive behavior so it still feels premium on smaller screens

## Implementation Outline

High-level implementation phases:

1. Define tokens: colors, typography, spacing, radii, shadows
2. Build page skeleton and anchor navigation
3. Design and implement hero composition
4. Implement the horizontal services showcase with mobile swipe behavior
5. Add About / Why Party, gallery, reviews template, FAQ placeholder, and CTA placeholder
6. Tune responsive spacing and hierarchy
7. Fill final copy, reviews, and contact details later
