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

test('mobile menu is a proper disclosure, closes after clicking a link, and lands the section cleanly', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const menuButton = page.getByRole('button', { name: /^Меню$/ });
  await expect(menuButton).toBeVisible();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');

  await menuButton.click();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

  const mobileNav = page.getByRole('navigation', { name: 'Основная навигация' });
  await expect(mobileNav).toBeVisible();

  await mobileNav.getByRole('link', { name: 'Отзывы' }).click();
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
