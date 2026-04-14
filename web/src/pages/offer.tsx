import { LegalPageLayout } from '../components/legal/LegalPageLayout';
import { siteConfig } from '../content';

export default function OfferPage() {
  return <LegalPageLayout document={siteConfig.legal.documents.offer} />;
}
