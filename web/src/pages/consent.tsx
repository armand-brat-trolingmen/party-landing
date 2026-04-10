import { LegalPageLayout } from '../components/legal/LegalPageLayout';
import { siteConfig } from '../content';

export default function ConsentPage() {
  return <LegalPageLayout document={siteConfig.legal.documents.consent} />;
}
