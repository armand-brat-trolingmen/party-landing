# Footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a compact dark-chocolate footer with legal/trust information, social links, and three real legal-document routes without breaking the current landing layout or mobile experience.

**Architecture:** Keep the existing Contacts section as the main CTA and append a minimal footer as the final site layer. Implement the footer as a dedicated layout component fed from centralized content data, and add three lightweight legal pages with shared presentation and page-level SEO.

**Tech Stack:** React 19, TypeScript, Vite, react-router, react-helmet-async, existing SSG/prerender flow, CSS Modules, Vitest, Playwright.

---

## File Map

**Create**
- `src/components/layout/SiteFooter.tsx` — compact footer markup, external social links, internal legal links
- `src/components/layout/SiteFooter.module.css` — dark chocolate footer styling, desktop/mobile layout, subtle hover states
- `src/components/legal/LegalPageLayout.tsx` — shared shell for legal routes with heading, intro and content body
- `src/components/legal/LegalPageLayout.module.css` — restrained layout and typography for legal pages
- `src/pages/privacy.tsx` — privacy policy placeholder page with SEO
- `src/pages/terms.tsx` — user agreement placeholder page with SEO
- `src/pages/consent.tsx` — consent to personal-data processing placeholder page with SEO
- `src/components/layout/SiteFooter.test.tsx` — footer structure, contact values, internal/external links

**Modify**
- `src/App.tsx` — render the new footer after the current Contacts section
- `src/AppRoutes.tsx` — add explicit routes for `/privacy`, `/terms`, `/consent`
- `src/data/siteContent.ts` — add centralized footer content, legal links, legal page copy, and placeholder contact values
- `src/config/seo.ts` — add helpers/constants for legal page titles/descriptions if needed
- `src/pages/index.tsx` — keep homepage SEO distinct from legal pages
- `src/App.test.tsx` — assert footer presence in the main landing shell
- `src/seoMeta.test.ts` — confirm legal routes still work with page SEO conventions if implementation adds reusable helpers

**Verify / build output**
- `generate-sitemap.js` — no code change expected, but verify that explicit routes are picked up after `AppRoutes.tsx` changes
- `dist/` — confirm footer appears in prerendered homepage HTML and legal route HTML is generated

---

### Task 1: Add footer content to centralized data

**Files:**
- Modify: `src/data/siteContent.ts`
- Test: `src/components/layout/SiteFooter.test.tsx`

- [ ] **Step 1: Write the failing test**

Add assertions for:
- brand name `Party Everyday`
- phone `+7 (999) 999-99-99`
- email `contact@party-everyday.ru`
- legal text entries for ИП / ИНН / ОГРНИП / address
- internal links `/privacy`, `/terms`, `/consent`
- external links for Telegram / WhatsApp / Avito

- [ ] **Step 2: Run test to verify it fails**

Run:
```powershell
$npm='C:\Users\606ru\OneDrive\Desktop\але\rba-storefront\.tools\node-v24.14.0-win-x64\npm.cmd'; & $npm test -- src/components/layout/SiteFooter.test.tsx
```

Expected:
- FAIL because `SiteFooter.test.tsx` and footer content do not exist yet

- [ ] **Step 3: Add centralized footer data**

Update `src/data/siteContent.ts` with:
- `footerContent.brand`
- `footerContent.phone`
- `footerContent.email`
- `footerContent.businessName`
- `footerContent.inn`
- `footerContent.ogrnip`
- `footerContent.legalAddress`
- `footerContent.socialLinks`
- `footerContent.legalLinks`
- `legalPages` content object for `privacy`, `terms`, `consent`

Keep social links aligned with existing channels already present on the site:
- Telegram
- WhatsApp
- Avito

- [ ] **Step 4: Run test to verify content is consumable**

Run the same test command again after component creation in Task 2.
Expected:
- PASS once footer component exists and reads data correctly

- [ ] **Step 5: Commit**

```bash
git add src/data/siteContent.ts src/components/layout/SiteFooter.test.tsx src/components/layout/SiteFooter.tsx src/components/layout/SiteFooter.module.css
git commit -m "feat: add footer content model"
```

