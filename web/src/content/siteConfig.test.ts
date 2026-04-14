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

test('services expose dedicated page tariff content without changing the homepage catalog contract', () => {
  const combo = siteConfig.services.find((service) => service.slug === 'cotton-candy-popcorn');
  const cottonCandy = siteConfig.services.find((service) => service.slug === 'cotton-candy');
  const chocolateFountain = siteConfig.services.find((service) => service.slug === 'chocolate-fountain');
  const champagnePyramid = siteConfig.services.find((service) => service.slug === 'champagne-pyramid');
  const foamCannon = siteConfig.services.find((service) => service.slug === 'foam-cannon');

  expect(combo?.name).toBe('Сахарная вата + попкорн');
  expect(siteConfig.services.map((service) => service.name)).not.toContain('Сладкая вата + попкорн');
  expect(cottonCandy?.servicePage?.tariffs).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ title: '2 часа', price: '12.000 ₽' }),
      expect.objectContaining({ title: '4 часа', price: '21.000 ₽' }),
    ]),
  );
  expect(cottonCandy?.servicePage?.tariffs[2].note).toBeUndefined();
  expect(cottonCandy?.servicePage?.notes).toContain('Цветная сахарная вата +1.000 ₽ к стоимости');
  expect(combo?.servicePage?.notes).toContain('Цветная сахарная вата +1.000 ₽ к стоимости');
  expect(chocolateFountain?.servicePage?.comboBadge?.label).toBe('Комбо −20%');
  expect(chocolateFountain?.servicePage?.packages?.[0].items).toContain('2.5 кг бельгийского шоколада Barry Callebaut');
  expect(champagnePyramid?.servicePage?.recommendedAge).toBe('18+ 😂');
  expect(champagnePyramid?.servicePage?.delivery.moscow).toBe('Доставка в пределах МКАД — бесплатно');
  expect(champagnePyramid?.servicePage?.packages).toBeUndefined();
  expect(champagnePyramid?.servicePage?.included).toContain('Качественные бокалы, которые подчеркнут изысканность вашего праздника');
  expect(foamCannon?.servicePage?.materials.join(' ')).not.toMatch(/сервировк|ингредиент/i);
  expect(foamCannon?.servicePage?.materials).toEqual([
    'Подготовка рабочей зоны под формат мероприятия',
    'Расходные материалы и инвентарь для комфортной работы',
    'Оборудование и материалы под выбранный тариф',
  ]);
  expect(foamCannon?.homeCardImage?.objectFit).toBe('contain');
  expect(foamCannon?.shortDescription).not.toMatch(/welcome|street-food|тренд/i);
  expect(champagnePyramid?.shortDescription).not.toMatch(/welcome|street-food|тренд/i);
  expect(siteConfig.services.map((service) => service.fullDescription).join(' ')).not.toMatch(/welcome|street-food|тренд/i);
});

test('extras expose only the current additional service catalog', () => {
  expect(siteConfig.extras).toHaveLength(2);
  expect(siteConfig.extras.map((extra) => extra.name)).toEqual([
    'Брендирование тележки для кейтеринга',
    'Аренда оборудования',
  ]);
  expect(siteConfig.extras.find((extra) => extra.slug === 'branded-cart')?.visual.image).toBe('/images/extras/branding.webp');
  expect(siteConfig.extras.find((extra) => extra.slug === 'equipment-rental')?.visual.image).toBe('/images/extras/equipment.webp');
});

test('not found content is centralized and Russian', () => {
  expect(siteConfig.notFound.title).toBe('Страница не найдена');
  expect(siteConfig.notFound.primaryAction.href).toBe('/');
  expect(siteConfig.notFound.seoTitle).toContain(siteConfig.brand.name);
});
