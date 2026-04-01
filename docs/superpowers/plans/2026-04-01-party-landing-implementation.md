# Party Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a one-page `Party` landing site with a sweet-editorial visual style, anchor navigation, a hero scene centered on a stylized food truck, a horizontal services showcase, and placeholder sections for reviews, FAQ, and contact.

**Architecture:** Keep planning/docs/raw source photos at the workspace root and build the actual frontend app inside `web/` so the existing folder contents do not block scaffolding. Use a React + Vite single-page app with CSS Modules, centralized content data, and a small test suite that covers structure, hero requirements, services behavior, and responsive scrolling.

**Tech Stack:** React, TypeScript, Vite, CSS Modules, Vitest, React Testing Library, Playwright

---

## File Structure

### Workspace Root

- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/.gitignore`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/docs/superpowers/assets/2026-04-01-party-landing-assets.md`
- Existing raw image references remain at:
  - `C:/Users/606ru/OneDrive/Desktop/але/site/трак1.png`
  - `C:/Users/606ru/OneDrive/Desktop/але/site/трак2.png`
  - `C:/Users/606ru/OneDrive/Desktop/але/site/вата1.png`
  - `C:/Users/606ru/OneDrive/Desktop/але/site/вата2.png`
  - `C:/Users/606ru/OneDrive/Desktop/але/site/вата3.png`
  - `C:/Users/606ru/OneDrive/Desktop/але/site/фонтан1.png`
  - `C:/Users/606ru/OneDrive/Desktop/але/site/фонтан2.png`
  - `C:/Users/606ru/OneDrive/Desktop/але/site/фонтан3.png`
  - `C:/Users/606ru/OneDrive/Desktop/але/site/праздник1.png`

### Frontend App In `web/`

- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/package.json`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/tsconfig.json`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/tsconfig.app.json`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/tsconfig.node.json`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/vite.config.ts`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/vitest.config.ts`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/playwright.config.ts`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/index.html`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/main.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/App.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/setupTests.ts`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/data/siteContent.ts`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/styles/tokens.css`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/styles/global.css`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/layout/SiteHeader.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/layout/SiteHeader.module.css`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/ui/SectionHeading.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/branding/DonutLogo.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/scene/HeroScene.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/scene/HeroScene.module.css`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/HeroSection.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/HeroSection.module.css`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ServicesSection.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ServicesSection.module.css`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/AboutSection.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/AboutSection.module.css`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/GallerySection.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/GallerySection.module.css`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ReviewsSection.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ReviewsSection.module.css`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/FaqSection.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/FaqSection.module.css`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ContactPlaceholderSection.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ContactPlaceholderSection.module.css`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/App.test.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/layout/SiteHeader.test.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/HeroSection.test.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ServicesSection.test.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ReviewsSection.test.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/e2e/landing.spec.ts`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/public/images/reference/food-truck-1.png`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/public/images/reference/food-truck-2.png`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/public/images/reference/cotton-candy-1.png`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/public/images/reference/cotton-candy-2.png`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/public/images/reference/cotton-candy-3.png`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/public/images/reference/chocolate-fountain-1.png`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/public/images/reference/chocolate-fountain-2.png`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/public/images/reference/chocolate-fountain-3.png`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/public/images/reference/animators-placeholder.svg`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/public/images/reviews/review-party-1.png`

### Responsibility Notes

- `src/data/siteContent.ts` is the single source of truth for section copy, nav labels, service names, placeholder review content, and image metadata.
- Each section component owns only its own layout and visual behavior.
- `HeroScene.tsx` owns the object-only composition on the right side of the hero.
- `ReviewsSection.tsx` is the only place where photos with people may appear.
- `tokens.css` owns palette, typography, radii, spacing, and shadow variables.
- `global.css` owns resets, base layout, section spacing, and scroll behavior.
- `landing.spec.ts` validates anchor navigation, section presence, and the mobile services strip behavior.

## Implementation Assumptions

- Use `scroll-snap` for the mobile services strip instead of a drag-library carousel.
- Keep the hero CTA-free, matching the approved spec.
- Use the existing source images as placeholders or collage inputs first; if a more illustrated treatment is needed later, replace only the service visuals and keep review photos untouched.
- Start with static content and placeholders; do not add a CMS, forms backend, or animation library unless implementation proves it is necessary.

## Task 1: Initialize Repository, Frontend App, And Asset Checklist

