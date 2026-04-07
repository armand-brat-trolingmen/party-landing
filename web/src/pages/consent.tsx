import { LegalPageLayout } from '../components/legal/LegalPageLayout';
import { legalDocuments } from '../data/footerContent';

export default function ConsentPage() {
  return <LegalPageLayout document={legalDocuments.consent} />;
}
