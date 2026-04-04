import { render } from './entry-server';

test('server entry renders the landing route into HTML for SEO', () => {
  const html = render('/');

  expect(html).toContain('Party Time');
  expect(html).toContain('Почувствуй атмосферу праздника');
  expect(html).toContain('data-testid="section-hero"');
});
