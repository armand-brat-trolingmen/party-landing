# Articles SEO Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a small `/articles/` SEO section with 3 dense Yandex-oriented articles, a header link, a compact homepage link strip after services, article SEO metadata, structured data, prerender output and tests.

**Architecture:** Article content lives in the content layer as typed data. UI components render generic article/index templates from that data, so images, icons, links and copy can be changed centrally. Existing service pages remain the primary commercial pages; articles support them through internal links and CTA.

**Tech Stack:** React 19, React Router, Vite, TypeScript, CSS Modules, Vitest, React Testing Library, existing static prerender + sitemap generation.

---

## Source Spec

Use this spec as the source of truth:

```text
docs/superpowers/specs/2026-04-19-articles-seo-section-design.md
```

Implementation must preserve the confirmed scope:

- Header item is `Статьи`.
- Public articles index URL is `/articles/`.
- React Router route should be `/articles` without trailing slash, matching current project route style.
- Add one compact homepage strip after `ServicesSection`.
- Do not add footer article link in this package.
- Do not add new image files in this package.
- Do not rename existing services.
- Do not add libraries.
- Do not build CMS/MDX.
- Images and icons must be controlled from content data, not hardcoded in JSX.

## Current Codebase Notes

Relevant existing files:

- `web/src/AppRoutes.tsx` defines page routes.
- `web/src/App.tsx` renders homepage sections in order.
- `web/src/content/navigation.ts` feeds `SiteHeader`.
- `web/src/components/layout/SiteHeader.tsx` currently treats all navigation items as same-page section anchors.
- `web/src/config/seo.ts` already has URL helpers and schema helpers for home/offering pages.
- `web/prerender.js` discovers static pages and imports `getAllOfferingUrls()` from `web/src/content/index.ts` for dynamic offering routes.
- `web/generate-sitemap.js` reads generated `dist/**/*.html`, so article URLs should enter sitemap automatically if prerender emits article HTML files.

Important implementation risk:

- Header navigation cannot just add `{ id: 'articles', label: 'Статьи' }`, because current header will turn it into `#articles` on the homepage. The nav item type must support direct links.

Encoding note:

- Existing project files may display mojibake in PowerShell, but files are UTF-8. Do not bulk-rewrite existing files to "fix" terminal display. Only edit intended files and preserve UTF-8.

## Planned File Structure

Create:

- `web/src/content/articles.ts` — article data, image registry, icon IDs, helpers, article URLs.
- `web/src/content/articles.test.ts` — slugs, URLs, image indirection, related services, content density.
- `web/src/pages/articles.tsx` — `/articles` page entry.
- `web/src/pages/articles.test.tsx` — article index rendering and SEO tests.
- `web/src/pages/article.tsx` — `/articles/:slug` page entry.
- `web/src/pages/article.test.tsx` — article detail, unknown slug, structured data and key blocks.
- `web/src/components/pages/ArticlesIndexTemplate.tsx`
- `web/src/components/pages/ArticlesIndexTemplate.module.css`
- `web/src/components/pages/ArticlePageTemplate.tsx`
- `web/src/components/pages/ArticlePageTemplate.module.css`
- `web/src/components/sections/ArticlesTeaserSection.tsx`
- `web/src/components/sections/ArticlesTeaserSection.module.css`
- `web/src/components/sections/ArticlesTeaserSection.test.tsx`

Modify:

- `web/src/content/index.ts` — export article data/helpers.
- `web/src/content/types.ts` — extend `NavigationItem` to support direct `href`.
- `web/src/content/navigation.ts` — add `Статьи` as direct link.
- `web/src/components/layout/SiteHeader.tsx` — support direct nav item behavior.
- `web/src/components/layout/SiteHeader.test.tsx` — cover direct link on desktop/mobile/internal pages.
- `web/src/App.tsx` — insert teaser after `ServicesSection`.
- `web/src/AppRoutes.tsx` — add article routes.
- `web/src/AppRoutes.test.tsx` — route coverage.
- `web/src/config/seo.ts` — article structured data helper.
- `web/src/config/seo.test.ts` — article schema coverage.
- `web/prerender.js` — include dynamic article URLs.

