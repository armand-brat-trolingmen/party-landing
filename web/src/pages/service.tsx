import { useParams } from 'react-router';
import { OfferingPageTemplate } from '../components/pages/OfferingPageTemplate';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { SiteShell } from '../components/layout/SiteShell';
import { findServiceBySlug } from '../content';
import { getOfferingStructuredData } from '../config/seo';
import NotFoundPage from './404';

export default function ServicePage() {
  const { slug } = useParams();
  const service = slug ? findServiceBySlug(slug) : undefined;

  if (!service) {
    return <NotFoundPage />;
  }

  return (
    <>
      <SEO title={service.seoTitle} description={service.seoDescription} canonical={`/services/${service.slug}`} />
      <StructuredData data={getOfferingStructuredData(service)} />
      <SiteShell>
        <OfferingPageTemplate offering={service} typeLabel="Основная услуга" />
      </SiteShell>
    </>
  );
}
