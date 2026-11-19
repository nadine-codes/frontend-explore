import type { ControlsManifest } from '../playground/manifest';

/** registry/patterns/<slug>.json, authored by hand. Selection fields arrive in Phase 1. */
export interface PatternRecord {
  slug: string;
  /** Two digits, sets the order: "01". */
  number: string;
  title: string;
  category: string;
  /** One line for the gallery card. */
  summary: string;
  /** Front-end skills the pattern shows off. */
  tags: string[];
  aliases: string[];
  /** ISO date. */
  added: string;
}

const records = import.meta.glob<PatternRecord>('../../registry/patterns/*.json', { eager: true, import: 'default' });
const manifests = import.meta.glob<ControlsManifest>('../../registry/controls/*.json', {
  eager: true,
  import: 'default',
});

/** Every pattern, in number order. */
export const patterns: PatternRecord[] = Object.values(records).sort((a, b) => a.number.localeCompare(b.number));

const manifestBySlug = new Map(Object.values(manifests).map((manifest) => [manifest.pattern, manifest]));

for (const pattern of patterns) {
  if (!manifestBySlug.has(pattern.slug)) throw new Error(`No controls manifest for pattern "${pattern.slug}"`);
}

export function findPattern(slug: string | undefined): PatternRecord | undefined {
  return patterns.find((pattern) => pattern.slug === slug);
}

export function controlsFor(slug: string): ControlsManifest {
  const manifest = manifestBySlug.get(slug);
  if (!manifest) throw new Error(`No controls manifest for pattern "${slug}"`);
  return manifest;
}
