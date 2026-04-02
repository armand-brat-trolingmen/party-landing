import { test, expect, type Page } from '@playwright/test';

async function headerHeight(page: Page) {
  const header = page.getByRole('banner').first();
  const box = await header.boundingBox();
  return box?.height ?? 0;
}

test('anchor navigation lands with headings visible below the sticky header', async ({ page }) => {
  await page.goto('/');

  const header = page.getByRole('banner').first();
  await expect(header).toBeVisible();

  const h = await headerHeight(page);
  const viewportHeight = page.viewportSize()?.height ?? 800;
  const upperY = Math.min(h + 420, viewportHeight * 0.75);

  const nav = page.getByRole('navigation', { name: 'Основная навигация' }).first();
  await expect(nav).toBeVisible();

  const checks = [
    { link: 'Услуги', heading: 'Услуги' },
    { link: 'О нас', heading: 'О нас' },
    { link: 'Отзывы', heading: 'Отзывы' },
    { link: 'Частые вопросы', heading: 'Частые вопросы' },
    { link: 'Контакты', heading: 'Контакты' },
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
      .toBeLessThan(upperY);
  }
});

test('mobile menu is a proper disclosure and closes after clicking a link', async ({ page }) => {
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
