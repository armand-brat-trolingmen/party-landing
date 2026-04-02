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
  const nav = page.getByRole('navigation', { name: 'Основная навигация' }).first();
  await expect(nav).toBeVisible();

  const checks = [
    { id: 'services', link: 'Услуги', heading: 'Услуги' },
    { id: 'about', link: 'О нас', heading: 'О нас' },
    { id: 'reviews', link: 'Отзывы', heading: 'Отзывы' },
    { id: 'faq', link: 'Частые вопросы', heading: 'Частые вопросы' },
    { id: 'contact', link: 'Контакты', heading: 'Контакты' },
  ] as const;

  for (const item of checks) {
    await nav.getByRole('link', { name: item.link }).click();

    const heading = page.getByRole('heading', { level: 2, name: item.heading }).first();
    await expect(heading).toBeVisible();

    await expect
      .poll(async () => {
        const box = await heading.boundingBox();
        if (!box) return -1;
        return box.y;
      })
      .toBeGreaterThan(h - 2);

    await expect
      .poll(async () => {
        const box = await heading.boundingBox();
        if (!box) return Number.POSITIVE_INFINITY;
        return box.y;
      })
      .toBeLessThan(h + 280);

    await expect.poll(async () => panelTopGap(page, item.id)).toBeGreaterThan(8);
    await expect.poll(async () => panelTopGap(page, item.id)).toBeLessThan(56);
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

  const mobileNav = page.getByRole('navigation', { name: 'Основная навигация' });
  await expect(mobileNav).toBeVisible();

  await mobileNav.locator('a[href="#reviews"]').click();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('navigation', { name: 'Основная навигация' })).toHaveCount(0);
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
