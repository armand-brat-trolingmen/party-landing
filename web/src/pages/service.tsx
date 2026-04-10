import { Navigate, useParams } from 'react-router';
import { OfferingPageTemplate } from '../components/pages/OfferingPageTemplate';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { SiteShell } from '../components/layout/SiteShell';
import { findServiceBySlug } from '../content';
import { getOfferingStructuredData } from '../config/seo';

export default function ServicePage() {
  const { slug } = useParams();
  const service = slug ? findServiceBySlug(slug) : undefined;

  if (!service) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <SEO title={service.seoTitle} description={service.seoDescription} canonical={`/services/${service.slug}`} />
      <StructuredData data={getOfferingStructuredData(service)} />
      <SiteShell motionPath="story-trail">
        <OfferingPageTemplate offering={service} typeLabel="Основная услуга" />
      </SiteShell>
    </>
  );
}
