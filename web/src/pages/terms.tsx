import { LegalPageLayout } from '../components/legal/LegalPageLayout';
import { siteConfig } from '../content';

export default function TermsPage() {
  return <LegalPageLayout document={siteConfig.legal.documents.terms} />;
}
