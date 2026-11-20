import type { ControlsManifest } from '../playground/manifest';

/** registry/patterns/<slug>.json, authored by hand. Field meanings: frontendexploreSPEC.md, "Pattern record". */
export interface PatternRecord {
  slug: string;
  /** Two digits, sets the order: "01". */
  number: string;
  title: string;
  /** Filterable category, such as "motion". */
  category: string;
  /** Longer display label for the kicker and gallery card. */
  label: string;
  /** One line for the gallery card. */
  summary: string;
  /** Front-end skills the pattern shows off. */
  tags: string[];
  aliases: string[];
  /** ISO date. */
  added: string;
  code: { dir: string; import: string };
  /** Authored links to concept notes. */
  concepts: string[];
  /** WCAG success criteria this pattern must meet, such as "2.3.3". */
  wcag: string[];
  sources: Array<{ title: string; url: string }>;
  mood: string[];
  best_sections: string[];
  cost: { weight: string; mobile_risk: string };
  use_when: string;
  avoid_when: string;
  pairs_with: string[];
  clashes_with: string[];
}

export interface ConceptNote {
  id: string;
  title: string;
  summary: string;
  /** Markdown, without frontmatter. */
  body: string;
}

const records = import.meta.glob<PatternRecord>('../../registry/patterns/*.json', { eager: true, import: 'default' });
const manifests = import.meta.glob<ControlsManifest>('../../registry/controls/*.json', {
  eager: true,
  import: 'default',
});
const patternNoteFiles = import.meta.glob<string>('../../registry/patterns/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});
const conceptFiles = import.meta.glob<string>('../../registry/concepts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const idFromPath = (path: string) => path.slice(path.lastIndexOf('/') + 1).replace(/\.md$/, '');

/** Every pattern, in number order. */
export const patterns: PatternRecord[] = Object.values(records).sort((a, b) => a.number.localeCompare(b.number));

const manifestBySlug = new Map(Object.values(manifests).map((manifest) => [manifest.pattern, manifest]));
const patternNotes = new Map(Object.entries(patternNoteFiles).map(([path, text]) => [idFromPath(path), text]));

function parseConcept(path: string, raw: string): ConceptNote {
  const front = /^---\n([\s\S]*?)\n---\n/.exec(raw);
  const meta = Object.fromEntries(
    (front?.[1] ?? '')
      .split('\n')
      .map((line) => [line.slice(0, line.indexOf(':')).trim(), line.slice(line.indexOf(':') + 1).trim()]),
  );
  const id = idFromPath(path);
  const body = (front ? raw.slice(front[0].length) : raw).replace(/^# .*\n+/, '');
  return { id, title: meta.title ?? id, summary: meta.summary ?? '', body };
}

/** Every concept note, by title. */
export const concepts: ConceptNote[] = Object.entries(conceptFiles)
  .map(([path, raw]) => parseConcept(path, raw))
  .sort((a, b) => a.title.localeCompare(b.title));

for (const pattern of patterns) {
  if (!manifestBySlug.has(pattern.slug)) throw new Error(`No controls manifest for pattern "${pattern.slug}"`);
}

export function findPattern(slug: string | undefined): PatternRecord | undefined {
  return patterns.find((pattern) => pattern.slug === slug);
}

export function findConcept(id: string): ConceptNote | undefined {
  return concepts.find((concept) => concept.id === id);
}

export function controlsFor(slug: string): ControlsManifest {
  const manifest = manifestBySlug.get(slug);
  if (!manifest) throw new Error(`No controls manifest for pattern "${slug}"`);
  return manifest;
}

/** One "## Heading" section of a pattern's note, as markdown. */
export function noteSection(slug: string, heading: string): string {
  const note = patternNotes.get(slug) ?? '';
  const start = note.search(new RegExp(`^## ${heading}$`, 'm'));
  if (start < 0) return '';
  const rest = note.slice(start).replace(/^## .*\n/, '');
  const end = rest.search(/^## /m);
  return (end < 0 ? rest : rest.slice(0, end)).trim();
}
