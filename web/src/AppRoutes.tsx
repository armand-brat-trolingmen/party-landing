import { Route, Routes } from 'react-router';
import IndexPage from './pages';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="*" element={<IndexPage />} />
    </Routes>
  );
}
