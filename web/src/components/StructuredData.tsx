import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

type StructuredDataEntity = Record<string, unknown>;
type StructuredDataInput = StructuredDataEntity | StructuredDataEntity[];

function stripContext(entity: StructuredDataEntity) {
  const rest = { ...entity };
  delete rest['@context'];
  return rest;
}

function normalizeStructuredData(data: StructuredDataInput) {
  if (Array.isArray(data)) {
    return {
      '@context': 'https://schema.org',
      '@graph': data.map(stripContext),
    };
  }

  if ('@context' in data) {
    return data;
  }

  return {
    '@context': 'https://schema.org',
    ...data,
  };
}

function serializeStructuredData(data: StructuredDataInput) {
  return JSON.stringify(normalizeStructuredData(data))
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

type StructuredDataProps = {
  data: StructuredDataInput;
};

export function StructuredData({ data }: StructuredDataProps) {
  const json = serializeStructuredData(data);

  useEffect(() => {
    const existingScript = [...document.head.querySelectorAll('script[type="application/ld+json"]')].find(
      (node) => node.textContent === json,
    );

    if (existingScript) {
      return undefined;
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-structured-data', 'true');
    script.text = json;
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [json]);

  return (
    <Helmet
      script={[
        {
          type: 'application/ld+json',
          innerHTML: json,
        },
      ]}
    />
  );
}
