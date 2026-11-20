/**
 * Validates the registry and generates everything derived from it.
 *
 *   npx tsx scripts/build-registry.ts
 *
 * Checks (any failure exits 1, so `npm run build` fails):
 *   - every [[link]] resolves to a pattern or a concept
 *   - every pattern links to at least one concept
 *   - every pairs_with and clashes_with slug exists
 *   - a pattern's record and its note link the same concepts and pairs
 *   - a concept note links to exactly the patterns that list it
 *   - every pattern has a note, a controls manifest and a code folder
 *
 * Writes:
 *   registry/constellation.json                  the map, read by the site
 *   plugin/skills/frontend-explore/index.md      one line per pattern
 *   plugin/skills/frontend-explore/patterns/     bundled notes, records, controls, drop-in code
 *   plugin/skills/frontend-explore/concepts/     bundled concept notes
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, copyFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const REG = join(ROOT, 'registry');
const SKILL = join(ROOT, 'plugin', 'skills', 'frontend-explore');
const SHARED_HOOK = join(ROOT, 'src', 'lib', 'usePrefersReducedMotion.ts');

interface PatternRecord {
  slug: string;
  number: string;
  title: string;
  category: string;
  summary: string;
  code: { dir: string; import: string };
  concepts: string[];
  wcag: string[];
  mood: string[];
  best_sections: string[];
  cost: { weight: string; mobile_risk: string };
  use_when: string;
  avoid_when: string;
  pairs_with: string[];
  clashes_with: string[];
}

interface Note {
  id: string;
  title: string;
  summary: string;
  body: string;
  links: Set<string>;
}

const errors: string[] = [];
const fail = (message: string) => errors.push(message);

const LINK = /\[\[([a-z0-9-]+)\]\]/g;
/** Links outside code. A `[[slug]]` inside backticks is an example, not a link. */
const stripCode = (text: string) => text.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
const linksIn = (text: string) => new Set([...stripCode(text).matchAll(LINK)].map((m) => m[1] as string));

function readNote(file: string): Note {
  const raw = readFileSync(file, 'utf8');
  const meta: Record<string, string> = {};
  let body = raw;
  const front = /^---\n([\s\S]*?)\n---\n/.exec(raw);
  if (front) {
    for (const line of (front[1] ?? '').split('\n')) {
      const at = line.indexOf(':');
      if (at > 0) meta[line.slice(0, at).trim()] = line.slice(at + 1).trim();
    }
    body = raw.slice(front[0].length);
  }
  const id = basename(file, '.md');
  return { id, title: meta.title ?? id, summary: meta.summary ?? '', body, links: linksIn(body) };
}

const listFiles = (dir: string, ext: string) =>
  existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(ext)).sort().map((f) => join(dir, f)) : [];

// ---------- Load ----------

const patterns: PatternRecord[] = listFiles(join(REG, 'patterns'), '.json')
  .map((f) => JSON.parse(readFileSync(f, 'utf8')) as PatternRecord)
  .sort((a, b) => a.number.localeCompare(b.number));
const patternNotes = new Map(listFiles(join(REG, 'patterns'), '.md').map((f) => [basename(f, '.md'), readNote(f)]));
const concepts = new Map(listFiles(join(REG, 'concepts'), '.md').map((f) => [basename(f, '.md'), readNote(f)]));
const controls = new Set(listFiles(join(REG, 'controls'), '.json').map((f) => basename(f, '.json')));

const slugs = new Set(patterns.map((p) => p.slug));
const known = (id: string) => slugs.has(id) || concepts.has(id);

for (const id of slugs) {
  if (concepts.has(id)) fail(`"${id}" is both a pattern and a concept`);
}

// ---------- Check ----------

