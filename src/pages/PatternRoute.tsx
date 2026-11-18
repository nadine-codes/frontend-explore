import { Suspense } from 'react';
import { useParams } from 'react-router';
import { findPattern } from '../patterns/registry';
import { NotFoundPage } from './NotFoundPage';

/** /explore/:slug, looks up the pattern and lazy-loads its page. */
export function PatternRoute() {
  const { slug } = useParams();
  const pattern = findPattern(slug);
  if (!pattern) return <NotFoundPage />;

  const { Page } = pattern;
  return (
    <Suspense fallback={<p className="loading mono">Warping in…</p>}>
      <Page />
    </Suspense>
  );
}
