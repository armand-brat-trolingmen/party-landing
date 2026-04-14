import { LegalPageLayout } from '../components/legal/LegalPageLayout';
import { siteConfig } from '../content';

export default function CookiesPage() {
  return <LegalPageLayout document={siteConfig.legal.documents.cookies} />;
}
