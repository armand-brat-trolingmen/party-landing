import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router';
import {
  DEFAULT_LOCALE,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_TYPE,
  DEFAULT_OG_IMAGE_WIDTH,
  SITE_NAME,
  toAbsoluteUrl,
} from '../config/seo';

type SEOProps = {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  imageAlt?: string;
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
  imageAlt = DEFAULT_OG_IMAGE_ALT,
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
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:width" content={String(DEFAULT_OG_IMAGE_WIDTH)} />
      <meta property="og:image:height" content={String(DEFAULT_OG_IMAGE_HEIGHT)} />
      <meta property="og:image:type" content={DEFAULT_OG_IMAGE_TYPE} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={DEFAULT_LOCALE} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={imageAlt} />
    </Helmet>
  );
}
