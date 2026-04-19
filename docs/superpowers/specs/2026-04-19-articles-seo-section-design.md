# Articles SEO Section Design

## Context

Project: party-everyday.ru, commercial landing/site for food stations, food trucks and event catering services.

Goal: add a small SEO articles section that helps Yandex discover additional commercial/informational entry points without turning the homepage into a blog and without redesigning the existing site.

Primary business intent:
- Capture Yandex informational and mixed commercial queries.
- Strengthen perceived expertise and commercial trust factors.
- Internally link articles to existing service pages and lead form.
- Keep services as the main commercial pages.

Non-goals:
- Do not build a CMS.
- Do not add a large blog system.
- Do not create many thin articles.
- Do not rename existing services for SEO.
- Do not add new image assets in the first implementation.
- Do not redesign the homepage.

## Confirmed Product Decisions

Navigation:
- Add one header navigation item: `Статьи`.
- Target URL: `/articles/`.
- Do not add a footer link at this stage.

Homepage:
- Add one compact link strip after `ServicesSection`.
- The strip links to `/articles/`.
- It must not show article cards.
- It must not become a full homepage section.
- It should feel like a contextual helper after the user has seen services.

Recommended copy:

```text
Не уверены, какой формат выбрать?
Посмотрите статьи по фуд-станциям и выездному кейтерингу.
Читать статьи →
```

Articles index:
- URL: `/articles/`.
- Visual label and H1: `Статьи`.
- The page lists the initial 3 articles.
- No dates unless actual editorial update workflow exists.
- No pagination for the initial version.

## Initial Articles

### 1. Food Station Choice Guide

URL:

```text
/articles/kak-vybrat-food-station/
```

H1:

```text
Как выбрать фуд-станцию для мероприятия
```

SEO intent:
- фуд-станции на мероприятие
- фуд-станция на праздник
- выездной кейтеринг
- фуд-зона на мероприятие
- кейтеринг Москва и область

Role:
- Broad entry article.
- Links to many core service pages.
- Explains formats, use cases, logistics and pricing factors.

### 2. Kids Sweet Stations

URL:

```text
/articles/sladkie-stancii-na-detskiy-prazdnik/
```

H1:

```text
Сладкие станции на детский праздник
```

SEO intent:
- сладкие станции на детский праздник
- сладкий стол на детский праздник
- сахарная вата на праздник
- попкорн на детский праздник
- шоколадный фонтан на детский праздник

Role:
- Capture children's party intent.
- Support sweet station services without changing their service page names.
- Link to cotton candy, popcorn, chocolate fountain, ice cream and lemonade where relevant.

### 3. Food Truck Rental

URL:

```text
/articles/arenda-fudtraka-na-meropriyatie/
```

H1:

```text
Аренда фудтрака на мероприятие
```

SEO intent:
- аренда фудтрака
- фудтрак на мероприятие
- фудтрак на корпоратив
- фудтрак на фестиваль
- фудтрак Москва и область

Role:
- Commercially strong article for the food truck direction.
- Similar intent family to the supplied reference, but written for this site's service model and style.

## SEO Strategy

The articles should be long enough for Yandex, but not written as keyword spam.

Target size:
- Approximately 5,000-8,000 Russian characters per article.
- 6-8 meaningful H2 sections per article.
- Lists and short paragraphs for readability.
- FAQ block with 3-5 questions.

Use Moscow and Moscow region in:
- `title`
- `description`
- lead/introduction where natural
- body sections where logistics/service area is discussed

Do not force Moscow into every H1. Example:

```text
Title: Аренда фудтрака на мероприятие в Москве и области | Праздник каждый день
H1: Аренда фудтрака на мероприятие
```

This is more natural and reduces visible over-optimization.

Each article should include:
- Human-readable H1.
- Search-oriented title and meta description.
- Canonical URL with trailing slash.
- Article structured data.
- Breadcrumb structured data.
- FAQ structured data only when the FAQ is present and visible.
- Internal links to relevant service pages.
- CTA to submit a lead.

## Article Page Structure

Required order:

1. Breadcrumbs:

```text
Главная → Статьи → Название статьи
```

2. H1.
3. Lead paragraph.
4. Hero area:
- One centralized article image.
- One service icon/visual marker.

5. Main article content:
- H2 sections.
- Paragraphs.
- Lists.
- Contextual service links.

6. Related services block:
- Links to real service pages.
- No fake SEO-only pages.

7. FAQ block:
- 3-5 practical questions.
- Questions should cover long-tail search and real user objections.

8. CTA block:
- Uses existing lead/order flow.
- Does not create a new form implementation.

9. Related articles block:
- Links to the other 2 articles in the initial set.

## Visual Direction

Use existing project style:
- Light pastel background.
- Rounded cards.
- Soft borders and shadows.
- Existing typography scale and large bold headings.
- No unrelated redesign.
- No dark blog theme.
- No generic article template that looks detached from the site.

The `ui-ux-pro-max` guidance is used only for layout discipline:
- readable line length;
- accessible contrast;
- stable image dimensions to avoid CLS;
- mobile-friendly spacing;
- clear CTA hierarchy.

The supplied reference is used for content structure, not copied visually.

## Image And Icon Model

Images and icons must be data-driven from the content layer, not hardcoded inside JSX components.

Create a centralized article visual registry:

```ts
export const articleImages = {
  foodStationGuide: {
    src: '/images/services-home/cotton-candy-popcorn.webp',
    fallbackSrc: '/images/services-home-fallback/cotton-candy-popcorn.png',
    alt: 'Фуд-станции для мероприятия',
    width: 1024,
    height: 1024,
    objectPosition: 'center',
  },
  kidsSweetStations: {
    src: '/images/services-home/cotton-candy.webp',
    fallbackSrc: '/images/services-home-fallback/cotton-candy.png',
    alt: 'Сладкая станция на детский праздник',
    width: 1024,
    height: 1024,
    objectPosition: 'center',
  },
  foodTruckRental: {
    src: '/images/food-trucks/food-truck-1.webp',
    fallbackSrc: '/images/food-trucks/food-truck-1.jpg',
    alt: 'Фудтрак на мероприятии',
    width: 1200,
    height: 800,
    objectPosition: 'center',
  },
};
```

Article records reference this registry:

```ts
heroImage: articleImages.foodTruckRental
```

Benefits:
- Future image replacement happens in one content file.
- JSX stays generic.
- Alt text, dimensions and object position stay controlled.
- Later `/images/articles/` can be introduced without rewriting templates.

Service icons should also be controlled by data:

```ts
serviceIcon: 'foodTruck'
```

The template maps icon IDs to visuals. Do not scatter inline icon logic across article content.

## Content Model

Add article content to a TypeScript content file, not MDX and not a CMS.

Suggested file:

```text
web/src/content/articles.ts
```

Suggested high-level shape:

```ts
export type ArticleEntity = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  canonicalPath: string;
  heroImage: ArticleImage;
  serviceIcon: ArticleIconId;
  lead: string;
  sections: ArticleSection[];
  relatedServiceSlugs: string[];
  faq: ArticleFaqItem[];
  relatedArticleSlugs: string[];
};
```

Sections should support:
- paragraph blocks;
- unordered lists;
- ordered lists;
- service link groups where needed.

Keep the content expressive but structured enough for reusable rendering and tests.

## Routing And Static Generation

Public URLs keep trailing slashes in canonical links and prerender output.
React Router route definitions should follow the existing project pattern and omit the trailing slash:

```tsx
<Route path="/articles" element={<ArticlesPage />} />
<Route path="/articles/:slug" element={<ArticlePage />} />
```

Canonical URLs and generated static paths remain:

```text
/articles/
/articles/<slug>/
```

The app currently uses static prerendering. Article URLs must be included in prerender output so sitemap generation can pick them up from `dist`.

Expected change:
- Add article dynamic URLs to the prerender URL source.
- Keep trailing slash behavior consistent with existing canonical URL policy.

The sitemap script likely does not need direct changes if prerender emits:

```text
dist/articles/index.html
dist/articles/<slug>/index.html
```

## Internal Linking

Homepage:
- Header link to `/articles/`.
- Compact strip after `ServicesSection`.

Article index:
- Links to all 3 articles.

Article pages:
- Link to relevant service pages.
- Link to the other articles.
- Include CTA to the existing lead flow.

Service pages:
- Optional later improvement: add a small "useful article" link on relevant services.
- Do not include this in the first implementation unless needed for internal link strength.

## Accessibility And Performance Requirements

Accessibility:
- One H1 per article page.
- Sequential heading hierarchy.
- Real `alt` text for images.
- Links must have clear text.
- CTA must be keyboard-accessible.
- Do not rely on hover-only states.

Performance:
- Use image dimensions or aspect ratio to prevent layout shift.
- Use existing WebP assets.
- Lazy-load below-the-fold related/secondary images if any.
- Do not preload article images globally.
- Do not add third-party scripts.

## Testing Requirements

Add or update tests for:
- `/articles/` renders article index.
- `/articles/:slug` renders the matching article.
- Unknown article slug renders 404 behavior.
- Header includes `Статьи`.
- Homepage contains the compact article strip after services.
- Article page renders:
  - H1;
  - lead;
  - hero image;
  - related services;
  - FAQ;
  - CTA.
- SEO component gets canonical and description.
- Structured data includes `Article` and `BreadcrumbList`.
- FAQ structured data exists only when FAQ items exist.
- Prerender includes article routes.

Verification before completion:
- Run web tests.
- Run web build.
- Check generated sitemap contains article URLs after build.

## Risks And Mitigations

Risk: Articles become thin SEO pages.
Mitigation: keep each article 5,000-8,000 characters with concrete event scenarios, logistics, pricing factors and user questions.

Risk: Articles cannibalize service pages.
Mitigation: keep article H1 informational/mixed-intent and link into service pages. Do not duplicate exact service page titles.

Risk: Homepage becomes blog-like.
Mitigation: only one compact strip after services, no article cards on homepage.

Risk: Future image replacement is painful.
Mitigation: centralize article images and icon IDs in content layer.

Risk: Encoding issues in Russian content.
Mitigation: preserve UTF-8 and avoid bulk rewriting existing mojibake files unless separately planned.

Risk: SEO copy becomes visibly spammy.
Mitigation: use location and keywords in title/description and natural text, not in every heading.

## Implementation Boundary

This spec authorizes planning and implementation for:
- Article routes.
- Article content data.
- Article index page.
- Article detail page.
- Header navigation item.
- Compact homepage strip after services.
- SEO structured data and prerender integration.
- Tests.

This spec does not authorize:
- Redesigning existing sections.
- Renaming services.
- Adding a CMS.
- Adding new libraries.
- Adding new image files.
- Adding footer article link in the first version.
