import { Navigate, useParams } from 'react-router';
import { OfferingPageTemplate } from '../components/pages/OfferingPageTemplate';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { SiteShell } from '../components/layout/SiteShell';
import { findExtraBySlug } from '../data/catalogContent';
import { getOfferingStructuredData } from '../config/seo';

export default function ExtraPage() {
  const { slug } = useParams();
  const extra = slug ? findExtraBySlug(slug) : undefined;

  if (!extra) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <SEO title={extra.seoTitle} description={extra.seoDescription} canonical={`/extras/${extra.slug}`} />
      <StructuredData data={getOfferingStructuredData(extra)} />
      <SiteShell motionPath="story-trail">
        <OfferingPageTemplate offering={extra} typeLabel="Дополнительная услуга" />
      </SiteShell>
    </>
  );
}
