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

test('anchor navigation lands section panels in a consistent visual band below the sticky header', async ({
  page,
}) => {
  await page.goto('/');

  const header = page.getByRole('banner').first();
  await expect(header).toBeVisible();

  const h = await headerHeight(page);
  const nav = page.getByTestId('site-header').locator('nav').first();
  await expect(nav).toBeVisible();

  const sectionIds = ['services', 'about', 'reviews', 'faq', 'contact'] as const;

  for (const sectionId of sectionIds) {
    await nav.locator(`a[href="#${sectionId}"]`).click();

    const section = page.locator(`#${sectionId}`);
    await expect(section).toBeVisible();

    await expect.poll(async () => panelTopGap(page, sectionId)).toBeGreaterThan(8);
    await expect.poll(async () => panelTopGap(page, sectionId)).toBeLessThan(56);

    await expect
      .poll(async () => {
        const box = await section.boundingBox();
        if (!box) return Number.POSITIVE_INFINITY;
        return box.y - h;
      })
      .toBeLessThan(280);
  }
});

test('mobile menu is a proper disclosure, uses an animated icon trigger, closes after clicking a link, and lands the section cleanly', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const menuButton = page.getByTestId('menu-button');
  await expect(menuButton).toBeVisible();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(menuButton).toHaveAttribute('data-menu-open', 'false');
  await expect(page.locator('[data-menu-line="true"]')).toHaveCount(3);
  await expect(page.getByTestId('menu-button-line-top')).not.toHaveCSS('transition-duration', '0s');
  await expect(page.getByTestId('menu-button-line-middle')).toHaveCSS('opacity', '1');

  await menuButton.click();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  await expect(menuButton).toHaveAttribute('data-menu-open', 'true');
  await expect(page.getByTestId('menu-button-line-middle')).toHaveCSS('opacity', '0');

  const mobileNav = page.locator('[class*="mobilePanel"] nav').first();
  await expect(mobileNav).toBeVisible();

  await mobileNav.locator('a[href="#reviews"]').click();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('[class*="mobilePanel"] nav')).toHaveCount(0);
  await expect.poll(async () => panelTopGap(page, 'reviews')).toBeGreaterThan(8);
  await expect.poll(async () => panelTopGap(page, 'reviews')).toBeLessThan(72);
});

test('mobile services strip is horizontally scrollable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const strip = page.getByTestId('services-strip');
  await expect(strip).toBeVisible();

  const metrics = await strip.evaluate((el) => ({
    clientWidth: el.clientWidth,
    scrollWidth: el.scrollWidth,
    scrollLeft: el.scrollLeft,
    scrollSnapType: window.getComputedStyle(el).scrollSnapType,
  }));

  expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth);
  expect(metrics.scrollSnapType).toMatch(/mandatory/i);

  await strip.evaluate((el) => {
    el.scrollLeft = Math.max(0, el.scrollWidth - el.clientWidth);
  });

  await expect
    .poll(async () => strip.evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(metrics.scrollLeft);
});

test('mobile header stays fixed from the first scroll pixel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const header = page.getByRole('banner').first();
  await expect(header).toBeVisible();

  await expect
    .poll(async () => header.evaluate((el) => window.getComputedStyle(el).position))
    .toBe('fixed');

  await page.evaluate(() => window.scrollTo(0, 60));

  await expect
    .poll(async () => {
      const box = await header.boundingBox();
      return box?.y ?? -1;
    })
    .toBeLessThan(1);
});

test('mobile hero scene keeps smaller cards inside the frame with a warm light background', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const frame = page.getByTestId('hero-scene-frame');
  await expect(frame).toBeVisible();

  const backgroundImage = await frame.evaluate((el) => window.getComputedStyle(el).backgroundImage);
  expect(backgroundImage).not.toContain('rgb(93, 61, 45)');
  expect(backgroundImage).not.toContain('rgb(74, 48, 37)');

  const frameBox = await frame.boundingBox();
  const cards = await page.locator('[data-testid="hero-scene-frame"] > div').evaluateAll((elements) =>
    elements.map((el) => {
      const rect = el.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    }),
  );

  expect(frameBox).not.toBeNull();
  if (!frameBox) return;

  for (const card of cards) {
    expect(card.x).toBeGreaterThanOrEqual(frameBox.x);
    expect(card.y).toBeGreaterThanOrEqual(frameBox.y);
    expect(card.x + card.width).toBeLessThanOrEqual(frameBox.x + frameBox.width);
    expect(card.y + card.height).toBeLessThanOrEqual(frameBox.y + frameBox.height);
  }

  const overlapWidth = (a: (typeof cards)[number], b: (typeof cards)[number]) => {
    const left = Math.max(a.x, b.x);
    const right = Math.min(a.x + a.width, b.x + b.width);
    return Math.max(0, right - left);
  };

  expect(overlapWidth(cards[0], cards[1])).toBeLessThan(80);
  expect(overlapWidth(cards[1], cards[2])).toBeLessThan(80);
});

