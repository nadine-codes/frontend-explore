import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import { TiltThumbnail } from './tilt-hover/TiltThumbnail';

export interface Pattern {
  /** URL segment: /explore/:slug */
  slug: string;
  number: string;
  title: string;
  category: string;
  /** One line for the gallery card. */
  summary: string;
  /** Front-end skills the pattern shows off. */
  tags: string[];
  added: string;
  /** Small illustration for the gallery card. */
  Thumbnail: ComponentType;
  /** The in-depth page, loaded only when someone opens it. */
  Page: LazyExoticComponent<ComponentType>;
}

/**
 * Every pattern on the site. To add one: make a folder in src/patterns/,
 * then add an entry here. The gallery and routes pick it up automatically.
 */
export const patterns: Pattern[] = [
  {
    slug: '3d-tilt-hover',
    number: '01',
    title: '3D tilt hover',
    category: 'Hover micro-interaction · motion',
    summary: 'A card that tips toward your pointer in 3D, with glare and floating layers, then eases back to flat.',
    tags: ['React', 'TypeScript', 'Custom hook', 'CSS 3D transforms'],
    added: '2026-11-18',
    Thumbnail: TiltThumbnail,
    Page: lazy(() => import('./tilt-hover/TiltHoverPage')),
  },
];

export function findPattern(slug: string | undefined): Pattern | undefined {
  return patterns.find((pattern) => pattern.slug === slug);
}