---

### Task 2: Build the compact footer component

**Files:**
- Create: `src/components/layout/SiteFooter.tsx`
- Create: `src/components/layout/SiteFooter.module.css`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Test: `src/components/layout/SiteFooter.test.tsx`

- [ ] **Step 1: Write the failing shell test**

In `src/App.test.tsx`, add assertions that:
- footer renders after the contacts section
- footer contains logo/brand
- footer contains legal links
- footer contains business identity lines

- [ ] **Step 2: Run test to verify it fails**

Run:
```powershell
$npm='C:\Users\606ru\OneDrive\Desktop\але\rba-storefront\.tools\node-v24.14.0-win-x64\npm.cmd'; & $npm test -- src/App.test.tsx src/components/layout/SiteFooter.test.tsx
```

Expected:
- FAIL because footer is not rendered in `App.tsx`

- [ ] **Step 3: Implement the footer markup**

Build `SiteFooter.tsx` with:
- semantic `<footer>`
- compact top row:
  - logo
  - brand
  - Telegram / WhatsApp / Avito icons+links
  - phone
  - email
- compact lower row:
  - ИП
  - ИНН
  - ОГРНИП
  - full legal address
- text links for:
  - `/privacy`
  - `/terms`
  - `/consent`

Use internal route links for legal pages and normal anchors for external social links.

- [ ] **Step 4: Style it without disturbing the existing contact block**

In `SiteFooter.module.css`:
- deep chocolate background
- warm light text
- subtle top divider / seam
- restrained hover states
- desktop two-row composition
- mobile single-column stacking
- no oversized title
- no duplicate section navigation

- [ ] **Step 5: Wire the footer into the landing**

Update `src/App.tsx` so the order becomes:
- Hero
- About
- Services
- Reviews
- FAQ
- Contacts
- Footer

Do not remove or weaken the existing contacts section.

- [ ] **Step 6: Run tests**

Run:
```powershell
$npm='C:\Users\606ru\OneDrive\Desktop\але\rba-storefront\.tools\node-v24.14.0-win-x64\npm.cmd'; & $npm test -- src/App.test.tsx src/components/layout/SiteFooter.test.tsx
```

