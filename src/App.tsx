import { Route, Routes } from 'react-router';
import { SiteLayout } from './site/SiteLayout';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { PatternRoute } from './pages/PatternRoute';
import { NotFoundPage } from './pages/NotFoundPage';
import { DocsPage } from './pages/docs/DocsPage';

export function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="explore/:slug" element={<PatternRoute />} />
        <Route path="docs" element={<DocsPage />} />
        <Route path="docs/:slug" element={<DocsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