Do not modify:

- Backend/server files.
- Existing service names.
- Existing lead submit flow.
- Existing image asset files.
- Footer unless explicitly requested later.

---

## Task 1: Article Content Layer

**Files:**

- Create: `web/src/content/articles.ts`
- Create: `web/src/content/articles.test.ts`
- Modify: `web/src/content/index.ts`

### Steps

- [ ] **Step 1: Write failing content tests**

Create `web/src/content/articles.test.ts`.

Required assertions:

- `articles.map(article => article.slug)` equals:
  - `kak-vybrat-food-station`
  - `sladkie-stancii-na-detskiy-prazdnik`
  - `arenda-fudtraka-na-meropriyatie`
- `getAllArticleUrls()` returns sorted dynamic URLs without trailing slash:
  - `/articles/arenda-fudtraka-na-meropriyatie`
  - `/articles/kak-vybrat-food-station`
  - `/articles/sladkie-stancii-na-detskiy-prazdnik`
- `getArticlePath(articles[0])` returns `/articles/kak-vybrat-food-station`.
- `findArticleBySlug('arenda-fudtraka-na-meropriyatie')?.h1` returns `Аренда фудтрака на мероприятие`.
- `articleImages.foodStationGuide.src` is `/images/services-home/cotton-candy-popcorn.webp`.
- `articleImages.kidsSweetStations.src` is `/images/services-home/cotton-candy.webp`.
- `articleImages.foodTruckRental.src` is `/images/food-trucks/food-truck-1.webp`.
- Every article has:
  - title containing `Праздник каждый день`;
  - description length <= 170;
  - at least 6 sections;
  - at least 3 FAQ items;
  - `getArticleTextContent(article).length >= 4500`;
  - only existing `relatedServiceSlugs`.

- [ ] **Step 2: Run failing content tests**

Run:

```bash
npm --prefix web run test -- src/content/articles.test.ts
```

Expected:

- FAIL because `web/src/content/articles.ts` does not exist.

- [ ] **Step 3: Implement `web/src/content/articles.ts`**

Implement:

- `ArticleEntity`
- `ArticleImage`
- `ArticleIconId`
- `ArticleSection`
- `ArticleFaqItem`
- `articleImages`
- `articles`
- `getArticlePath(article)`
- `getAllArticleUrls()`
- `findArticleBySlug(slug)`
- `getArticleTextContent(article)`

Content rules:

- Write 3 real Russian SEO articles, not placeholders.
- Each article should be approximately 5,000-8,000 Russian characters.
- Keep H1s exactly:
  - `Как выбрать фуд-станцию для мероприятия`
  - `Сладкие станции на детский праздник`
  - `Аренда фудтрака на мероприятие`
- Use Moscow/Moscow region naturally in `title`, `description`, lead and logistics sections.
- Do not force `Москва` into every H1.
- Include 6-8 sections per article.
- Include 3-5 FAQ items per article.
- Store hero images via `articleImages`.
- Store `serviceIcon` as an ID: `foodStation`, `sweetStation`, or `foodTruck`.

Recommended service links:

- Food station guide: `cotton-candy`, `popcorn`, `chocolate-fountain`, `craft-lemonade`, `belgian-waffles`, `pancakes`.
- Kids sweet stations: `cotton-candy`, `popcorn`, `chocolate-fountain`, `roll-ice-cream`, `scoop-ice-cream`, `craft-lemonade`.
- Food truck rental: `french-hot-dog`, `danish-hot-dog`, `burgers`, `craft-lemonade`.

Before finalizing, verify all slugs exist in `web/src/content/offerings.ts`.

- [ ] **Step 4: Export article helpers**

Modify `web/src/content/index.ts` to export article data/helpers and types.

Required exports:

- `articleImages`
- `articles`
- `findArticleBySlug`
- `getAllArticleUrls`
- `getArticlePath`
- `getArticleTextContent`
- article types

- [ ] **Step 5: Run content tests**

Run:

```bash
npm --prefix web run test -- src/content/articles.test.ts
```

Expected:

- PASS.

