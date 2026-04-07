import { LegalPageLayout } from '../components/legal/LegalPageLayout';
import { legalDocuments } from '../data/footerContent';

export default function PrivacyPage() {
  return <LegalPageLayout document={legalDocuments.privacy} />;
}