test('desktop hero heading is slightly reduced so the first screen stays calmer', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const heading = page.getByRole('heading', { level: 1 }).first();
  await expect(heading).toBeVisible();

  const fontSize = await heading.evaluate((el) => Number.parseFloat(window.getComputedStyle(el).fontSize));
  expect(fontSize).toBeLessThan(84);
});

test('section panels use a soft reveal state as they enter the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const contactPanel = page.locator('#contact > .site-container').first();
  const revealDuration = await contactPanel.evaluate((el) =>
    window.getComputedStyle(el).getPropertyValue('--reveal-soft-duration').trim(),
  );

  expect(revealDuration).toBe('880ms');
  await expect(contactPanel).toHaveAttribute('data-reveal-state', 'pending');

  await page.locator('#contact').scrollIntoViewIfNeeded();

  await expect(contactPanel).toHaveAttribute('data-reveal-state', 'visible');
});

test('hero motion, panel glow, and review hover feel animated without breaking layout', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const heroFrame = page.getByTestId('hero-scene-frame');
  const foodTruckCard = page.getByTestId('hero-scene-card-food-truck');
  const reviewsPanel = page.locator('#reviews .site-panel-glow').first();
  const reviewCard = page.getByTestId('review-story-card').first();
  const reviewPhoto = reviewCard.locator('img').first();

  await expect(heroFrame).toHaveAttribute('data-motion-frame', 'parallax');
  await expect(foodTruckCard).toHaveAttribute('data-motion-depth', 'front');
  await expect(reviewsPanel).toBeVisible();

  const heroAnimation = await foodTruckCard.evaluate((el) => window.getComputedStyle(el).animationName);
  expect(heroAnimation).not.toBe('none');

  const panelGlowAnimation = await reviewsPanel.evaluate((el) =>
    window.getComputedStyle(el, '::before').animationName,
  );
  expect(panelGlowAnimation).not.toBe('none');

  await page.locator('#reviews').scrollIntoViewIfNeeded();
  await expect(reviewCard).toBeVisible();

  const before = await reviewPhoto.evaluate((el) => window.getComputedStyle(el).transform);
  await reviewCard.hover();
  const after = await reviewPhoto.evaluate((el) => window.getComputedStyle(el).transform);

  expect(before).not.toBe(after);
});

test('smart header, cinematic faq, and service micro scenes stay wired up on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const header = page.getByTestId('site-header');
  await page.evaluate(() => window.scrollTo(0, 180));
  await expect(header).toHaveAttribute('data-header-state', 'compact');

  const faqLink = page.getByTestId('site-header').locator('nav').first().locator('a[href="#faq"]');
  await faqLink.click();

  const indicator = page.getByTestId('nav-active-indicator');
  await expect(faqLink).toHaveAttribute('data-active', 'true');
  await expect
    .poll(async () =>
      indicator.evaluate((el) => Number.parseFloat(window.getComputedStyle(el).opacity)),
    )
    .toBeGreaterThan(0);

  const faqAccordion = page.getByTestId('faq-accordion');
  await expect(faqAccordion).toHaveAttribute('data-motion-faq', 'cinematic');
  await expect(page.locator('#faq [data-motion-item="glow"][data-open="true"]').first()).toBeVisible();

  await page.locator('#services').scrollIntoViewIfNeeded();
  const foodTruckImage = page.locator('[data-service-id="food-trucks"] [data-motion-image="true"]').first();
  const cottonImage = page.locator('[data-service-id="cotton-candy"] [data-motion-image="true"]').first();
  const truckAnimation = await foodTruckImage.evaluate((el) => window.getComputedStyle(el).animationName);
  const cottonAnimation = await cottonImage.evaluate((el) => window.getComputedStyle(el).animationName);

  expect(truckAnimation).not.toBe('none');
  expect(cottonAnimation).not.toBe('none');
});

test('clicked desktop nav item stays active during smooth anchor scroll', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const nav = page.getByTestId('site-header').locator('nav').first();
  const contactLink = nav.locator('a[href="#contact"]');

  await contactLink.click();
  await expect(contactLink).toHaveAttribute('data-active', 'true');
  const samples: string[] = [];

  for (const delay of [50, 300, 500, 800]) {
    await page.waitForTimeout(delay === 50 ? 50 : delay - [50, 300, 500, 800][[50, 300, 500, 800].indexOf(delay) - 1]);
    const activeHref = await nav.locator('a[data-active="true"]').first().getAttribute('href');
    samples.push(activeHref ?? '');
  }

  expect(samples).toEqual(['#contact', '#contact', '#contact', '#contact']);
});
