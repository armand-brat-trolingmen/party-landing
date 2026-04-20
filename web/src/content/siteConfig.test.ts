import { getOfferingPath, siteConfig } from './index';

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

test('service home card fallbacks stay on broadly supported raster formats', () => {
  const invalidFallbacks = siteConfig.services
    .filter((service) => service.homeCardImage)
    .filter((service) => /\.webp$/i.test(service.homeCardImage?.fallbackSrc ?? ''))
    .map((service) => ({
      slug: service.slug,
      fallbackSrc: service.homeCardImage?.fallbackSrc,
    }));

  expect(invalidFallbacks).toEqual([]);
});

test('contacts expose raw display and href-ready values', () => {
  expect(siteConfig.contacts.phone.raw).toBe('+79263919225');
  expect(siteConfig.contacts.phone.href).toBe('tel:+79263919225');
  expect(siteConfig.contacts.email.raw).toBe('Glad_2015@bk.ru');
  expect(siteConfig.contacts.email.href).toBe('mailto:Glad_2015@bk.ru');
});

test('services expose centralized normalized price values', () => {
  const firstService = siteConfig.services[0];

  expect(firstService).toBeDefined();
  expect(firstService.slug).toBe('chocolate-fountain');
  expect(firstService.price?.from).toBe(11500);
  expect(firstService.price?.display).toBe('от 11.500 ₽');
});

test('offering paths point to slash-final static pages', () => {
  expect(getOfferingPath({ kind: 'service', slug: 'chocolate-fountain' })).toBe('/services/chocolate-fountain/');
  expect(getOfferingPath({ kind: 'extra', slug: 'cart-rental' })).toBe('/extras/cart-rental/');
});

