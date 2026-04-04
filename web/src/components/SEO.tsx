import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router';
import { DEFAULT_LOCALE, DEFAULT_OG_IMAGE, SITE_NAME, toAbsoluteUrl } from '../config/seo';

type SEOProps = {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: string;
  noindex?: boolean;
};

function resolveRobotsContent(noindex: boolean) {
  return noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
}

export function SEO({
  title,
  description,
  canonical,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
}: SEOProps) {
  const location = useLocation();
  const canonicalUrl = toAbsoluteUrl(canonical ?? location.pathname);
  const imageUrl = toAbsoluteUrl(image);
  const robots = resolveRobotsContent(noindex);

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={DEFAULT_LOCALE} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}