for (const p of patterns) {
  const where = `pattern ${p.slug}`;
  const note = patternNotes.get(p.slug);
  if (!note) fail(`${where}: missing registry/patterns/${p.slug}.md`);
  if (!controls.has(p.slug)) fail(`${where}: missing registry/controls/${p.slug}.json`);
  if (!existsSync(join(ROOT, p.code.dir))) fail(`${where}: code folder ${p.code.dir} not found`);
  if (p.concepts.length === 0) fail(`${where}: links to no concepts`);
  for (const c of p.concepts) if (!concepts.has(c)) fail(`${where}: concept "${c}" has no note`);
  for (const s of [...p.pairs_with, ...p.clashes_with]) if (!slugs.has(s)) fail(`${where}: pairs/clashes slug "${s}" not found`);
  for (const field of ['use_when', 'avoid_when'] as const) if (!p[field]) fail(`${where}: ${field} is empty`);
  if (!note) continue;
  if (!/^## Accessibility$/m.test(note.body)) fail(`${where}: note has no "## Accessibility" section`);
  for (const c of p.concepts) if (!note.links.has(c)) fail(`${where}: record lists concept "${c}" but the note does not link it`);
  for (const s of p.pairs_with) if (!note.links.has(s)) fail(`${where}: record pairs with "${s}" but the note does not link it`);
  for (const link of note.links) {
    if (concepts.has(link) && !p.concepts.includes(link)) fail(`${where}: note links concept "${link}" but the record does not list it`);
  }
}

for (const note of [...patternNotes.values(), ...concepts.values()]) {
  for (const link of note.links) if (!known(link)) fail(`${note.id}.md: [[${link}]] does not resolve`);
}
for (const id of patternNotes.keys()) if (!slugs.has(id)) fail(`registry/patterns/${id}.md has no record`);

for (const c of concepts.values()) {
  const listedBy = patterns.filter((p) => p.concepts.includes(c.id)).map((p) => p.slug);
  const linksTo = [...c.links].filter((l) => slugs.has(l));
  for (const s of listedBy) if (!linksTo.includes(s)) fail(`concept ${c.id}: ${s} lists it, but the note does not link back`);
  for (const s of linksTo) if (!listedBy.includes(s)) fail(`concept ${c.id}: links ${s}, but ${s} does not list it`);
  if (listedBy.length === 0) fail(`concept ${c.id}: no pattern uses it`);
}

if (errors.length) {
  console.error(`Registry check failed (${errors.length}):\n  - ${errors.join('\n  - ')}`);
  process.exit(1);
}

// ---------- Constellation ----------

type Edge = { from: string; to: string; type: 'concept' | 'pairs_with' | 'clashes_with' | 'link'; status: 'authored' };
const edges: Edge[] = [];
const seen = new Set<string>();
const addEdge = (edge: Edge) => {
  const key = edge.type === 'concept' ? `${edge.from}>${edge.to}` : [edge.from, edge.to].sort().join('~') + edge.type;
  if (seen.has(key)) return;
  seen.add(key);
  edges.push(edge);
};
for (const p of patterns) {
  for (const c of p.concepts) addEdge({ from: p.slug, to: c, type: 'concept', status: 'authored' });
  for (const s of p.pairs_with) addEdge({ from: p.slug, to: s, type: 'pairs_with', status: 'authored' });
  for (const s of p.clashes_with) addEdge({ from: p.slug, to: s, type: 'clashes_with', status: 'authored' });
}
for (const c of concepts.values()) {
  for (const l of c.links) if (concepts.has(l)) addEdge({ from: c.id, to: l, type: 'link', status: 'authored' });
}

const constellationFile = join(REG, 'constellation.json');
const previous = existsSync(constellationFile) ? JSON.parse(readFileSync(constellationFile, 'utf8')) : {};
const constellation = {
  nodes: [
    ...patterns.map((p) => ({ id: p.slug, type: 'pattern', title: p.title, wcag: p.wcag })),
    ...[...concepts.values()].map((c) => ({ id: c.id, type: 'concept', title: c.title })),
  ],
  edges,
  // Gaps come from owner-run research batches (Phase 5). Keep whatever is there.
  gaps: Array.isArray(previous.gaps) ? previous.gaps : [],
};
writeFileSync(constellationFile, JSON.stringify(constellation, null, 2) + '\n');

// ---------- Skill bundle ----------

const GENERATED = '<!-- Generated by scripts/build-registry.ts. Edit registry/ instead. -->\n';
rmSync(join(SKILL, 'patterns'), { recursive: true, force: true });
rmSync(join(SKILL, 'concepts'), { recursive: true, force: true });
mkdirSync(join(SKILL, 'concepts'), { recursive: true });

const hookSource = readFileSync(SHARED_HOOK, 'utf8');

for (const p of patterns) {
  const out = join(SKILL, 'patterns', p.slug);
  const codeOut = join(out, 'code');
  mkdirSync(codeOut, { recursive: true });
  writeFileSync(join(out, 'pattern.md'), GENERATED + readFileSync(join(REG, 'patterns', `${p.slug}.md`), 'utf8'));
  copyFileSync(join(REG, 'patterns', `${p.slug}.json`), join(out, 'pattern.json'));
  copyFileSync(join(REG, 'controls', `${p.slug}.json`), join(out, 'controls.json'));

  // Drop-in code must stand alone, so the shared hook travels with it.
  let needsHook = false;
  for (const file of readdirSync(join(ROOT, p.code.dir)).sort()) {
    let text = readFileSync(join(ROOT, p.code.dir, file), 'utf8');
    if (/from '(\.\.\/)+lib\/usePrefersReducedMotion'/.test(text)) {
      text = text.replace(/from '(\.\.\/)+lib\/usePrefersReducedMotion'/g, "from './usePrefersReducedMotion'");
      needsHook = true;
    }
    writeFileSync(join(codeOut, file), text);
  }
  if (needsHook) writeFileSync(join(codeOut, 'usePrefersReducedMotion.ts'), hookSource);
}

for (const c of concepts.values()) {
  copyFileSync(join(REG, 'concepts', `${c.id}.md`), join(SKILL, 'concepts', `${c.id}.md`));
}

const indexLines = patterns.map(
  (p) =>
    `- **${p.title}** \`${p.slug}\` (${p.category}). Use when: ${p.use_when}. Avoid when: ${p.avoid_when}. ` +
    `Mood: ${p.mood.join(', ')}. Sections: ${p.best_sections.join(', ')}. ` +
    `Cost: ${p.cost.weight}, mobile risk ${p.cost.mobile_risk}. ` +
    (p.pairs_with.length ? `Pairs with: ${p.pairs_with.join(', ')}. ` : '') +
    (p.clashes_with.length ? `Clashes with: ${p.clashes_with.join(', ')}. ` : '') +
    `File: \`patterns/${p.slug}/pattern.md\``,
);
const conceptLines = [...concepts.values()].map((c) => `- \`${c.id}\`: ${c.summary} File: \`concepts/${c.id}.md\``);

writeFileSync(
  join(SKILL, 'index.md'),
  `${GENERATED}# Pattern index

${patterns.length} patterns. Read this first, pick 2 or 3, then open only the chosen pattern files.

${indexLines.join('\n')}

## Concepts

${conceptLines.join('\n')}
`,
);

// ---------- Docs ----------
// Pages are docs/*.md. The glossary is generated from the concept notes so it cannot drift.
// For AI readers, every page is also served as plain markdown at /docs/<slug>.md, plus /docs/llms.txt.

const SITE_URL = 'https://frontend-explore.vercel.app';
const DOCS = join(ROOT, 'docs');
const PUBLIC_DOCS = join(ROOT, 'public', 'docs');
const today = new Date().toISOString().slice(0, 10);

const glossaryEntries = [...concepts.values()]
  .sort((a, b) => a.title.localeCompare(b.title))
  .map((c) => `<a id="${c.id}"></a>\n\n## ${c.title}\n\n${c.body.replace(/^# .*\n+/, '').trim()}\n`);
const glossaryFile = join(DOCS, 'glossary.md');
const glossaryBody = `${GENERATED}
Each entry is a concept note from the registry. Pattern pages link here.

${glossaryEntries.join('\n')}`;
const oldGlossary = existsSync(glossaryFile) ? readFileSync(glossaryFile, 'utf8') : '';
// Keep the date unless the text changed, so the file only shows up in git when it really changes.
if (!oldGlossary.endsWith(glossaryBody)) {
  writeFileSync(
    glossaryFile,
    `---
title: Glossary
summary: One entry per front-end concept in the library, with the patterns that use it.
group: Get started
order: 3
last_checked: ${today}
---

${glossaryBody}`,
  );
}

interface DocPage {
  slug: string;
  meta: Record<string, string>;
  body: string;
}
const docPages: DocPage[] = listFiles(DOCS, '.md').map((file) => {
  const raw = readFileSync(file, 'utf8');
  const front = /^---\n([\s\S]*?)\n---\n/.exec(raw);
  const meta: Record<string, string> = {};
  for (const line of (front?.[1] ?? '').split('\n')) {
    const at = line.indexOf(':');
    if (at > 0) meta[line.slice(0, at).trim()] = line.slice(at + 1).trim();
  }
  return { slug: basename(file, '.md'), meta, body: front ? raw.slice(front[0].length) : raw };
});

for (const page of docPages) {
  for (const key of ['title', 'summary', 'group', 'order', 'last_checked']) {
    if (!page.meta[key]) fail(`docs/${page.slug}.md: frontmatter is missing "${key}"`);
  }
  for (const link of linksIn(page.body)) if (!known(link)) fail(`docs/${page.slug}.md: [[${link}]] does not resolve`);
  for (const m of page.body.matchAll(/\]\(\/explore\/([a-z0-9-]+)\)/g)) {
    if (!slugs.has(m[1] as string)) fail(`docs/${page.slug}.md: links to missing pattern /explore/${m[1]}`);
  }
  if (/—/.test(page.body)) fail(`docs/${page.slug}.md: contains an em dash`);
}
if (errors.length) {
  console.error(`Docs check failed (${errors.length}):\n  - ${errors.join('\n  - ')}`);
  process.exit(1);
}

