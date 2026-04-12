import { expect, test, type Page } from '@playwright/test';

async function headerHeight(page: Page) {
  const header = page.getByRole('banner').first();
  const box = await header.boundingBox();
  return box?.height ?? 0;
}

async function panelTopGap(page: Page, sectionId: string) {
  const header = page.getByRole('banner').first();
  const headerBox = await header.boundingBox();
  const panel = page.locator(`#${sectionId} > .site-container`).first();
  const panelBox = await panel.boundingBox();

  if (!headerBox || !panelBox) {
    return Number.POSITIVE_INFINITY;
  }

  return panelBox.y - headerBox.height;
}

test('desktop anchor navigation targets current homepage sections', async ({ page }) => {
  await page.goto('/');

  const header = page.getByTestId('site-header');
  const nav = header.locator('nav').first();
  await expect(header).toBeVisible();
  await expect(nav).toBeVisible();

  const h = await headerHeight(page);
  const sectionIds = ['about', 'services', 'extras', 'testimonials', 'faq', 'contact'] as const;

  for (const sectionId of sectionIds) {
    const navLink = nav.locator(`a[href="#${sectionId}"]`);
    await expect(navLink).toBeVisible();
    await navLink.click();

    const section = page.locator(`#${sectionId}`);
    await expect(section).toBeVisible();
    await expect.poll(async () => panelTopGap(page, sectionId)).toBeGreaterThan(-8);
    await expect.poll(async () => panelTopGap(page, sectionId)).toBeLessThan(12);

    await expect
      .poll(async () => {
        const box = await section.boundingBox();
        if (!box) return Number.POSITIVE_INFINITY;
        return box.y - h;
      })
      .toBeLessThan(320);
  }
});

test('mobile menu links to current sections and closes after navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const menuButton = page.getByTestId('menu-button');
  await expect(menuButton).toBeVisible();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(menuButton).toHaveAttribute('data-menu-open', 'false');
  await expect(page.locator('[data-menu-line="true"]')).toHaveCount(3);

  await menuButton.click();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  await expect(menuButton).toHaveAttribute('data-menu-open', 'true');

  const mobileNav = page.locator('[class*="mobilePanel"] nav').first();
  await expect(mobileNav).toBeVisible();

  await mobileNav.locator('a[href="#testimonials"]').click();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('[class*="mobilePanel"] nav')).toHaveCount(0);
  await expect.poll(async () => panelTopGap(page, 'testimonials')).toBeGreaterThan(8);
  await expect.poll(async () => panelTopGap(page, 'testimonials'), { timeout: 10000 }).toBeLessThan(112);
});

test('mobile services and extras catalogs are horizontally scrollable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  for (const testId of ['services-catalog', 'extras-track'] as const) {
    const track = page.getByTestId(testId);
    await expect(track).toBeVisible();

    const metrics = await track.evaluate((el) => ({
      clientWidth: el.clientWidth,
      scrollWidth: el.scrollWidth,
      scrollLeft: el.scrollLeft,
      scrollSnapType: window.getComputedStyle(el).scrollSnapType,
    }));

    expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth);
    expect(metrics.scrollSnapType).toContain('x');

    await track.evaluate((el) => {
      el.scrollLeft = Math.max(0, el.scrollWidth - el.clientWidth);
    });

    await expect.poll(async () => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(metrics.scrollLeft);
  }
});

test('narrow mobile header keeps the menu trigger fully inside the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/');

  const menuButton = page.getByTestId('menu-button');
  await expect(menuButton).toBeVisible();

  const bounds = await menuButton.boundingBox();
  expect(bounds).not.toBeNull();
  if (!bounds) return;

  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(320);
});

test('tablet header switches to the mobile menu before the desktop nav starts colliding', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto('/');

  await expect(page.getByTestId('menu-button')).toBeVisible();
  await expect(page.getByRole('navigation')).toHaveCount(0);
  await expect(page.getByTestId('header-order-button')).toHaveCount(0);
});

test('tablet hero stacks the poster below the copy before the two-column layout starts colliding', async ({ page }) => {
  await page.setViewportSize({ width: 960, height: 900 });
  await page.goto('/');

  const secondaryButton = page.getByRole('button', { name: 'В каталог' });
  const posterFrame = page.getByTestId('hero-poster-frame');
  await expect(secondaryButton).toBeVisible();
  await expect(posterFrame).toBeVisible();

  const buttonBox = await secondaryButton.boundingBox();
  const posterBox = await posterFrame.boundingBox();

  expect(buttonBox).not.toBeNull();
  expect(posterBox).not.toBeNull();
  if (!buttonBox || !posterBox) return;

  expect(posterBox.y).toBeGreaterThan(buttonBox.y + buttonBox.height + 12);
});

test('desktop header does not snap the page back to the top when it enters compact mode', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const header = page.getByTestId('site-header');
  await page.evaluate(() => window.scrollTo({ top: 180, behavior: 'auto' }));

  await expect
    .poll(async () => {
      const state = await header.getAttribute('data-header-state');
      const y = await page.evaluate(() => Math.round(window.scrollY));
      return { state, y };
    })
    .toEqual({ state: 'compact', y: 180 });
});

