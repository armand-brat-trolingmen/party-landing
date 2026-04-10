import { LegalPageLayout } from '../components/legal/LegalPageLayout';
import { siteConfig } from '../content';

export default function PrivacyPage() {
  return <LegalPageLayout document={siteConfig.legal.documents.privacy} />;
}
