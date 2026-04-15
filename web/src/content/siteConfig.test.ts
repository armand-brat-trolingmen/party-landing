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
  const firstService = siteConfig.services[0];

  expect(firstService).toBeDefined();
  expect(firstService.price?.from).toBe(12000);
  expect(firstService.price?.display).toBe('от 12.000 ₽');
});

test('services expose dedicated page tariff content without changing the homepage catalog contract', () => {
  const combo = siteConfig.services.find((service) => service.slug === 'cotton-candy-popcorn');
  const cottonCandy = siteConfig.services.find((service) => service.slug === 'cotton-candy');
  const chocolateFountain = siteConfig.services.find((service) => service.slug === 'chocolate-fountain');
  const champagnePyramid = siteConfig.services.find((service) => service.slug === 'champagne-pyramid');
  const foamCannon = siteConfig.services.find((service) => service.slug === 'foam-cannon');
  const caramelApples = siteConfig.services.find((service) => service.slug === 'caramel-apples');

  expect(combo?.name).toBe('Сахарная вата + попкорн');
  expect(siteConfig.services.map((service) => service.name)).not.toContain('Сладкая вата + попкорн');
  expect(cottonCandy?.servicePage?.tariffs).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ title: '2 часа', price: '12.000 ₽' }),
      expect.objectContaining({ title: '4 часа', price: '21.000 ₽' }),
    ]),
  );
  expect(cottonCandy?.servicePage?.tariffs[2].note).toBeUndefined();
  expect(cottonCandy?.servicePage?.duration).toBe('2 часа');
  expect(cottonCandy?.servicePage?.notes).toContain('Цветная сахарная вата +1.000 ₽ к стоимости');
  expect(combo?.servicePage?.notes).toContain('Цветная сахарная вата +1.000 ₽ к стоимости');
  expect(chocolateFountain?.servicePage?.duration).toBe('1 час');
  expect(chocolateFountain?.servicePage?.comboBadge?.label).toBe('Комбо −20%');
  expect(chocolateFountain?.servicePage?.packages?.[0].items).toContain('2.5 кг бельгийского шоколада Barry Callebaut');
  expect(champagnePyramid?.servicePage?.duration).toBe('1 час');
  expect(champagnePyramid?.servicePage?.delivery.moscow).toBe('Москва — 3.500 ₽');
  expect(champagnePyramid?.servicePage?.packages).toBeUndefined();
  expect(champagnePyramid?.servicePage?.included).toContain(
    'Качественные бокалы, которые подчеркнут изысканность вашего праздника',
  );
  expect(foamCannon?.servicePage?.materials.join(' ')).not.toMatch(/сервировк|ингредиент/i);
  expect(foamCannon?.servicePage?.materials).toEqual([
    'Подготовка рабочей зоны под формат мероприятия',
    'Расходные материалы и инвентарь для комфортной работы',
    'Оборудование и материалы под выбранный тариф',
  ]);
  expect(foamCannon?.homeCardImage?.objectFit).toBe('contain');
  expect(caramelApples?.price?.from).toBe(12500);
  expect(caramelApples?.price?.display).toBe('от 12.500 ₽');
  expect(caramelApples?.homeCardImage?.fallbackSrc).toBe('/images/services-home/caramel-apples-ui.png');
  expect(caramelApples?.servicePage?.tariffs).toEqual([
    expect.objectContaining({
      title: '50 порций',
      subtitle: '1 час',
      price: '12.500 ₽',
    }),
    expect.objectContaining({
      title: '100 порций',
      subtitle: '2 часа',
      price: '22.000 ₽',
    }),
    expect.objectContaining({
      title: '150 порций',
      subtitle: '3 часа',
      price: '31.500 ₽',
    }),
  ]);
  expect(caramelApples?.servicePage?.notes).toBeUndefined();
});

test('extras expose only the current additional service catalog', () => {
  expect(siteConfig.extras).toHaveLength(3);
  expect(siteConfig.extras.map((extra) => extra.name)).toEqual([
    'Брендирование тележки для кейтеринга',
    'Аренда оборудования',
    'Станция плова',
  ]);
  expect(siteConfig.extras.find((extra) => extra.slug === 'branded-cart')?.visual).toMatchObject({
    image: '/images/extras/branding-ui.png',
    imageWebpSrcSet: '/images/extras/branding.webp',
  });
  expect(siteConfig.extras.find((extra) => extra.slug === 'equipment-rental')?.visual).toMatchObject({
    image: '/images/extras/equipment-ui.png',
    imageWebpSrcSet: '/images/extras/equipment-ui.webp',
  });
  expect(siteConfig.extras.find((extra) => extra.slug === 'plov-station')?.visual).toMatchObject({
    image: '/images/extras/plov-ui.png',
    imageWebpSrcSet: '/images/extras/plov-ui.webp',
  });
});

test('not found content is centralized and Russian', () => {
  expect(siteConfig.notFound.title).toBe('Страница не найдена');
  expect(siteConfig.notFound.primaryAction.href).toBe('/');
  expect(siteConfig.notFound.seoTitle).toContain(siteConfig.brand.name);
});