test('services expose dedicated page tariff content without changing the homepage catalog contract', () => {
  const combo = siteConfig.services.find((service) => service.slug === 'cotton-candy-popcorn');
  const cottonCandy = siteConfig.services.find((service) => service.slug === 'cotton-candy');
  const chocolateFountain = siteConfig.services.find((service) => service.slug === 'chocolate-fountain');
  const champagnePyramid = siteConfig.services.find((service) => service.slug === 'champagne-pyramid');
  const foamCannon = siteConfig.services.find((service) => service.slug === 'foam-cannon');
  const caramelApples = siteConfig.services.find((service) => service.slug === 'caramel-apples');
  const rollIceCream = siteConfig.services.find((service) => service.slug === 'roll-ice-cream');
  const scoopIceCream = siteConfig.services.find((service) => service.slug === 'scoop-ice-cream');
  const nitroIceCream = siteConfig.services.find((service) => service.slug === 'nitro-ice-cream');
  const frenchHotDog = siteConfig.services.find((service) => service.slug === 'french-hot-dog');
  const danishHotDog = siteConfig.services.find((service) => service.slug === 'danish-hot-dog');
  const teaStation = siteConfig.services.find((service) => service.slug === 'tea-station');
  const plovStation = siteConfig.services.find((service) => service.slug === 'plov-station');
  const discountNote =
    'При заказе Шоколадного фонтана и Пирамиды из шампанского, действует скидка 20% на услугу "Пирамида из шампанского".';

  expect(combo?.name).toBe('Сахарная вата + попкорн');
  expect(siteConfig.services.map((service) => service.name)).not.toContain('Сладкая вата + попкорн');
  expect(rollIceCream?.name).toBe('Ролл-мороженое');
  expect(scoopIceCream?.name).toBe('Шариковое мороженое');
  expect(nitroIceCream?.name).toBe('Азотное мороженое');
  expect(frenchHotDog?.name).toBe('Французский хот-дог');
  expect(danishHotDog?.name).toBe('Датский хот-дог');
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
  expect(chocolateFountain?.servicePage?.comboBadge).toBeUndefined();
  expect(chocolateFountain?.servicePage?.notes).toContain(discountNote);
  expect(chocolateFountain?.servicePage?.packages?.[0].items).toContain('2.5 кг бельгийского шоколада Barry Callebaut');

  expect(champagnePyramid?.servicePage?.duration).toBe('1 час');
  expect(champagnePyramid?.servicePage?.delivery.moscow).toBe('Москва — 3.500 ₽');
  expect(champagnePyramid?.servicePage?.comboBadge).toBeUndefined();
  expect(champagnePyramid?.servicePage?.notes).toContain(discountNote);
  expect(champagnePyramid?.servicePage?.packages).toBeUndefined();
  expect(champagnePyramid?.servicePage?.included).toContain(
    'Качественные бокалы, которые подчеркнут изысканность вашего праздника',
  );

  expect(foamCannon?.servicePage?.materials.join(' ')).not.toMatch(/сервировк|ингредиент/i);
  expect(foamCannon?.homeCardImage?.objectFit).toBe('contain');

  expect(caramelApples?.price?.from).toBe(15000);
  expect(caramelApples?.price?.display).toBe('от 15.000 ₽');
  expect(caramelApples?.homeCardImage?.fallbackSrc).toBe('/images/services-home/caramel-apples-ui.png');
  expect(caramelApples?.servicePage?.included).not.toContain('Подготовка станции');
  expect(caramelApples?.servicePage?.tariffs).toEqual([
    expect.objectContaining({
      title: '50 порций',
      subtitle: '1 час',
      price: '15.000 ₽',
    }),
    expect.objectContaining({
      title: '100 порций',
      subtitle: '2 часа',
      price: '27.000 ₽',
    }),
    expect.objectContaining({
      title: '150 порций',
      subtitle: '3 часа',
      price: '37.500 ₽',
    }),
  ]);
  expect(caramelApples?.servicePage?.notes).toBeUndefined();

  expect(teaStation?.price?.from).toBe(15000);
  expect(teaStation?.price?.display).toBe('от 15.000 ₽');
  expect(teaStation?.servicePage?.duration).toBeUndefined();
  expect(teaStation?.servicePage?.tariffs).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        title: 'Сбитень',
        variants: [
          { label: '100 порций', price: '20.000 ₽' },
          { label: '150 порций', price: '29.000 ₽' },
          { label: '200 порций', price: '34.000 ₽' },
        ],
      }),
      expect.objectContaining({
        title: 'Чайная станция "Стандарт"',
        variants: [
          { label: '100 порций', price: '15.000 ₽' },
          { label: '150 порций', price: '20.000 ₽' },
          { label: '200 порций', price: '26.000 ₽' },
        ],
      }),
      expect.objectContaining({
        title: 'Чайная станция с самоваром',
        variants: [
          { label: '100 порций', price: '25.000 ₽' },
          { label: '150 порций', price: '35.000 ₽' },
          { label: '200 порций', price: '44.000 ₽' },
        ],
      }),
      expect.objectContaining({
        title: 'Глинтвейн',
        sections: [
          {
            title: 'Безалкогольный',
            variants: [
              { label: '50 порций', price: '15.000 ₽' },
              { label: '100 порций', price: '25.000 ₽' },
              { label: '150 порций', price: '35.000 ₽' },
            ],
          },
          {
            title: 'Алкогольный',
            variants: [
              { label: '50 порций', price: '20.000 ₽' },
              { label: '100 порций', price: '34.000 ₽' },
              { label: '150 порций', price: '45.000 ₽' },
            ],
          },
        ],
      }),
    ]),
  );

  expect(plovStation?.price?.from).toBe(10000);
  expect(plovStation?.price?.display).toBe('от 10.000 ₽');
  expect(plovStation?.servicePage?.duration).toBeUndefined();
  expect(plovStation?.servicePage?.tariffs).toEqual([
    expect.objectContaining({
      title: 'Индивидуальный расчет',
      price: 'от 10.000 ₽',
    }),
  ]);
});

test('extras expose only the current additional service catalog', () => {
  expect(siteConfig.extras).toHaveLength(3);
  expect(siteConfig.extras.map((extra) => extra.name)).toEqual([
    'Брендирование тележки для кейтеринга',
    'Аренда оборудования',
    'Аренда тележек',
  ]);
  expect(siteConfig.extras.find((extra) => extra.slug === 'branded-cart')?.visual).toMatchObject({
    image: '/images/extras/branding-ui.png',
    imageWebpSrcSet: '/images/extras/branding-ui.webp',
  });
  expect(siteConfig.extras.find((extra) => extra.slug === 'equipment-rental')?.visual).toMatchObject({
    image: '/images/extras/equipment-ui.png',
    imageWebpSrcSet: '/images/extras/equipment-ui.webp',
  });
  expect(siteConfig.extras.find((extra) => extra.slug === 'cart-rental')?.visual).toMatchObject({
    image: '/images/extras/cart-rental-ui.png',
    imageWebpSrcSet: '/images/extras/cart-rental-ui.webp',
  });
  expect(siteConfig.extras.map((extra) => extra.slug)).not.toContain('plov-station');
});

test('not found content is centralized and Russian', () => {
  expect(siteConfig.notFound.title).toBe('Страница не найдена');
  expect(siteConfig.notFound.primaryAction.href).toBe('/');
  expect(siteConfig.notFound.seoTitle).toContain(siteConfig.brand.name);
});
