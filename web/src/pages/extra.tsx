import { useParams } from 'react-router';
import { OfferingPageTemplate } from '../components/pages/OfferingPageTemplate';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { SiteShell } from '../components/layout/SiteShell';
import { findExtraBySlug } from '../content';
import { getOfferingStructuredData } from '../config/seo';
import NotFoundPage from './404';

export default function ExtraPage() {
  const { slug } = useParams();
  const extra = slug ? findExtraBySlug(slug) : undefined;

  if (!extra) {
    return <NotFoundPage />;
  }

  return (
    <>
      <SEO title={extra.seoTitle} description={extra.seoDescription} canonical={`/extras/${extra.slug}`} />
      <StructuredData data={getOfferingStructuredData(extra)} />
      <SiteShell motionPath="story-trail">
        <OfferingPageTemplate offering={extra} />
      </SiteShell>
    </>
  );
}