**Files:**
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/.gitignore`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/docs/superpowers/assets/2026-04-01-party-landing-assets.md`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/App.test.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/setupTests.ts`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/vitest.config.ts`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/public/images/reference/*`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/public/images/reference/animators-placeholder.svg`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/public/images/reviews/review-party-1.png`

- [ ] **Step 1: Initialize git at the workspace root if it is still missing**

Run:

```powershell
git init 'C:\Users\606ru\OneDrive\Desktop\але\site'
```

Expected: A new `.git` directory exists at the workspace root.

- [ ] **Step 2: Create the frontend app in a dedicated `web/` folder**

Run:

```powershell
cd 'C:\Users\606ru\OneDrive\Desktop\але\site'
npm create vite@latest web -- --template react-ts
```

Expected: `web/` exists with the baseline React + TypeScript Vite files.

- [ ] **Step 3: Install the testing stack inside `web/`**

Run:

```powershell
cd 'C:\Users\606ru\OneDrive\Desktop\але\site\web'
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @playwright/test
```

Expected: `package.json` contains the testing dependencies.

- [ ] **Step 4: Install Playwright browser binaries on the same machine that will run e2e**

Run:

```powershell
cd 'C:\Users\606ru\OneDrive\Desktop\але\site\web'
npx playwright install
```

Expected: Playwright downloads the required browser binaries without errors.

- [ ] **Step 5: Add a root `.gitignore` before the first commit**

Write `C:/Users/606ru/OneDrive/Desktop/але/site/.gitignore` with:

```gitignore
.superpowers/
web/node_modules/
web/dist/
web/playwright-report/
web/test-results/
```

- [ ] **Step 6: Configure Vitest and jest-dom once, before writing more tests**

Write `C:/Users/606ru/OneDrive/Desktop/але/site/web/vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    globals: true,
  },
});
```

Write `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/setupTests.ts`:

```ts
import '@testing-library/jest-dom';
```

- [ ] **Step 7: Add an asset checklist so later visual work is not guesswork**

Write `C:/Users/606ru/OneDrive/Desktop/але/site/docs/superpowers/assets/2026-04-01-party-landing-assets.md` with:

```md
# Party Landing Asset Checklist

- Hero: stylized food truck cutout or collage source
- Hero side cards: cotton candy source image, chocolate fountain source image
- Services: one image or treatment per service
- Services: non-photo placeholder or illustration for animators
- Reviews: real review photo set with captions and author names
- Logo: donut mark in SVG plus wordmark lockup
```

- [ ] **Step 8: Copy the existing raw images to ASCII-safe public filenames**

Run:

```powershell
New-Item -ItemType Directory -Force 'C:\Users\606ru\OneDrive\Desktop\але\site\web\public\images\reference' | Out-Null
New-Item -ItemType Directory -Force 'C:\Users\606ru\OneDrive\Desktop\але\site\web\public\images\reviews' | Out-Null
Copy-Item -LiteralPath 'C:\Users\606ru\OneDrive\Desktop\але\site\трак1.png' 'C:\Users\606ru\OneDrive\Desktop\але\site\web\public\images\reference\food-truck-1.png'
Copy-Item -LiteralPath 'C:\Users\606ru\OneDrive\Desktop\але\site\трак2.png' 'C:\Users\606ru\OneDrive\Desktop\але\site\web\public\images\reference\food-truck-2.png'
Copy-Item -LiteralPath 'C:\Users\606ru\OneDrive\Desktop\але\site\вата1.png' 'C:\Users\606ru\OneDrive\Desktop\але\site\web\public\images\reference\cotton-candy-1.png'
Copy-Item -LiteralPath 'C:\Users\606ru\OneDrive\Desktop\але\site\вата2.png' 'C:\Users\606ru\OneDrive\Desktop\але\site\web\public\images\reference\cotton-candy-2.png'
Copy-Item -LiteralPath 'C:\Users\606ru\OneDrive\Desktop\але\site\вата3.png' 'C:\Users\606ru\OneDrive\Desktop\але\site\web\public\images\reference\cotton-candy-3.png'
Copy-Item -LiteralPath 'C:\Users\606ru\OneDrive\Desktop\але\site\фонтан1.png' 'C:\Users\606ru\OneDrive\Desktop\але\site\web\public\images\reference\chocolate-fountain-1.png'
Copy-Item -LiteralPath 'C:\Users\606ru\OneDrive\Desktop\але\site\фонтан2.png' 'C:\Users\606ru\OneDrive\Desktop\але\site\web\public\images\reference\chocolate-fountain-2.png'
Copy-Item -LiteralPath 'C:\Users\606ru\OneDrive\Desktop\але\site\фонтан3.png' 'C:\Users\606ru\OneDrive\Desktop\але\site\web\public\images\reference\chocolate-fountain-3.png'
Copy-Item -LiteralPath 'C:\Users\606ru\OneDrive\Desktop\але\site\праздник1.png' 'C:\Users\606ru\OneDrive\Desktop\але\site\web\public\images\reviews\review-party-1.png'
```

Expected: Reference and review images are available under ASCII-safe paths in `web/public`.

- [ ] **Step 9: Create a safe non-photo placeholder for the animators card**

Write `C:/Users/606ru/OneDrive/Desktop/але/site/web/public/images/reference/animators-placeholder.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" fill="none">
  <rect width="640" height="480" rx="40" fill="#FFF4C3"/>
  <circle cx="170" cy="150" r="70" fill="#F7A6C3"/>
  <circle cx="470" cy="140" r="55" fill="#F6DC6B"/>
  <path d="M210 320C300 220 390 220 470 320" stroke="#E45745" stroke-width="20" stroke-linecap="round"/>
  <path d="M295 160L345 300" stroke="#6B4A35" stroke-width="18" stroke-linecap="round"/>
  <path d="M260 205L380 255" stroke="#6B4A35" stroke-width="18" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 10: Write the first failing smoke test**

Write `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Party brand name', () => {
  render(<App />);
  expect(screen.getByText(/Party/i)).toBeInTheDocument();
});
```

- [ ] **Step 11: Run the smoke test to verify it fails if the default scaffold has not been adapted yet**

Run:

```powershell
cd 'C:\Users\606ru\OneDrive\Desktop\але\site\web'
npm run test -- --run App.test.tsx
```

Expected: FAIL because the scaffolded app does not yet render the `Party` brand name.

- [ ] **Step 12: Replace the scaffold app with the smallest passing version**

Write `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/App.tsx`:

```tsx
export default function App() {
  return <main>Party</main>;
}
```

- [ ] **Step 13: Run the smoke test again**

Run:

```powershell
cd 'C:\Users\606ru\OneDrive\Desktop\але\site\web'
npm run test -- --run App.test.tsx
```

Expected: PASS

- [ ] **Step 14: Commit the bootstrap**

Run:

```powershell
cd 'C:\Users\606ru\OneDrive\Desktop\але\site'
git add .gitignore docs/superpowers/assets/2026-04-01-party-landing-assets.md web
git commit -m "chore: bootstrap party landing workspace"
```

Expected: A commit exists with the scaffold, tests, and staged assets.

## Task 2: Build The Content Model, Design Tokens, And Anchor Shell

**Files:**
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/package.json`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/data/siteContent.ts`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/styles/tokens.css`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/styles/global.css`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/layout/SiteHeader.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/layout/SiteHeader.module.css`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/ui/SectionHeading.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/App.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/layout/SiteHeader.test.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/App.test.tsx`

- [ ] **Step 1: Add the scripts needed for unit tests, e2e tests, and builds**

Update `web/package.json` so the scripts include:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 2: Define the page content in one place**

Write `web/src/data/siteContent.ts` with:

```ts
export const navItems = [
  { id: 'about', label: 'О нас' },
  { id: 'services', label: 'Услуги' },
  { id: 'gallery', label: 'Галерея' },
  { id: 'reviews', label: 'Отзывы' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Контакты' },
] as const;

export const siteContent = {
  brand: 'Party',
  tagline: 'Почувствуй атмосферу праздника с нашей помощью!',
  heroDescription: 'Яркие фудтраки, сладкая вата, шоколадный фонтан и аниматоры для событий, которые хочется запомнить.',
};
```

- [ ] **Step 3: Write failing tests for the anchor shell**

Update `web/src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the one-page section skeleton', () => {
  render(<App />);
  expect(screen.getByRole('banner')).toBeInTheDocument();
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(screen.getByRole('navigation')).toBeInTheDocument();
  expect(screen.getByTestId('section-hero')).toBeInTheDocument();
  expect(screen.getByTestId('section-services')).toBeInTheDocument();
  expect(screen.getByTestId('section-about')).toBeInTheDocument();
  expect(screen.getByTestId('section-gallery')).toBeInTheDocument();
  expect(screen.getByTestId('section-reviews')).toBeInTheDocument();
  expect(screen.getByTestId('section-faq')).toBeInTheDocument();
  expect(screen.getByTestId('section-contact')).toBeInTheDocument();
});
```

Write `web/src/components/layout/SiteHeader.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { SiteHeader } from './SiteHeader';

test('renders anchor links for every planned section', () => {
  render(<SiteHeader />);
  expect(screen.getByRole('link', { name: 'О нас' })).toHaveAttribute('href', '#about');
  expect(screen.getByRole('link', { name: 'Услуги' })).toHaveAttribute('href', '#services');
  expect(screen.getByRole('link', { name: 'Контакты' })).toHaveAttribute('href', '#contact');
});
```

- [ ] **Step 4: Run the failing shell tests**

Run:

```powershell
cd 'C:\Users\606ru\OneDrive\Desktop\але\site\web'
npm run test -- --run App.test.tsx src/components/layout/SiteHeader.test.tsx
```

Expected: FAIL because the header and section skeleton do not exist yet.

- [ ] **Step 5: Create tokens and global styles**

Write `web/src/styles/tokens.css`:

```css
:root {
  --font-display: 'Cormorant Garamond', serif;
  --font-body: 'Poppins', sans-serif;
  --bg-page: #fffbe8;
  --bg-surface: #fffdf5;
  --accent-yellow: #f6dc6b;
  --accent-red: #e45745;
  --accent-pink: #f7a6c3;
  --accent-chocolate: #6b4a35;
  --text-primary: #3d2d25;
  --text-muted: #756257;
  --radius-pill: 999px;
  --radius-card: 32px;
  --shadow-soft: 0 18px 48px rgba(122, 89, 63, 0.12);
}
```

Write `web/src/styles/global.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Poppins:wght@400;500;600;700&display=swap');
@import './tokens.css';

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: var(--font-body);
  background: var(--bg-page);
  color: var(--text-primary);
}

h1,
h2,
h3 {
  font-family: var(--font-display);
}
```

- [ ] **Step 6: Build the shell components**

Write `web/src/components/layout/SiteHeader.tsx`:

```tsx
import { navItems, siteContent } from '../../data/siteContent';
import styles from './SiteHeader.module.css';

export function SiteHeader() {
  return (
    <header className={styles.header} role="banner">
      <a className={styles.brand} href="#hero">
        {siteContent.brand}
      </a>
      <nav aria-label="Основная навигация">
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
```

Write `web/src/App.tsx`:

```tsx
import { SiteHeader } from './components/layout/SiteHeader';
import './styles/global.css';

export default function App() {
  return (
    <>
      <SiteHeader />
      <main>
        <section id="hero" data-testid="section-hero" />
        <section id="services" data-testid="section-services" />
        <section id="about" data-testid="section-about" />
        <section id="gallery" data-testid="section-gallery" />
        <section id="reviews" data-testid="section-reviews" />
        <section id="faq" data-testid="section-faq" />
        <section id="contact" data-testid="section-contact" />
      </main>
    </>
  );
}
```

- [ ] **Step 7: Run the shell tests again**

Run:

```powershell
cd 'C:\Users\606ru\OneDrive\Desktop\але\site\web'
npm run test -- --run App.test.tsx src/components/layout/SiteHeader.test.tsx
```

Expected: PASS

- [ ] **Step 8: Commit the shell and tokens**

Run:

```powershell
cd 'C:\Users\606ru\OneDrive\Desktop\але\site'
git add web/package.json web/src
git commit -m "feat: add party landing shell and tokens"
```

Expected: A commit exists with the app shell and shared tokens.

## Task 3: Implement The Hero Section And Food Truck Scene

**Files:**
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/layout/SiteHeader.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/branding/DonutLogo.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/scene/HeroScene.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/scene/HeroScene.module.css`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/HeroSection.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/HeroSection.module.css`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/data/siteContent.ts`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/App.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/HeroSection.test.tsx`

- [ ] **Step 1: Extend the content model for the hero scene**

Add to `web/src/data/siteContent.ts`:

```ts
export const heroSceneCards = [
  { id: 'cotton-candy', label: 'Сладкая вата', image: '/images/reference/cotton-candy-1.png' },
  { id: 'chocolate-fountain', label: 'Шоколадный фонтан', image: '/images/reference/chocolate-fountain-1.png' },
] as const;

export const heroSceneCenter = {
  label: 'Фудтраки',
  image: '/images/reference/food-truck-1.png',
};
```

- [ ] **Step 2: Write the failing hero tests**

Write `web/src/components/sections/HeroSection.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react';
import { HeroSection } from './HeroSection';

test('renders the approved tagline and no hero CTA button', () => {
  render(<HeroSection />);
  expect(screen.getByRole('heading', { name: /Почувствуй атмосферу праздника/i })).toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /Наши форматы/i })).not.toBeInTheDocument();
});

test('renders a central food truck scene with side service cards', () => {
  render(<HeroSection />);
  const hero = screen.getByTestId('hero-scene');
  expect(within(hero).getByAltText(/Фудтраки/i)).toBeInTheDocument();
  expect(within(hero).getByText('Сладкая вата')).toBeInTheDocument();
  expect(within(hero).getByText('Шоколадный фонтан')).toBeInTheDocument();
});
```

- [ ] **Step 3: Run the hero tests to verify they fail**

Run:

```powershell
cd 'C:\Users\606ru\OneDrive\Desktop\але\site\web'
npm run test -- --run src/components/sections/HeroSection.test.tsx
```

Expected: FAIL because the hero section has not been built yet.

- [ ] **Step 4: Create the donut brand mark**

Write `web/src/components/branding/DonutLogo.tsx`:

```tsx
export function DonutLogo() {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="24" fill="#f7a6c3" />
      <circle cx="32" cy="32" r="10" fill="#fffbe8" />
    </svg>
  );
}
```

- [ ] **Step 5: Mount the donut mark inside the site header**

Update `web/src/components/layout/SiteHeader.tsx`:

```tsx
import { DonutLogo } from '../branding/DonutLogo';
import { navItems, siteContent } from '../../data/siteContent';
import styles from './SiteHeader.module.css';

export function SiteHeader() {
  return (
    <header className={styles.header} role="banner">
      <a className={styles.brand} href="#hero">
        <DonutLogo />
        <span>{siteContent.brand}</span>
      </a>
      <nav aria-label="Основная навигация">
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
```

- [ ] **Step 6: Build the hero scene and section**

Write `web/src/components/scene/HeroScene.tsx`:

```tsx
import { heroSceneCards, heroSceneCenter } from '../../data/siteContent';
import styles from './HeroScene.module.css';

export function HeroScene() {
  return (
    <div className={styles.scene} data-testid="hero-scene">
      <div className={styles.cardLeft}>
        <img src={heroSceneCards[0].image} alt={heroSceneCards[0].label} />
        <span>{heroSceneCards[0].label}</span>
      </div>
      <div className={styles.centerTruck}>
        <img src={heroSceneCenter.image} alt={heroSceneCenter.label} />
      </div>
      <div className={styles.cardRight}>
        <img src={heroSceneCards[1].image} alt={heroSceneCards[1].label} />
        <span>{heroSceneCards[1].label}</span>
      </div>
    </div>
  );
}
```

Write `web/src/components/sections/HeroSection.tsx`:

```tsx
import { siteContent } from '../../data/siteContent';
import { HeroScene } from '../scene/HeroScene';
import styles from './HeroSection.module.css';

export function HeroSection() {
  return (
    <section id="hero" className={styles.hero} data-testid="section-hero">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Party</p>
        <h1>{siteContent.tagline}</h1>
        <p>{siteContent.heroDescription}</p>
      </div>
      <HeroScene />
    </section>
  );
}
```

- [ ] **Step 7: Add the sweet-editorial hero styling so the source photos do not ship as raw screenshots**

Write `web/src/components/scene/HeroScene.module.css` with rules shaped like:

```css
.scene {
  display: grid;
  grid-template-columns: 0.9fr 1.25fr 0.9fr;
  align-items: center;
  gap: 1rem;
}

.centerTruck,
.cardLeft,
.cardRight {
  position: relative;
  border-radius: var(--radius-card);
  background: linear-gradient(180deg, #fffdf5 0%, #fff3cf 100%);
  box-shadow: var(--shadow-soft);
  overflow: hidden;
  border: 2px solid rgba(228, 87, 69, 0.12);
}

.cardLeft {
  transform: rotate(-10deg) translateY(1rem);
}

.cardRight {
  transform: rotate(10deg) translateY(1rem);
}

.centerTruck img,
.cardLeft img,
.cardRight img {
  width: 100%;
  display: block;
  object-fit: cover;
  filter: saturate(1.08) contrast(1.04) drop-shadow(0 18px 24px rgba(107, 74, 53, 0.16));
}

.cardLeft::before,
.cardRight::before,
.centerTruck::before {
  content: '';
  position: absolute;
  inset: auto 10% -18% 10%;
  height: 40%;
  background: rgba(246, 220, 107, 0.26);
  border-radius: 50%;
  filter: blur(10px);
}
```

Write `web/src/components/sections/HeroSection.module.css` with rules shaped like:

```css
.hero {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 2rem;
  align-items: center;
  padding-block: 4rem 3rem;
}

.copy h1 {
  font-size: clamp(3rem, 6vw, 5.5rem);
  line-height: 0.95;
}

@media (max-width: 899px) {
  .hero {
    grid-template-columns: 1fr;
  }
}
```

Expected: the hero now reads as a stylized object-scene instead of plain photos dropped onto the page.

- [ ] **Step 8: Mount the real hero section in `App.tsx`**

Replace the empty hero placeholder with:

```tsx
<HeroSection />
```

- [ ] **Step 9: Run the hero tests again**

Run:

```powershell
cd 'C:\Users\606ru\OneDrive\Desktop\але\site\web'
npm run test -- --run src/components/sections/HeroSection.test.tsx src/App.test.tsx
```

Expected: PASS

- [ ] **Step 10: Commit the hero**

Run:

```powershell
cd 'C:\Users\606ru\OneDrive\Desktop\але\site'
git add web/src
git commit -m "feat: add party hero section and scene"
```

Expected: A commit exists with the hero composition and tests.

## Task 4: Build The Services Showcase With Mobile Scroll Snap

**Files:**
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ServicesSection.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ServicesSection.module.css`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/ui/SectionHeading.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/data/siteContent.ts`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/App.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ServicesSection.test.tsx`

- [ ] **Step 1: Add service-strip content data**

Extend `web/src/data/siteContent.ts`:

```ts
export const services = [
  { id: 'food-trucks', name: 'Фудтраки', image: '/images/reference/food-truck-2.png' },
  { id: 'cotton-candy', name: 'Сладкая вата', image: '/images/reference/cotton-candy-2.png' },
  { id: 'chocolate-fountain', name: 'Шоколадный фонтан', image: '/images/reference/chocolate-fountain-2.png' },
  { id: 'animators', name: 'Аниматоры', image: '/images/reference/animators-placeholder.svg' },
] as const;
```

- [ ] **Step 2: Write failing tests for the services strip**

Write `web/src/components/sections/ServicesSection.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { ServicesSection } from './ServicesSection';

test('renders all four approved service formats', () => {
  render(<ServicesSection />);
  expect(screen.getByRole('heading', { name: /Услуги/i })).toBeInTheDocument();
  expect(screen.getByText('Фудтраки')).toBeInTheDocument();
  expect(screen.getByText('Сладкая вата')).toBeInTheDocument();
  expect(screen.getByText('Шоколадный фонтан')).toBeInTheDocument();
  expect(screen.getByText('Аниматоры')).toBeInTheDocument();
});

test('marks the mobile strip as scroll-snap driven', () => {
  render(<ServicesSection />);
  expect(screen.getByTestId('services-strip')).toHaveAttribute('data-scroll-snap', 'x');
});
```

- [ ] **Step 3: Run the failing services tests**

Run:

```powershell
cd 'C:\Users\606ru\OneDrive\Desktop\але\site\web'
npm run test -- --run src/components/sections/ServicesSection.test.tsx
```

Expected: FAIL because the services section does not exist yet.

- [ ] **Step 4: Build the section heading helper**

Write `web/src/components/ui/SectionHeading.tsx`:

```tsx
type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <header>
      {eyebrow ? <p>{eyebrow}</p> : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </header>
  );
}
```

- [ ] **Step 5: Build the services strip**

Write `web/src/components/sections/ServicesSection.tsx`:

```tsx
import { services } from '../../data/siteContent';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './ServicesSection.module.css';

export function ServicesSection() {
  return (
    <section id="services" className={styles.section} data-testid="section-services">
      <SectionHeading
        eyebrow="Наши форматы"
        title="Услуги"
        description="Четыре ярких формата для атмосферы, вкуса и эмоций."
      />
      <div className={styles.strip} data-scroll-snap="x" data-testid="services-strip">
        {services.map((service) => (
          <article key={service.id} className={styles.card}>
            <img src={service.image} alt={service.name} />
            <h3>{service.name}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Add horizontal swipe mechanics and sweet-editorial card styling**

Ensure `ServicesSection.module.css` includes:

```css
.strip {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(18rem, 82vw);
  gap: 1.25rem;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  padding-bottom: 1rem;
}

.card {
  min-height: 22rem;
  scroll-snap-align: start;
  position: relative;
  border-radius: var(--radius-card);
  background: linear-gradient(180deg, #fffdf5 0%, #fff2dd 100%);
  box-shadow: var(--shadow-soft);
  overflow: hidden;
}

.card img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  filter: saturate(1.06) contrast(1.03);
}

.card::after {
  content: '';
  position: absolute;
  inset: auto 12% 8% 12%;
  height: 18%;
  background: rgba(247, 166, 195, 0.16);
  border-radius: 999px;
  filter: blur(8px);
}

@media (min-width: 900px) {
  .strip {
    grid-auto-flow: unset;
    grid-auto-columns: unset;
    grid-template-columns: 1.35fr 1fr 1fr 1.1fr;
    overflow: visible;
  }
}
```

Expected: below `900px`, the strip behaves like a true horizontal swipe row with one large card entering the viewport at a time; from `900px` and up, it resolves into the approved wide showcase layout.

- [ ] **Step 7: Mount the services section in `App.tsx`**

Replace the empty services placeholder with:

```tsx
<ServicesSection />
```

- [ ] **Step 8: Run the services tests again**

Run:

```powershell
cd 'C:\Users\606ru\OneDrive\Desktop\але\site\web'
npm run test -- --run src/components/sections/ServicesSection.test.tsx src/App.test.tsx
```

Expected: PASS

- [ ] **Step 9: Commit the services strip**

Run:

```powershell
cd 'C:\Users\606ru\OneDrive\Desktop\але\site'
git add web/src
git commit -m "feat: add party services showcase"
```

Expected: A commit exists with the services strip and mobile scroll behavior.

## Task 5: Add About And Gallery Sections

**Files:**
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/AboutSection.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/AboutSection.module.css`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/GallerySection.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/GallerySection.module.css`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/data/siteContent.ts`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/App.tsx`

- [ ] **Step 1: Add About and Gallery content data**

Extend `web/src/data/siteContent.ts`:

```ts
export const aboutPoints = [
  'Создаем праздничную атмосферу без лишней суеты.',
  'Подходим для частных, семейных и корпоративных событий.',
  'Делаем площадку вкусной, красивой и запоминающейся.',
] as const;

export const galleryItems = [
  { id: 'truck-detail', label: 'Фудтрак', image: '/images/reference/food-truck-1.png' },
  { id: 'cotton-detail', label: 'Сладкая вата', image: '/images/reference/cotton-candy-3.png' },
  { id: 'fountain-detail', label: 'Шоколадный фонтан', image: '/images/reference/chocolate-fountain-3.png' },
] as const;
```

- [ ] **Step 2: Write a failing integration test for the new sections**

Append to `web/src/App.test.tsx`:

```tsx
test('renders the about and gallery sections', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /О нас/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Галерея/i })).toBeInTheDocument();
});
```

- [ ] **Step 3: Run the new integration test to verify it fails**

Run:

```powershell
cd 'C:\Users\606ru\OneDrive\Desktop\але\site\web'
npm run test -- --run App.test.tsx
```

Expected: FAIL because the About and Gallery sections are still empty placeholders.

- [ ] **Step 4: Build the About section**

Write `web/src/components/sections/AboutSection.tsx`:

```tsx
import { aboutPoints } from '../../data/siteContent';
import { SectionHeading } from '../ui/SectionHeading';

export function AboutSection() {
  return (
    <section id="about" data-testid="section-about">
      <SectionHeading
        eyebrow="Почему Party"
        title="О нас"
        description="Праздничные форматы, которые легко вписываются в событие и надолго остаются в памяти."
      />
      <ul>
        {aboutPoints.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 5: Build the Gallery section**

Write `web/src/components/sections/GallerySection.tsx`:

```tsx
import { galleryItems } from '../../data/siteContent';
import { SectionHeading } from '../ui/SectionHeading';

export function GallerySection() {
  return (
    <section id="gallery" data-testid="section-gallery">
      <SectionHeading
        eyebrow="Атмосфера"
        title="Галерея"
        description="Предметные сцены и детали, которые задают настроение праздника."
      />
      <div>
        {galleryItems.map((item) => (
          <figure key={item.id}>
            <img src={item.image} alt={item.label} />
            <figcaption>{item.label}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Mount both sections in `App.tsx`**

Replace the placeholders with:

```tsx
<AboutSection />
<GallerySection />
```

- [ ] **Step 7: Run the updated app test**

Run:

```powershell
cd 'C:\Users\606ru\OneDrive\Desktop\але\site\web'
npm run test -- --run App.test.tsx
```

Expected: PASS

- [ ] **Step 8: Commit the middle-page content**

Run:

```powershell
cd 'C:\Users\606ru\OneDrive\Desktop\але\site'
git add web/src
git commit -m "feat: add about and gallery sections"
```

Expected: A commit exists with the About and Gallery sections.

## Task 6: Add Reviews, FAQ Placeholder, And Contact Placeholder

**Files:**
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ReviewsSection.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ReviewsSection.module.css`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/FaqSection.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/FaqSection.module.css`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ContactPlaceholderSection.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ContactPlaceholderSection.module.css`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/data/siteContent.ts`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/App.tsx`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/ReviewsSection.test.tsx`

- [ ] **Step 1: Add placeholder reviews, FAQ, and contact copy**

Extend `web/src/data/siteContent.ts`:

```ts
export const reviewCards = [
  {
    id: 'review-1',
    author: 'Имя клиента',
    text: 'Текст отзыва добавим позже.',
    image: '/images/reviews/review-party-1.png',
  },
] as const;

export const faqPlaceholders = [
  'Какие зоны нужны для установки?',
  'Сколько времени занимает подготовка?',
] as const;
```

- [ ] **Step 2: Write the failing tests for the lower-page sections**

Write `web/src/components/sections/ReviewsSection.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { ReviewsSection } from './ReviewsSection';

test('renders review content with a real-photo placeholder', () => {
  render(<ReviewsSection />);
  expect(screen.getByRole('heading', { name: /Отзывы/i })).toBeInTheDocument();
  expect(screen.getByText(/Текст отзыва добавим позже/i)).toBeInTheDocument();
  expect(screen.getByAltText(/Имя клиента/i)).toBeInTheDocument();
});
```

Append to `web/src/App.test.tsx`:

```tsx
test('renders the FAQ and contact placeholders', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /FAQ/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Контакты/i })).toBeInTheDocument();
});
```

- [ ] **Step 3: Run the new failing tests**

Run:

```powershell
cd 'C:\Users\606ru\OneDrive\Desktop\але\site\web'
npm run test -- --run src/components/sections/ReviewsSection.test.tsx App.test.tsx
```

Expected: FAIL because the lower-page sections have not been built yet.

- [ ] **Step 4: Build the reviews section**

Write `web/src/components/sections/ReviewsSection.tsx`:

```tsx
import { reviewCards } from '../../data/siteContent';
import { SectionHeading } from '../ui/SectionHeading';

export function ReviewsSection() {
  return (
    <section id="reviews" data-testid="section-reviews">
      <SectionHeading
        eyebrow="Живые впечатления"
        title="Отзывы"
        description="Здесь останутся реальные фотографии и тексты клиентов."
      />
      {reviewCards.map((review) => (
        <article key={review.id}>
          <img src={review.image} alt={review.author} />
          <h3>{review.author}</h3>
          <p>{review.text}</p>
        </article>
      ))}
    </section>
  );
}
```

- [ ] **Step 5: Build the placeholder sections**

Write `web/src/components/sections/FaqSection.tsx`:

```tsx
import { faqPlaceholders } from '../../data/siteContent';
import { SectionHeading } from '../ui/SectionHeading';

export function FaqSection() {
  return (
    <section id="faq" data-testid="section-faq">
      <SectionHeading eyebrow="Скоро" title="FAQ" description="Добавим ответы на частые вопросы позже." />
      <ul>
        {faqPlaceholders.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
```

Write `web/src/components/sections/ContactPlaceholderSection.tsx`:

```tsx
import { SectionHeading } from '../ui/SectionHeading';

export function ContactPlaceholderSection() {
  return (
    <section id="contact" data-testid="section-contact">
      <SectionHeading
        eyebrow="Связь"
        title="Контакты"
        description="Позже здесь появится форма, мессенджеры и удобный способ оставить заявку."
      />
    </section>
  );
}
```

- [ ] **Step 6: Mount the lower-page sections in `App.tsx`**

Replace the remaining placeholders with:

```tsx
<ReviewsSection />
<FaqSection />
<ContactPlaceholderSection />
```

- [ ] **Step 7: Run the lower-page tests again**

Run:

```powershell
cd 'C:\Users\606ru\OneDrive\Desktop\але\site\web'
npm run test -- --run src/components/sections/ReviewsSection.test.tsx App.test.tsx
```

Expected: PASS

- [ ] **Step 8: Commit the lower-page sections**

Run:

```powershell
cd 'C:\Users\606ru\OneDrive\Desktop\але\site'
git add web/src
git commit -m "feat: add review and placeholder sections"
```

Expected: A commit exists with the lower-page sections.

## Task 7: Polish Styling, Responsive Behavior, And End-To-End Verification

**Files:**
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/styles/global.css`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/layout/SiteHeader.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/layout/SiteHeader.module.css`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/layout/SiteHeader.test.tsx`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/scene/HeroScene.module.css`
- Modify: `C:/Users/606ru/OneDrive/Desktop/але/site/web/src/components/sections/*.module.css`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/playwright.config.ts`
- Create: `C:/Users/606ru/OneDrive/Desktop/але/site/web/e2e/landing.spec.ts`

- [ ] **Step 1: Write the end-to-end test for desktop anchors, mobile menu reachability, and services scrolling**

Write `web/e2e/landing.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('desktop navigation links jump to page sections', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Услуги' }).click();
  await expect(page.locator('#services')).toBeInViewport();
});

test('mobile menu exposes section links and services remain horizontally scrollable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Меню' }).click();
  await expect(page.getByRole('link', { name: 'Отзывы' })).toBeVisible();
  const strip = page.getByTestId('services-strip');
  await expect(strip).toHaveAttribute('data-scroll-snap', 'x');
  const metrics = await strip.evaluate((node) => ({
    scrollWidth: node.scrollWidth,
    clientWidth: node.clientWidth,
  }));
  expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth);
});
```

- [ ] **Step 2: Run the e2e test now and confirm it fails before configuration**

Run:

```powershell
cd 'C:\Users\606ru\OneDrive\Desktop\але\site\web'
npm run test:e2e -- --grep "desktop navigation links jump to page sections"
```

Expected: FAIL because Playwright config and the styled, running app flow are not finished yet.

- [ ] **Step 3: Add the Playwright config**

Write `web/playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://127.0.0.1:4173',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4173',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});
```

- [ ] **Step 4: Write a failing unit test for the mobile header disclosure**

Update `web/src/components/layout/SiteHeader.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { SiteHeader } from './SiteHeader';

test('reveals navigation links after pressing the mobile menu button', () => {
  render(<SiteHeader />);
  fireEvent.click(screen.getByRole('button', { name: 'Меню' }));
  expect(screen.getByRole('link', { name: 'Отзывы' })).toBeVisible();
});
```

- [ ] **Step 5: Implement the mobile disclosure menu in `SiteHeader.tsx`**

Update `web/src/components/layout/SiteHeader.tsx`:

```tsx
import { useState } from 'react';
import { DonutLogo } from '../branding/DonutLogo';
import { navItems, siteContent } from '../../data/siteContent';
import styles from './SiteHeader.module.css';

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={styles.header} role="banner">
      <a className={styles.brand} href="#hero">
        <DonutLogo />
        <span>{siteContent.brand}</span>
      </a>
      <button
        type="button"
        className={styles.menuButton}
        aria-expanded={isOpen}
        aria-controls="site-nav"
        onClick={() => setIsOpen((value) => !value)}
      >
        Меню
      </button>
      <nav
        id="site-nav"
        aria-label="Основная навигация"
        className={`${styles.nav} ${isOpen ? styles.navOpen : ''}`}
      >
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} onClick={() => setIsOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
```

- [ ] **Step 6: Apply the final visual polish in CSS Modules**

Ensure the styling does all of the following:

- keeps the header light and easy to scan
- collapses the header into a compact hamburger at widths below `900px`
- keeps desktop navigation fully visible from `900px` and up
- gives the hero a left-copy/right-scene split on desktop
- stacks hero copy above the scene below `900px`
- uses a creamy lemon base instead of pure white
- makes the truck the visual center with tilted side cards
- gives the services strip an editorial rhythm on desktop
- preserves mobile overflow and scroll-snap
- limits people imagery to the reviews section

`SiteHeader.module.css` should explicitly:

- hide `.menuButton` from `900px` and up
- hide `.nav` below `900px` until `.navOpen` is present
- render `.navOpen` as a dropdown panel below the header
- keep links keyboard-focusable and readable on touch screens

- [ ] **Step 7: Run the full unit suite**

Run:

```powershell
cd 'C:\Users\606ru\OneDrive\Desktop\але\site\web'
npm run test
```

Expected: PASS

- [ ] **Step 8: Run the end-to-end suite**

Run:

```powershell
cd 'C:\Users\606ru\OneDrive\Desktop\але\site\web'
npm run test:e2e
```

Expected: PASS

- [ ] **Step 9: Run the production build**

Run:

```powershell
cd 'C:\Users\606ru\OneDrive\Desktop\але\site\web'
npm run build
```

Expected: PASS and a production bundle appears in `web/dist`.

- [ ] **Step 10: Commit the polish and verification**

Run:

```powershell
cd 'C:\Users\606ru\OneDrive\Desktop\але\site'
git add web
git commit -m "feat: polish party landing and verify build"
```

Expected: A final implementation commit exists with passing tests and build output.

## Final Verification Checklist

- [ ] Hero contains the approved tagline and no CTA button
- [ ] Top navigation scrolls to each section on the same page
- [ ] Mobile header keeps section links reachable through the `Меню` disclosure
- [ ] Hero scene centers the food truck and shows side cards for cotton candy and chocolate fountain
- [ ] Services section shows four formats, including animators
- [ ] Mobile services strip uses `scroll-snap`
- [ ] Reviews are the only area where people photos appear intentionally
- [ ] FAQ and Contacts are visible as placeholders
- [ ] `npm run test` passes
- [ ] `npm run test:e2e` passes
- [ ] `npm run build` passes