Expected:
- PASS

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/App.test.tsx src/components/layout/SiteFooter.tsx src/components/layout/SiteFooter.module.css src/components/layout/SiteFooter.test.tsx
git commit -m "feat: add compact legal footer"
```

---

### Task 3: Add real legal pages and routes

**Files:**
- Create: `src/components/legal/LegalPageLayout.tsx`
- Create: `src/components/legal/LegalPageLayout.module.css`
- Create: `src/pages/privacy.tsx`
- Create: `src/pages/terms.tsx`
- Create: `src/pages/consent.tsx`
- Modify: `src/AppRoutes.tsx`
- Modify: `src/config/seo.ts`

- [ ] **Step 1: Write the failing route test**

Add or update tests so they assert:
- `/privacy` renders a dedicated page
- `/terms` renders a dedicated page
- `/consent` renders a dedicated page
- each page has its own heading and SEO metadata source

- [ ] **Step 2: Run test to verify it fails**

Run:
```powershell
$npm='C:\Users\606ru\OneDrive\Desktop\але\rba-storefront\.tools\node-v24.14.0-win-x64\npm.cmd'; & $npm test -- src/App.test.tsx
```

Expected:
- FAIL because `AppRoutes.tsx` currently only serves `/`

- [ ] **Step 3: Create shared legal page shell**

Implement `LegalPageLayout.tsx` with:
- restrained page shell
- page title
- intro paragraph
- content container
- link back to homepage or main site

Keep it light so it feels like part of the same brand system, not a generic document page.

- [ ] **Step 4: Create the three legal pages**

Add:
- `src/pages/privacy.tsx`
- `src/pages/terms.tsx`
- `src/pages/consent.tsx`

Each page should:
- use the shared legal page layout
- include `SEO`
- render meaningful placeholder structure for future legal copy

Use distinct titles and descriptions for each page.

- [ ] **Step 5: Wire routes**

Update `src/AppRoutes.tsx` to explicitly serve:
- `/`
- `/privacy`
- `/terms`
- `/consent`

Keep wildcard fallback behavior intentional.

- [ ] **Step 6: Run tests**

Run:
```powershell
$npm='C:\Users\606ru\OneDrive\Desktop\але\rba-storefront\.tools\node-v24.14.0-win-x64\npm.cmd'; & $npm test -- src/App.test.tsx src/seoMeta.test.ts
```

Expected:
- PASS

- [ ] **Step 7: Commit**

```bash
git add src/AppRoutes.tsx src/config/seo.ts src/components/legal/LegalPageLayout.tsx src/components/legal/LegalPageLayout.module.css src/pages/privacy.tsx src/pages/terms.tsx src/pages/consent.tsx
git commit -m "feat: add legal document routes"
```

---

### Task 4: Verify prerender, sitemap, and route output

**Files:**
- Verify: `prerender.js`
- Verify: `generate-sitemap.js`
- Verify output: `dist/index.html`, `dist/privacy/index.html`, `dist/terms/index.html`, `dist/consent/index.html`, `dist/sitemap.xml`

- [ ] **Step 1: Run build**

Run:
```powershell
$npm='C:\Users\606ru\OneDrive\Desktop\але\rba-storefront\.tools\node-v24.14.0-win-x64\npm.cmd'; & $npm run build
```

Expected:
- PASS
- prerender generates homepage and legal route HTML
- sitemap includes new legal URLs if route detection sees them

- [ ] **Step 2: Verify prerendered HTML**

Check that:
- `dist/index.html` contains footer content in the HTML source
- `dist/privacy/index.html` exists
- `dist/terms/index.html` exists
- `dist/consent/index.html` exists

Run:
```powershell
Get-Content dist\\index.html -Raw
Get-Content dist\\privacy\\index.html -Raw
Get-Content dist\\terms\\index.html -Raw
Get-Content dist\\consent\\index.html -Raw
Get-Content dist\\sitemap.xml -Raw
```

Expected:
- footer markup present in homepage HTML
- legal pages are pre-rendered
- sitemap includes canonical legal page URLs

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "chore: verify footer and legal routes in build output"
```

---

### Task 5: Run UI verification on desktop and mobile

**Files:**
- Verify rendered UI only

- [ ] **Step 1: Start preview**

Run:
```powershell
$npm='C:\Users\606ru\OneDrive\Desktop\але\rba-storefront\.tools\node-v24.14.0-win-x64\npm.cmd'; Start-Process -WindowStyle Hidden -FilePath $npm -ArgumentList 'run preview -- --host 127.0.0.1 --port 4175' -WorkingDirectory 'C:\Users\606ru\OneDrive\Desktop\але\site\.worktrees\party-landing\web'
```

- [ ] **Step 2: Verify desktop**

Check visually:
- footer fits the landing rhythm
- no oversized empty space
- legal links look like text links
- footer does not visually fight the contacts section

- [ ] **Step 3: Verify mobile**

Check visually:
- footer collapses to a clean vertical stack
- touch targets remain usable
- legal links remain visible
- no horizontal overflow

- [ ] **Step 4: Run focused e2e if needed**

Run:
```powershell
$npm='C:\Users\606ru\OneDrive\Desktop\але\rba-storefront\.tools\node-v24.14.0-win-x64\npm.cmd'; & $npm run test:e2e -- --workers=1
```

Expected:
- PASS

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "test: verify footer on desktop and mobile"
```

---

## Notes For Execution

- Keep the current Contacts section untouched as the main CTA.
- Footer links for legal pages must be real routes, not in-page anchors.
- Do not introduce a second navigation list from the header.
- Do not turn legal links into buttons or pills.
- Keep all text/data centralized in `siteContent.ts`.
- Use the existing dessert palette; avoid introducing a cold black footer.
- Be careful: the worktree currently has unrelated in-progress SEO/performance edits. Confirm scope before implementing so the footer work does not accidentally absorb them.
