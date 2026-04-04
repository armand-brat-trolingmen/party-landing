import { render, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router';
import { SEO } from './SEO';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '../config/seo';

test('SEO writes title and key meta tags in client mode', async () => {
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/']}>
        <SEO
          title="Party Time — фудтраки и сладкая вата для праздников"
          description="Кейтеринг для праздников в Москве и области."
        />
      </MemoryRouter>
    </HelmetProvider>,
  );

  await waitFor(() => {
    expect(document.title).toBe('Party Time — фудтраки и сладкая вата для праздников');
  });

  expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
    'Кейтеринг для праздников в Москве и области.',
  );
  expect(document.head.querySelector('meta[property="og:site_name"]')?.getAttribute('content')).toBe(SITE_NAME);
  expect(document.head.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe(`${SITE_URL}/`);
  expect(document.head.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(DEFAULT_OG_IMAGE);
  expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(`${SITE_URL}/`);
  expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
    'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  );
});
