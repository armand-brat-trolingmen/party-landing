import { render } from './entry-server';

test('server entry renders landing HTML and exposes helmet head tags for SSG', () => {
  const result = render('/');

  expect(result.appHtml).toContain('Party Time');
  expect(result.appHtml).toContain('data-testid="section-hero"');
  expect(result.helmet.title).toContain('<title');
  expect(result.helmet.title).toContain('Party Time');
  expect(result.helmet.meta).toContain('name="description"');
  expect(result.helmet.meta).toContain('property="og:title"');
  expect(result.helmet.meta).toContain('name="twitter:card"');
  expect(result.helmet.link).toContain('rel="canonical"');
  expect(result.helmet.script).toContain('application/ld+json');
  expect(result.helmet.script).toContain('"@type":"Organization"');
  expect(result.helmet.script).toContain('"@type":"WebSite"');
  expect(result.helmet.script).toContain('"@type":"Service"');
});