const absoluteLinks = (text: string) =>
  text
    .replace(LINK, (whole, id: string) => {
      const p = patterns.find((x) => x.slug === id);
      if (p) return `[${p.title}](${SITE_URL}/explore/${p.slug})`;
      const c = concepts.get(id);
      return c ? `[${c.title}](${SITE_URL}/docs/glossary#${c.id})` : whole;
    })
    .replace(/\]\(\/(?!\/)/g, `](${SITE_URL}/`);

rmSync(PUBLIC_DOCS, { recursive: true, force: true });
mkdirSync(PUBLIC_DOCS, { recursive: true });
const ordered = [...docPages].sort((a, b) => Number(a.meta.order) - Number(b.meta.order));
for (const page of ordered) {
  writeFileSync(
    join(PUBLIC_DOCS, `${page.slug}.md`),
    `# ${page.meta.title}\n\n> ${page.meta.summary}\n\n${absoluteLinks(page.body.replace(GENERATED, '')).trim()}\n`,
  );
}
writeFileSync(
  join(PUBLIC_DOCS, 'llms.txt'),
  `# Frontend Explore

> Hand-built interaction patterns for React and TypeScript, with notes on when to use each one.

## Docs

${ordered.map((p) => `- [${p.meta.title}](${SITE_URL}/docs/${p.slug}.md): ${p.meta.summary}`).join('\n')}

## Patterns

${patterns.map((p) => `- [${p.title}](${SITE_URL}/explore/${p.slug}): ${p.summary}`).join('\n')}
`,
);

console.log(
  `Registry OK: ${patterns.length} patterns, ${concepts.size} concepts, ${edges.length} edges, ${docPages.length} docs pages. ` +
    'Wrote constellation.json, the skill bundle, the glossary and public/docs.',
);
