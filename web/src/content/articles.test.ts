import { services } from './offerings';
import {
  articleImages,
  articles,
  findArticleBySlug,
  getAllArticleUrls,
  getArticlePath,
  getArticleTextContent,
} from './articles';

const serviceSlugs = new Set(services.map((service) => service.slug));

test('articles expose the initial SEO package with stable URLs', () => {
  expect(articles.map((article) => article.slug)).toEqual([
    'kak-vybrat-food-station',
    'sladkie-stancii-na-detskiy-prazdnik',
    'arenda-fudtraka-na-meropriyatie',
  ]);

  expect(getAllArticleUrls()).toEqual([
    '/articles/arenda-fudtraka-na-meropriyatie',
    '/articles/kak-vybrat-food-station',
    '/articles/sladkie-stancii-na-detskiy-prazdnik',
  ]);

  expect(getArticlePath(articles[0])).toBe('/articles/kak-vybrat-food-station');
  expect(findArticleBySlug('arenda-fudtraka-na-meropriyatie')?.h1).toBe('Аренда фудтрака на мероприятие');
});

test('article visuals are centralized for future image replacement', () => {
  expect(articleImages.foodStationGuide.src).toBe('/images/service-galleries/chocolate-fountain/image-01-960.webp');
  expect(articleImages.kidsSweetStations.src).toBe('/images/service-galleries/cotton-candy-popcorn/image-05-960.webp');
  expect(articleImages.foodTruckRental.src).toBe('/images/food-trucks/food-truck-1.webp');

  articles.forEach((article) => {
    expect(article.heroImage).toEqual(
      expect.objectContaining({
        src: expect.stringMatching(/^\/images\//),
        fallbackSrc: expect.stringMatching(/^\/images\//),
        alt: expect.any(String),
        width: expect.any(Number),
        height: expect.any(Number),
      }),
    );
    expect(article.serviceIcon).toMatch(/foodStation|sweetStation|foodTruck/);
  });
});

test('articles are dense enough and link only to existing service pages', () => {
  articles.forEach((article) => {
    expect(article.title).toContain('Праздник каждый день');
    expect(article.description.length).toBeLessThanOrEqual(170);
    expect(article.sections.length).toBeGreaterThanOrEqual(6);
    expect(article.faq.length).toBeGreaterThanOrEqual(3);
    expect(getArticleTextContent(article).length).toBeGreaterThanOrEqual(4500);
    expect(getArticleTextContent(article)).not.toMatch(/[A-Za-z]/);

    article.relatedServiceSlugs.forEach((slug) => {
      expect(serviceSlugs.has(slug)).toBe(true);
    });
  });
});
