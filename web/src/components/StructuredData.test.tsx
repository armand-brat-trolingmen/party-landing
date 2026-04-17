import { render, screen } from '@testing-library/react';
import { StructuredData } from './StructuredData';

test('StructuredData renders stable JSON-LD markup for SSR hydration', () => {
  render(
    <StructuredData
      data={[
        {
          '@type': 'Organization',
          name: 'Праздник каждый день',
          url: 'https://party-everyday.ru/',
        },
        {
          '@type': 'WebSite',
          name: 'Праздник каждый день',
          url: 'https://party-everyday.ru/',
        },
      ]}
    />,
  );

  const structuredDataNode = document.querySelector('script[type="application/ld+json"][data-structured-data="true"]');
  expect(structuredDataNode).not.toBeNull();
  expect(screen.queryByText('Праздник каждый день')).not.toBeInTheDocument();

  const scriptContent = structuredDataNode?.textContent ?? '';
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