- [ ] **Step 6: Commit Task 1**

Run:

```bash
git add web/src/content/articles.ts web/src/content/articles.test.ts web/src/content/index.ts
git commit -m "Add SEO article content model"
```

---

## Task 2: Article Structured Data

**Files:**

- Modify: `web/src/config/seo.ts`
- Modify: `web/src/config/seo.test.ts`

### Steps

- [ ] **Step 1: Write failing schema tests**

Add a test to `web/src/config/seo.test.ts` for `getArticleStructuredData(article)`.

Required assertions:

- graph includes `LocalBusiness`;
- graph includes `BreadcrumbList`;
- graph includes `Article` with `headline: article.h1`;
- graph includes `FAQPage` when `article.faq.length > 0`;
- breadcrumb position 2 is:
  - name: `Статьи`
  - item: `https://party-everyday.ru/articles/`;
- breadcrumb position 3 points to slash-final article URL.

- [ ] **Step 2: Run failing SEO tests**

Run:

```bash
npm --prefix web run test -- src/config/seo.test.ts
```

Expected:

- FAIL because `getArticleStructuredData` does not exist.

- [ ] **Step 3: Implement `getArticleStructuredData(article)`**

In `web/src/config/seo.ts`:

- Import `ArticleEntity`.
- Reuse `getOrganizationStructuredData(homeUrl)`.
- Reuse `getLocalBusinessStructuredData(homeUrl)`.
- Use `toAbsolutePageUrl('/articles')` for article index URL.
- Use `toAbsolutePageUrl(`/articles/${article.slug}`)` for article page URL.

Return an array containing:

- Organization
- LocalBusiness
- BreadcrumbList
- Article
- FAQPage only when FAQ exists

Article schema minimum fields:

- `@type: 'Article'`
- `@id: ${pageUrl}#article`
- `headline`
- `description`
- `image`
- `mainEntityOfPage`
- `inLanguage: 'ru-RU'`
- `author`
- `publisher`

- [ ] **Step 4: Run SEO tests**

Run:

```bash
npm --prefix web run test -- src/config/seo.test.ts
```

Expected:

- PASS.

- [ ] **Step 5: Commit Task 2**

Run:

```bash
git add web/src/config/seo.ts web/src/config/seo.test.ts
git commit -m "Add article structured data"
```

---

## Task 3: Article Index Page

**Files:**

- Create: `web/src/components/pages/ArticlesIndexTemplate.tsx`
- Create: `web/src/components/pages/ArticlesIndexTemplate.module.css`
- Create: `web/src/pages/articles.tsx`
- Create: `web/src/pages/articles.test.tsx`
- Modify: `web/src/AppRoutes.tsx`
- Modify: `web/src/AppRoutes.test.tsx`

### Steps

- [ ] **Step 1: Write failing page tests**

Create `web/src/pages/articles.test.tsx`.

Required assertions:

- H1 is `Статьи`.
- All 3 article links exist.
- Links point to slash-final public URLs:
  - `/articles/kak-vybrat-food-station/`
  - `/articles/sladkie-stancii-na-detskiy-prazdnik/`
  - `/articles/arenda-fudtraka-na-meropriyatie/`
- `document.title` contains `Статьи`.
- canonical is `https://party-everyday.ru/articles/`.

Update `web/src/AppRoutes.test.tsx`:

- `/articles` renders H1 `Статьи`.

- [ ] **Step 2: Run failing route/page tests**

Run:

```bash
npm --prefix web run test -- src/pages/articles.test.tsx src/AppRoutes.test.tsx
```

Expected:

- FAIL because `ArticlesPage` and `/articles` route do not exist.

- [ ] **Step 3: Implement index template and page**

Create `ArticlesIndexTemplate.tsx`.

Requirements:

- Accept `articles: readonly ArticleEntity[]`.
- Render H1 `Статьи`.
- Render short intro text about food stations and catering articles.
- Render 3 article cards.
- Each card renders:
  - image from `article.heroImage`;
  - title;
  - description;
  - link text `Читать статью`.
- Use `getArticlePath(article) + '/'` for public links.
- Use semantic headings; article card titles should be H2 or H3 depending on page structure.

