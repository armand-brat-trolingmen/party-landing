import { render } from './entry-server';

test('server entry renders landing HTML and exposes helmet head tags for SSG', () => {
  const result = render('/');

  expect(result.appHtml).toContain('Праздник каждый день');
  expect(result.appHtml).toContain('data-testid="section-hero"');
  expect(result.helmet.title).toContain('<title');
  expect(result.helmet.title).toContain('Праздник каждый день');
  expect(result.helmet.meta).toContain('name="description"');
  expect(result.helmet.meta).toContain('property="og:title"');
  expect(result.helmet.meta).toContain('name="twitter:card"');
  expect(result.helmet.link).toContain('rel="canonical"');
  expect(result.helmet.link).toContain('rel="preload"');
  expect(result.helmet.link).toContain('as="image"');
  expect(result.helmet.link).toContain('/images/hero/hero-main.png');
  expect(result.appHtml).toContain('application/ld+json');
  expect(result.appHtml).toContain('"@type":"Organization"');
  expect(result.appHtml).toContain('"@type":"WebSite"');
  expect(result.appHtml).toContain('"@type":"Service"');
});

