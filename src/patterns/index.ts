import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import { patterns } from '../lib/registry';
import { TiltThumbnail } from './3d-tilt-hover/Thumbnail';
import { OrbitThumbnail } from './orbit-animation/Thumbnail';

/** The UI for each registry record: a gallery thumbnail and a page that loads on demand. */
interface PatternView {
  Thumbnail: ComponentType;
  Page: LazyExoticComponent<ComponentType>;
}

export const views: Record<string, PatternView> = {
  '3d-tilt-hover': { Thumbnail: TiltThumbnail, Page: lazy(() => import('./3d-tilt-hover/Page')) },
  'orbit-animation': { Thumbnail: OrbitThumbnail, Page: lazy(() => import('./orbit-animation/Page')) },
};

for (const pattern of patterns) {
  if (!views[pattern.slug]) throw new Error(`No page for pattern "${pattern.slug}". Add it to src/patterns/index.ts.`);
}
