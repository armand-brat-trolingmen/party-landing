import { Route, Routes } from 'react-router';
import IndexPage from './pages';
import ConsentPage from './pages/consent';
import ExtraPage from './pages/extra';
import PrivacyPage from './pages/privacy';
import ServicePage from './pages/service';
import TermsPage from './pages/terms';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/services/:slug" element={<ServicePage />} />
      <Route path="/extras/:slug" element={<ExtraPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/consent" element={<ConsentPage />} />
      <Route path="*" element={<IndexPage />} />
    </Routes>
  );
}
