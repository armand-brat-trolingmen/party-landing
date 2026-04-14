import { Route, Routes } from 'react-router';
import NotFoundPage from './pages/404';
import CookiesPage from './pages/cookies';
import ExtraPage from './pages/extra';
import IndexPage from './pages';
import OfferPage from './pages/offer';
import PrivacyPage from './pages/privacy';
import ServicePage from './pages/service';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/services/:slug" element={<ServicePage />} />
      <Route path="/extras/:slug" element={<ExtraPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/offer" element={<OfferPage />} />
      <Route path="/cookies" element={<CookiesPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
