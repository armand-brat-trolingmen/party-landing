import { siteConfig } from './index';

test('siteConfig exposes the required top-level content domains', () => {
  expect(siteConfig).toHaveProperty('brand');
  expect(siteConfig).toHaveProperty('contacts');
  expect(siteConfig).toHaveProperty('navigation');
  expect(siteConfig).toHaveProperty('homepage');
  expect(siteConfig).toHaveProperty('services');
  expect(siteConfig).toHaveProperty('extras');
  expect(siteConfig).toHaveProperty('legal');
  expect(siteConfig).toHaveProperty('notFound');
  expect(siteConfig).toHaveProperty('seo');
});

test('contacts expose raw, display, and href-ready values', () => {
  expect(siteConfig.contacts.phone.raw).toBe('+79263919225');
  expect(siteConfig.contacts.phone.href).toBe('tel:+79263919225');
  expect(siteConfig.contacts.email.raw).toBe('Glad_2015@bk.ru');
  expect(siteConfig.contacts.email.href).toBe('mailto:Glad_2015@bk.ru');
});

test('services expose centralized normalized price values', () => {
  const firstService = (
    siteConfig.services as readonly {
      price?: {
        from: number;
        display: string;
      };
    }[]
  )[0];

  expect(firstService).toBeDefined();
  expect(firstService.price?.from).toBe(12000);
  expect(firstService.price?.display).toBe('от 12.000 ₽');
});

test('not found content is centralized and Russian', () => {
  expect(siteConfig.notFound.title).toBe('Страница не найдена');
  expect(siteConfig.notFound.primaryAction.href).toBe('/');
  expect(siteConfig.notFound.seoTitle).toContain(siteConfig.brand.name);
});