Create `web/src/pages/articles.tsx`.

Requirements:

- Render `<SEO />`:
  - title: `Статьи о фуд-станциях и кейтеринге | Праздник каждый день`;
  - description <= 165 characters;
  - canonical: `/articles`;
- Render `SiteShell`.
- Render `ArticlesIndexTemplate articles={articles}`.

Modify `AppRoutes.tsx`:

- Import `ArticlesPage`.
- Add `<Route path="/articles" element={<ArticlesPage />} />`.

- [ ] **Step 4: Run route/page tests**

Run:

```bash
npm --prefix web run test -- src/pages/articles.test.tsx src/AppRoutes.test.tsx
```

Expected:

- PASS.

- [ ] **Step 5: Commit Task 3**

Run:

```bash
git add web/src/components/pages/ArticlesIndexTemplate.tsx web/src/components/pages/ArticlesIndexTemplate.module.css web/src/pages/articles.tsx web/src/pages/articles.test.tsx web/src/AppRoutes.tsx web/src/AppRoutes.test.tsx
git commit -m "Add articles index page"
```

---

## Task 4: Article Detail Page

**Files:**

- Create: `web/src/components/pages/ArticlePageTemplate.tsx`
- Create: `web/src/components/pages/ArticlePageTemplate.module.css`
- Create: `web/src/pages/article.tsx`
- Create: `web/src/pages/article.test.tsx`
- Modify: `web/src/AppRoutes.tsx`
- Modify: `web/src/AppRoutes.test.tsx`

### Steps

- [ ] **Step 1: Write failing detail page tests**

Create `web/src/pages/article.test.tsx`.

Required assertions for `/articles/arenda-fudtraka-na-meropriyatie`:

- H1 is `Аренда фудтрака на мероприятие`.
- `article-hero-image` exists and uses `/images/food-trucks/food-truck-1.webp`.
- `article-service-icon` exists with `data-article-icon="foodTruck"`.
- `article-related-services` exists.
- `article-faq` exists.
- `article-cta` exists.
- `article-related-articles` exists.
- JSON-LD contains `Article`, `BreadcrumbList`, `FAQPage`.

Unknown slug test:

- `/articles/no-such-article` renders existing 404 page.

Update `AppRoutes.test.tsx`:

- `/articles/arenda-fudtraka-na-meropriyatie` renders matching article H1.

- [ ] **Step 2: Run failing detail tests**

Run:

```bash
npm --prefix web run test -- src/pages/article.test.tsx src/AppRoutes.test.tsx
```

Expected:

- FAIL because detail page/template/route do not exist.

- [ ] **Step 3: Implement `ArticlePageTemplate`**

Requirements:

- Accept `article: ArticleEntity`.
- Render:
  - breadcrumbs: `Главная`, `Статьи`, current article;
  - one H1;
  - lead paragraph;
  - hero image using `article.heroImage`;
  - service icon based on `article.serviceIcon`;
  - all article content sections;
  - related services block;
  - FAQ block;
  - existing CTA behavior;
  - related articles block.

Icon rules:

- Map only `foodStation`, `sweetStation`, `foodTruck`.
- Do not add icon libraries.
- Prefer inline SVG or existing visual style.
- Do not use emoji as the only icon.

CTA rules:

- Use existing order modal/hook.
- Do not create a new form.
- CTA button text can be `Подобрать формат`.

Related services:

- Resolve slugs from `services`.
- Link to `/services/${slug}/`.
- If a slug is missing, do not render a broken link; content tests should prevent this anyway.

Related articles:

- Resolve slugs from `articles`.
- Link to `/articles/${slug}/`.

- [ ] **Step 4: Implement `web/src/pages/article.tsx`**

Requirements:

- Read `slug` from `useParams()`.
- Use `findArticleBySlug(slug)`.
- If missing, return `<NotFoundPage />`.
- Render:
  - `<SEO title={article.title} description={article.description} canonical={`/articles/${article.slug}`} image={article.heroImage.src} imageAlt={article.heroImage.alt} type="article" />`
  - `<StructuredData data={getArticleStructuredData(article)} />`
  - `<SiteShell><ArticlePageTemplate article={article} /></SiteShell>`

