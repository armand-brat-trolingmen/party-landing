import { siteConfig } from '../content';
import { getHomeStructuredData, getOfferingStructuredData } from './seo';

test('home structured data exposes organization, local business and website entities for Moscow', () => {
  const graph = getHomeStructuredData();

  expect(graph).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ '@type': 'Organization' }),
      expect.objectContaining({ '@type': 'LocalBusiness' }),
      expect.objectContaining({ '@type': 'WebSite' }),
      expect.objectContaining({ '@type': 'Service' }),
    ]),
  );

  const localBusiness = graph.find((entry) => entry['@type'] === 'LocalBusiness');

  expect(localBusiness).toEqual(
    expect.objectContaining({
      telephone: siteConfig.contacts.phone.raw,
      email: siteConfig.contacts.email.raw,
      sameAs: siteConfig.contacts.socialLinks.map((link) => link.href),
      address: expect.objectContaining({
        '@type': 'PostalAddress',
        addressLocality: 'Королев',
        addressRegion: 'Московская область',
        addressCountry: 'RU',
      }),
    }),
  );
});

test('offering structured data includes local business context and breadcrumb navigation', () => {
  const offering = siteConfig.services.find((service) => service.slug === 'chocolate-fountain');

  expect(offering).toBeDefined();

  const graph = getOfferingStructuredData(offering!);

  expect(Array.isArray(graph)).toBe(true);
  expect(graph).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ '@type': 'LocalBusiness' }),
      expect.objectContaining({ '@type': 'BreadcrumbList' }),
      expect.objectContaining({ '@type': 'Service', name: offering?.name }),
    ]),
  );

  const breadcrumb = graph.find((entry) => entry['@type'] === 'BreadcrumbList');

  expect(breadcrumb).toEqual(
    expect.objectContaining({
      itemListElement: [
        expect.objectContaining({
          position: 1,
          name: siteConfig.brand.name,
          item: 'https://party-everyday.ru/',
        }),
        expect.objectContaining({
          position: 2,
          name: 'Услуги',
          item: 'https://party-everyday.ru/#services',
        }),
        expect.objectContaining({
          position: 3,
          name: offering?.name,
          item: `https://party-everyday.ru/services/${offering?.slug}`,
        }),
      ],
    }),
  );
});

test('extra structured data points breadcrumb collection links to a real homepage section', () => {
  const extra = siteConfig.extras.find((item) => item.slug === 'branded-cart');

  expect(extra).toBeDefined();

  const graph = getOfferingStructuredData(extra!);
  const breadcrumb = graph.find((entry) => entry['@type'] === 'BreadcrumbList');

  expect(breadcrumb).toEqual(
    expect.objectContaining({
      itemListElement: expect.arrayContaining([
        expect.objectContaining({
          position: 2,
          item: 'https://party-everyday.ru/#extras',
        }),
      ]),
    }),
  );
});
