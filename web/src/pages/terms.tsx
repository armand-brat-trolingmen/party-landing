import { LegalPageLayout } from '../components/legal/LegalPageLayout';
import { legalDocuments } from '../data/footerContent';

export default function TermsPage() {
  return <LegalPageLayout document={legalDocuments.terms} />;
}
