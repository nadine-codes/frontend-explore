import { Suspense } from 'react';
import { useParams } from 'react-router';
import { findPattern } from '../lib/registry';
import { views } from '../patterns';
import { NotFoundPage } from './NotFoundPage';

/** /explore/:slug looks up the pattern and loads its page. */
export function PatternRoute() {
  const { slug } = useParams();
  const pattern = findPattern(slug);
  const view = pattern && views[pattern.slug];
  if (!view) return <NotFoundPage />;

  const { Page } = view;
  return (
    <Suspense fallback={<p className="fe-loading mono">Warping in…</p>}>
      <Page />
    </Suspense>
  );
}