Modify `AppRoutes.tsx`:

- Import `ArticlePage`.
- Add `<Route path="/articles/:slug" element={<ArticlePage />} />`.

- [ ] **Step 5: Run detail tests**

Run:

```bash
npm --prefix web run test -- src/pages/article.test.tsx src/AppRoutes.test.tsx
```

Expected:

- PASS.

- [ ] **Step 6: Commit Task 4**

Run:

```bash
git add web/src/components/pages/ArticlePageTemplate.tsx web/src/components/pages/ArticlePageTemplate.module.css web/src/pages/article.tsx web/src/pages/article.test.tsx web/src/AppRoutes.tsx web/src/AppRoutes.test.tsx
git commit -m "Add article detail pages"
```

---

## Task 5: Header Direct Link Navigation

**Files:**

- Modify: `web/src/content/types.ts`
- Modify: `web/src/content/navigation.ts`
- Modify: `web/src/components/layout/SiteHeader.tsx`
- Modify: `web/src/components/layout/SiteHeader.test.tsx`

### Steps

- [ ] **Step 1: Write failing header tests**

Update `web/src/components/layout/SiteHeader.test.tsx`.

Required assertions:

- Desktop homepage navigation has `Статьи` with `href="/articles/"`.
- Internal page navigation has `Статьи` with `href="/articles/"`.
- Mobile opened menu has `Статьи` with `href="/articles/"`.
- Existing section links still behave as before.
- Existing `navItems.forEach` test must only expect `#id` for items without direct `href`.

- [ ] **Step 2: Run failing header tests**

Run:

```bash
npm --prefix web run test -- src/components/layout/SiteHeader.test.tsx
```

Expected:

- FAIL because `Статьи` is missing or treated as a section anchor.

- [ ] **Step 3: Extend navigation type**

Modify `web/src/content/types.ts`:

```ts
export type NavigationItem = {
  id: string;
  label: string;
  href?: string;
};
```

Modify `web/src/content/navigation.ts`:

```ts
{ id: 'articles', label: 'Статьи', href: '/articles/' },
```

Recommended placement:

- After `faq` and before `contact`.
- Do not put articles before core commercial sections.

- [ ] **Step 4: Update header behavior**

Modify `SiteHeader.tsx`.

Rules:

- If `item.href` exists:
  - render `href={item.href}`;
  - do not call scroll logic;
  - close mobile menu on click;
  - do not set `activeSectionId`;
  - do not include item in scroll section detection;
  - do not attach direct-link item to active indicator logic.
- Existing section-anchor behavior must remain unchanged.

Implementation approach:

- Add `onDirectNavClick`.
- In desktop and mobile nav maps use:
  - `href={item.href ?? resolveNavHref(item.id)}`
  - `onClick={item.href ? onDirectNavClick : onAnchorClick(item.id)}`
  - `data-active={!item.href && activeSectionId === item.id ? 'true' : 'false'}`
- In scroll loop:
  - `if (item.href || !canScrollInCurrentPage(item.id)) continue;`

- [ ] **Step 5: Run header tests**

Run:

```bash
npm --prefix web run test -- src/components/layout/SiteHeader.test.tsx
```

Expected:

- PASS.

- [ ] **Step 6: Commit Task 5**

Run:

```bash
git add web/src/content/types.ts web/src/content/navigation.ts web/src/components/layout/SiteHeader.tsx web/src/components/layout/SiteHeader.test.tsx
git commit -m "Add articles link to header navigation"
```

---

## Task 6: Compact Homepage Articles Strip

**Files:**

- Create: `web/src/components/sections/ArticlesTeaserSection.tsx`
- Create: `web/src/components/sections/ArticlesTeaserSection.module.css`
- Create: `web/src/components/sections/ArticlesTeaserSection.test.tsx`
- Modify: `web/src/App.tsx`
- Optional create: `web/src/App.test.tsx`

### Steps

- [ ] **Step 1: Write failing teaser component test**

Create `ArticlesTeaserSection.test.tsx`.