test('mobile brand text stays on one line without clipping in both header states', async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 320, height: 700 },
  ] as const) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await page.evaluate(async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
    });

    const brandText = page.locator('[class*="brandText"]').first();

    const restMetrics = await brandText.evaluate((node) => {
      const element = node as HTMLElement;
      const style = getComputedStyle(element);
      const clone = document.createElement('span');
      clone.textContent = element.textContent;
      clone.style.position = 'fixed';
      clone.style.visibility = 'hidden';
      clone.style.whiteSpace = 'nowrap';
      clone.style.fontFamily = style.fontFamily;
      clone.style.fontSize = style.fontSize;
      clone.style.fontWeight = style.fontWeight;
      clone.style.letterSpacing = style.letterSpacing;
      clone.style.lineHeight = style.lineHeight;
      document.body.appendChild(clone);
      const naturalWidth = clone.getBoundingClientRect().width;
      clone.remove();

      return {
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
        whiteSpace: style.whiteSpace,
        naturalWidth,
      };
    });

    expect(restMetrics.whiteSpace).toBe('nowrap');
    expect(restMetrics.naturalWidth).toBeLessThanOrEqual(restMetrics.clientWidth);
    expect(restMetrics.scrollHeight - restMetrics.clientHeight).toBeLessThanOrEqual(1);

    await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'auto' }));
    await page.waitForTimeout(700);

    const compactMetrics = await brandText.evaluate((node) => {
      const element = node as HTMLElement;
      const style = getComputedStyle(element);
      const clone = document.createElement('span');
      clone.textContent = element.textContent;
      clone.style.position = 'fixed';
      clone.style.visibility = 'hidden';
      clone.style.whiteSpace = 'nowrap';
      clone.style.fontFamily = style.fontFamily;
      clone.style.fontSize = style.fontSize;
      clone.style.fontWeight = style.fontWeight;
      clone.style.letterSpacing = style.letterSpacing;
      clone.style.lineHeight = style.lineHeight;
      document.body.appendChild(clone);
      const naturalWidth = clone.getBoundingClientRect().width;
      clone.remove();

      return {
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
        whiteSpace: style.whiteSpace,
        naturalWidth,
      };
    });

    expect(compactMetrics.whiteSpace).toBe('nowrap');
    expect(compactMetrics.naturalWidth).toBeLessThanOrEqual(compactMetrics.clientWidth);
    expect(compactMetrics.scrollHeight - compactMetrics.clientHeight).toBeLessThanOrEqual(1);
  }
});

test('homepage sections expose the current content surfaces', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  await expect(page.getByTestId('hero-poster-frame')).toBeVisible();
  await expect(page.getByTestId('about-proof-strip').locator('[data-testid="about-fact"]')).toHaveCount(3);
  await expect(page.getByTestId('services-catalog')).toHaveAttribute('data-mobile-layout', 'grid');
  await expect(page.getByTestId('services-catalog').getByTestId('service-card')).toHaveCount(9);
  await expect(page.getByTestId('extras-track').locator('article')).toHaveCount(2);
  await expect(page.getByTestId('extras-track').getByTestId('extra-visual-blank')).toHaveCount(0);
  await expect(page.getByTestId('extras-track').getByRole('img', { name: /Брендирование тележки для кейтеринга/ })).toHaveAttribute(
    'src',
    '/images/extras/branding.png',
  );
  await expect(page.getByTestId('extras-track').getByRole('img', { name: /Аренда оборудования/ })).toHaveAttribute(
    'src',
    '/images/extras/equipment.png',
  );
  await expect(page.getByTestId('section-food-trucks')).toBeVisible();
  await expect(page.getByTestId('food-trucks-gallery')).toBeVisible();
  await expect(page.getByTestId('food-trucks-gallery')).toHaveAttribute('data-gallery-mode', 'interactive');
  await expect(page.getByTestId('food-trucks-gallery').locator('[data-testid="food-truck-gallery-image"]')).toHaveCount(6);
  await expect(page.getByRole('heading', { level: 2, name: 'Кейтеринг на фудтраках' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Узнать условия' })).toBeVisible();
  await expect(page.getByTestId('testimonials-proof-wall').locator('[data-testid="testimonial-screenshot-card"]')).toHaveCount(6);
  await expect(page.getByTestId('testimonials-proof')).toBeVisible();
  await expect(page.getByTestId('faq-accordion')).toHaveAttribute('data-motion-faq', 'cinematic');
  await expect(page.getByTestId('contact-layout')).toHaveAttribute('data-contact-layout', 'split-canvas');
  await expect(page.getByTestId('cta-inline-form')).toBeVisible();
});

test('legal pages stay inside the mobile viewport without horizontal clipping', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const url of ['/privacy', '/terms', '/consent'] as const) {
    await page.goto(url);

    const metrics = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    const title = page.getByRole('heading', { level: 1 });
    const sheet = page.getByTestId('legal-document-sheet');
    const titleBox = await title.boundingBox();
    const sheetBox = await sheet.boundingBox();

    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
    expect(titleBox).not.toBeNull();
    expect(sheetBox).not.toBeNull();
    if (!titleBox || !sheetBox) continue;

    expect(titleBox.x).toBeGreaterThanOrEqual(0);
    expect(titleBox.x + titleBox.width).toBeLessThanOrEqual(390);
    expect(sheetBox.x).toBeGreaterThanOrEqual(0);
    expect(sheetBox.x + sheetBox.width).toBeLessThanOrEqual(390);
  }
});

test('service and extra pages render the shared offering shell', async ({ page }) => {
  for (const url of ['/services/cotton-candy', '/extras/branded-cart'] as const) {
    await page.goto(url, { waitUntil: 'networkidle' });

    await expect(page.getByTestId('section-offering-intro')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByTestId('section-services')).toBeVisible();
    await expect(page.getByTestId('section-extras')).toBeVisible();
    await expect(page.getByTestId('section-testimonials')).toBeVisible();
    await expect(page.getByTestId('section-faq')).toBeVisible();
    await expect(page.getByTestId('section-contact')).toBeVisible();
    await expect(page.getByTestId('section-offering-cta')).toBeVisible();
  }
});

test('unknown routes render the non-indexable 404 page', async ({ page }) => {
  await page.goto('/not-a-real-page');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('meta[name="robots"][content="noindex, nofollow"]')).toHaveCount(1);
});
