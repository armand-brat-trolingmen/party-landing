# Multipage Catalog Rebuild Design Spec

## Goal

Rebuild the current single-page Party Everyday landing into a multipage catalog website that keeps the existing visual language but changes the functional structure. The new site should work as a central brand hub with separate internal pages for each main service and each extra service.

## Product Direction

- Keep the current design language, atmosphere, palette, and overall visual personality.
- Do not copy the design of `slip-shop.ru`.
- Use `slip-shop.ru` only as a structural reference for how a catalog-driven party-services site can be organized.
- Remove the old “single-offer landing” mentality and move to a catalog/hub mentality.
- Keep the experience premium, warm, and editorial rather than generic e-commerce.

## Site Architecture

### Public Routes

- `/` — main hub page
- `/services/[slug]` — individual page for each main service
- `/extras/[slug]` — individual page for each extra service
- `/privacy`
- `/terms`
- `/consent`

### Shared Shell

Every public page should share:

- the same header
- the same footer
- the same CTA modal system
- the same visual identity and motion language

### Important Rules

- The Contacts section stays only on the main content flow; there is no separate Contacts page.
- The Team section is fully removed.
- Video reviews are not used.
- Legal pages remain separate and keep their own SEO signals.

## Main Page Structure

The main page should be rebuilt in this order:

1. `Hero`
2. `About / Why us`
3. `Catalog of main services`
4. `Extra services`
5. `CTA block`
6. `Moments gallery`
7. `Reviews`
8. `FAQ`
9. `Contacts`
10. `Footer`

## Hero

The hero keeps the current visual quality and atmosphere but becomes more product-focused.

### Hero Actions

- `Смотреть услуги` — scrolls to the main services catalog
- `Заказать` — opens the CTA modal

## About / Why Us

The About section remains on the main page only.

### Purpose

- explain why Party Everyday is a strong partner for events
- keep the tone atmospheric rather than corporate
- strengthen trust before the user reaches the catalog

### New Addition

Add animated facts/counters such as:

- years of work
- number of events served

The exact final numbers can be filled later.

## Main Services Catalog

This becomes the core section of the home page.

### UX Model

- restaurant-style “menu showcase”
- show the first `6–9` services initially
- add a `Показать ещё` button
- on click, reveal the rest of the services

### Card Structure

Each main service card contains:

- image
- service name
- short elegant and selling description
- small arrow-style action button in the lower-right area

### Card Interaction

- cards do **not** contain a `Заказать` CTA
- card click and arrow-button click both open the related internal page

### Content Input Strategy

At implementation time the user will provide:

- service name
- one image
- starting price
- what is included

Working placeholder short and full descriptions can be generated during implementation and refined later.

## Extra Services Section

Extra services also live on the main page, but as a separate section with a lighter footprint.

### UX Model

- separate block-catalog
- rendered as a horizontal, scrollable ribbon
- compact presentation compared to the main catalog

### Routing

Each extra service also has its own internal page:

- `/extras/[slug]`

## CTA System

There should be one unified CTA system across the site.

### CTA Entry Points

- header button `Заказать`
- hero button `Заказать`
- one dedicated CTA block on the main page
- one dedicated CTA block on every service page
- one dedicated CTA block on every extra-service page

### No CTA Blocks On

- `/privacy`
- `/terms`
- `/consent`

### CTA Modal

The modal contains only:

- name
- phone

It also includes a short consent note with links to the legal documents.

## Moments Gallery

The current moment-based visual section remains, but its role changes.

### New Role

- not a navigation item
- not a review section
- purely an emotional visual gallery before the review section

### UX

- swipe/arrow navigation
- visually rich image-first presentation

## Reviews

The site gets a separate Reviews section after the moments gallery.

### Format

- screenshot-style reviews from Avito
- keep the external Avito proof link

### Relationship With Moments

- moments = emotional pre-proof gallery
- reviews = explicit trust/proof block

## FAQ

Keep the FAQ section in the site.

### Rules

- preserve the accordion format
- preserve accessibility and SEO value
- keep it in the new content flow on the home page
- reuse it on service and extra-service pages

## Contacts

Contacts stay only inside the main content flow and are not split into a dedicated route.

They remain the main direct contact section of the site and appear:

- on the home page
- in the content flow of service and extra-service pages

## Footer

Keep the current compact footer design and use it on all pages.

## Internal Service Page Structure

Every `/services/[slug]` page should feel like the same website, just opened with a specific service at the top.

### Order

1. specific service intro block
2. CTA block
3. main services catalog
4. extra services
5. moments gallery
6. reviews
7. FAQ
8. contacts
9. footer

### Service Intro Block

This is not a mini-landing. It is a clean informational block that includes:

- service name
- strong lead visual
- concise description
- what is included
- starting price
- `Заказать` button

## Internal Extra-Service Page Structure

Every `/extras/[slug]` page follows the same logic as service pages, but for extra services.

### Order

1. specific extra-service intro block
2. CTA block
3. main services catalog
4. extra services
5. moments gallery
6. reviews
7. FAQ
8. contacts
9. footer

## Header Rules

The header remains global and reusable.

### Header Content

- logo
- navigation
- `Заказать` button

### Navigation Targets

For the new structure, header navigation should conceptually point to:

- About
- Services
- Extra services
- Reviews
- FAQ
- Contacts

The exact interaction model can remain anchor-based inside the current page context, while logo always routes to `/`.

## Content Model

The current section-first content structure should be refactored into entity-first content.

### Core Content Buckets

- `homePageContent`
- `services`
- `extras`
- `moments`
- `reviews`
- `faq`
- `contact`
- `footer`

### Service Entity Shape

Each main service should eventually support:

- `slug`
- `name`
- `shortDescription`
- `fullDescription`
- `image`
- `priceFrom`
- `included`
- `seoTitle`
- `seoDescription`

### Extra-Service Entity Shape

Each extra service should eventually support:

- `slug`
- `name`
- `shortDescription`
- `fullDescription`
- `image`
- `priceFrom`
- `included`
- `seoTitle`
- `seoDescription`

## SEO Direction

The rebuilt site should preserve the current SEO foundation and improve it through multiple internal pages.

### Requirements

- each service page gets its own SEO title and description
- each extra-service page gets its own SEO title and description
- canonical and structured data should align with the new route model
- legal pages retain their own SEO

## Implementation Strategy

The rebuild should happen in this order:

1. refactor content/data model
2. add route architecture for services and extras
3. rebuild the main page structure
4. build the shared service-page template
5. build the shared extra-page template
6. connect the unified CTA modal
7. wire SEO/meta/schema to the new route model

## Content Dependencies

The user does **not** need to provide all service content before planning starts.

### Needed Later For Catalog Build

Per service / extra service:

- name
- one image
- starting price
- what is included

### Temporary Authoring Rule

Short descriptions and full descriptions may be drafted during implementation and replaced later when final business copy arrives.

## Out Of Scope

- copying the visual design of the reference website
- video testimonials
- a Team section
- a dedicated Contacts page
- final legal copy rewrite
- final service copy polish before factual content is provided
