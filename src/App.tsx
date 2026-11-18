import { Route, Routes } from 'react-router';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { PatternRoute } from './pages/PatternRoute';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="explore/:slug" element={<PatternRoute />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
