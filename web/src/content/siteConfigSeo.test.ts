import { siteConfig } from './index';
import { heroPosterSlides } from './homepage';

test('offering SEO copy stays Russian and query-focused for Moscow', () => {
  const chocolateFountain = siteConfig.services.find((service) => service.slug === 'chocolate-fountain');
  const brandedCart = siteConfig.extras.find((extra) => extra.slug === 'branded-cart');
  const frenchHotDog = siteConfig.services.find((service) => service.slug === 'french-hot-dog');
  const allOfferings = [...siteConfig.services, ...siteConfig.extras];

  expect(chocolateFountain?.seoTitle).toBe('Шоколадный фонтан в Москве на мероприятие | Праздник каждый день');
  expect(chocolateFountain?.seoDescription).toContain('Шоколадный фонтан в Москве');
  expect(brandedCart?.seoTitle).toBe('Брендирование тележки для кейтеринга в Москве | Праздник каждый день');
  expect(brandedCart?.seoDescription).toContain('Брендирование тележки для кейтеринга в Москве');
  expect(allOfferings.every((offering) => offering.seoDescription.length <= 165)).toBe(true);
  expect(heroPosterSlides.every((slide) => !/party landing|chocolate fountain/i.test(slide.alt))).toBe(true);
  expect(frenchHotDog?.shortDescription).not.toMatch(/street-food/i);
});