Required assertions:

- `data-testid="section-articles-teaser"` exists.
- H2 contains `Не уверены, какой формат выбрать`.
- Link text contains `Читать статьи`.
- Link points to `/articles/`.

- [ ] **Step 2: Write failing homepage order test**

Create or update `web/src/App.test.tsx`.

Required assertions:

- `section-articles-teaser` appears after `section-services`.
- `section-articles-teaser` appears before `section-extras`.

If rendering `App` requires providers, wrap with existing providers used elsewhere.

- [ ] **Step 3: Run failing teaser tests**

Run:

```bash
npm --prefix web run test -- src/components/sections/ArticlesTeaserSection.test.tsx src/App.test.tsx
```

Expected:

- FAIL because component is missing or not inserted.

- [ ] **Step 4: Implement `ArticlesTeaserSection`**

Requirements:

- Use existing `site-container` pattern.
- Visually compact strip/card.
- No article cards.
- No extra images.
- Link to `/articles/`.
- Copy:

```text
Не уверены, какой формат выбрать?
Посмотрите статьи по фуд-станциям и выездному кейтерингу.
Читать статьи →
```

CSS requirements:

- Match current rounded pastel style.
- No horizontal overflow on mobile.
- CTA target at least 44px high.
- No heavy animation.

- [ ] **Step 5: Insert after `ServicesSection`**

Modify `web/src/App.tsx`:

```tsx
<ServicesSection />
<ArticlesTeaserSection />
<ExtrasSection />
```

- [ ] **Step 6: Run teaser/homepage tests**

Run:

```bash
npm --prefix web run test -- src/components/sections/ArticlesTeaserSection.test.tsx src/App.test.tsx
```

Expected:

- PASS.

- [ ] **Step 7: Commit Task 6**

Run:

```bash
git add web/src/components/sections/ArticlesTeaserSection.tsx web/src/components/sections/ArticlesTeaserSection.module.css web/src/components/sections/ArticlesTeaserSection.test.tsx web/src/App.tsx web/src/App.test.tsx
git commit -m "Add homepage articles teaser"
```

---

## Task 7: Static Prerender And Sitemap Inclusion

**Files:**

- Modify: `web/prerender.js`
- Modify: `web/src/content/index.ts` only if article URL export is missing

### Steps

- [ ] **Step 1: Confirm article URL helper test exists**

Task 1 should already test `getAllArticleUrls()`.

If not present, add it before changing `web/prerender.js`.

- [ ] **Step 2: Update `web/prerender.js`**

Current dynamic import should become:

```js
const { getAllOfferingUrls, getAllArticleUrls } = await vite.ssrLoadModule('/src/content/index.ts');
const offeringUrls = typeof getAllOfferingUrls === 'function' ? getAllOfferingUrls() : [];
const articleUrls = typeof getAllArticleUrls === 'function' ? getAllArticleUrls() : [];
const dynamicUrls = [...offeringUrls, ...articleUrls];
```

Also update:

```js
const DYNAMIC_ENTRY_BASENAMES = new Set(['service', 'extra', 'article']);
```

Reason:

- `web/src/pages/article.tsx` is a dynamic entry page and must not generate a bogus `/article` page.

- [ ] **Step 3: Run build**

Run:

```bash
npm run build:web
```

Expected:

- PASS.
- SSG logs include `/articles` and all 3 article slugs.

- [ ] **Step 4: Verify generated files**

Run:

```powershell
Test-Path web/dist/articles/index.html
Test-Path web/dist/articles/arenda-fudtraka-na-meropriyatie/index.html
Test-Path web/dist/articles/kak-vybrat-food-station/index.html
Test-Path web/dist/articles/sladkie-stancii-na-detskiy-prazdnik/index.html
```

Expected:

- All `True`.

- [ ] **Step 5: Verify sitemap contains article URLs**

Run:

```powershell
Select-String -LiteralPath web/dist/sitemap.xml -Pattern '/articles/'
```

Expected:

- Finds `/articles/` and all 3 article URLs.

- [ ] **Step 6: Commit Task 7**

Run:

```bash
git add web/prerender.js web/src/content/index.ts
git commit -m "Prerender article pages"
```

If `web/src/content/index.ts` has no changes, commit only `web/prerender.js`.

---

## Task 8: SEO And UI Regression Pass

**Files:**

- No planned production file changes.
- Modify tests or CSS only if a concrete regression appears.

### Steps

- [ ] **Step 1: Run focused tests**

Run:

```bash
npm --prefix web run test -- src/content/articles.test.ts src/config/seo.test.ts src/pages/articles.test.tsx src/pages/article.test.tsx src/components/layout/SiteHeader.test.tsx src/components/sections/ArticlesTeaserSection.test.tsx src/AppRoutes.test.tsx
```

Expected:

- PASS.

- [ ] **Step 2: Run all web tests**

Run:

```bash
npm run test:web
```

Expected:

- PASS.

- [ ] **Step 3: Run web build**

Run:

```bash
npm run build:web
```

Expected:

- PASS.

- [ ] **Step 4: Inspect built article HTML**

Run:

```powershell
Select-String -LiteralPath web/dist/articles/arenda-fudtraka-na-meropriyatie/index.html -Pattern '<title>','canonical','application/ld+json','Аренда фудтрака'
Select-String -LiteralPath web/dist/articles/index.html -Pattern '<title>','canonical','Статьи'
```

Expected:

- Article title is present.
- Canonical points to slash-final article URL.
- Structured data script exists.
- Index title/canonical exists.

- [ ] **Step 5: Inspect homepage built HTML**

Run:

```powershell
Select-String -LiteralPath web/dist/index.html -Pattern 'Читать статьи','/articles/'
```

Expected:

- The compact homepage strip link is present.

- [ ] **Step 6: Manual browser sanity check**

Start preview:

```bash
npm --prefix web run preview
```

Open:

```text
http://localhost:4173/
http://localhost:4173/articles/
http://localhost:4173/articles/arenda-fudtraka-na-meropriyatie/
```

Check:

- Header has `Статьи`.
- Homepage strip appears after services.
- Article index loads.
- Article detail loads.
- Article image does not distort badly.
- Mobile width does not horizontally scroll.
- CTA opens existing form/current order flow.

- [ ] **Step 7: Commit regression fixes if any**

If Task 8 required changes:

```bash
git add <changed-files>
git commit -m "Fix article section regressions"
```

If no changes:

- Do not create an empty commit.

---

## Task 9: Final Verification And Delivery

**Files:**

- No planned new files.

### Steps

- [ ] **Step 1: Check git status**

Run:

```bash
git status --short
```

Expected:

- Only intended files changed/committed.
- Existing unrelated untracked files remain untouched.

- [ ] **Step 2: Run final tests**

Run:

```bash
npm run test:web
```

Expected:

- PASS.

- [ ] **Step 3: Run final build**

Run:

```bash
npm run build:web
```

Expected:

- PASS.

- [ ] **Step 4: Verify sitemap after final build**

Run:

```powershell
Select-String -LiteralPath web/dist/sitemap.xml -Pattern 'https://party-everyday.ru/articles/'
```

Expected:

- Finds index and 3 article URLs.

- [ ] **Step 5: Summarize implementation**

Final response should include:

- Changed files grouped by area.
- What was added.
- How images can be replaced later.
- How to verify locally.
- Tests/build results.
- Any unresolved risks.

---

## Implementation Risks To Watch

- Header navigation direct link must not break existing anchor scroll behavior.
- Article content length test must not encourage meaningless keyword stuffing.
- Do not add `/article` as a real generated page by accident.
- Do not add footer article link unless scope changes.
- Do not hardcode image paths in templates.
- Do not create a new form for article CTA.
- Do not preload article images globally.
- Do not update backend or anti-spam code in this package.

## Recommended Local Commit Sequence

1. `Add SEO article content model`
2. `Add article structured data`
3. `Add articles index page`
4. `Add article detail pages`
5. `Add articles link to header navigation`
6. `Add homepage articles teaser`
7. `Prerender article pages`
8. Optional regression fix commit only if needed

Do not push until explicitly requested.
