import { render, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { StructuredData } from './StructuredData';

test('StructuredData writes valid JSON-LD into the document head', async () => {
  render(
    <HelmetProvider>
      <StructuredData
        data={[
          {
            '@type': 'Organization',
            name: 'Праздник каждый день',
            url: 'https://partylanding.vercel.app/',
          },
          {
            '@type': 'WebSite',
            name: 'Праздник каждый день',
            url: 'https://partylanding.vercel.app/',
          },
        ]}
      />
    </HelmetProvider>,
  );

  await waitFor(() => {
    expect(document.head.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });

  const scriptContent = document.head.querySelector('script[type="application/ld+json"]')?.textContent ?? '';
  const parsed = JSON.parse(scriptContent) as {
    '@context': string;
    '@graph': Array<{ '@type': string }>;
  };

  expect(parsed['@context']).toBe('https://schema.org');
  expect(parsed['@graph']).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ '@type': 'Organization' }),
      expect.objectContaining({ '@type': 'WebSite' }),
    ]),
  );
});

