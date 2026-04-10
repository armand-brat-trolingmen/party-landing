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
  return (
    <script
      type="application/ld+json"
      data-structured-data="true"
      dangerouslySetInnerHTML={{ __html: serializeStructuredData(data) }}
    />
  );
}
