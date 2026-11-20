import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { findConcept, noteSection, type PatternRecord } from '../../lib/registry';
import { linkTarget, Markdown } from '../../lib/Markdown';
import './pattern.css';

/** Shared pieces of every pattern page. A pattern's page composes these in order. */

export function PatternArticle({ children }: { children: ReactNode }) {
  return <article className="fe-page fe-pattern">{children}</article>;
}

export function PatternHeader({ pattern, children }: { pattern: PatternRecord; children: ReactNode }) {
  return (
    <header className="fe-page-head">
      <Link to="/explore" className="fe-back mono">
        ← Star map
      </Link>
      <p className="fe-kicker">
        Pattern {pattern.number} · {pattern.label}
      </p>
      <h1>{pattern.title}</h1>
      <p className="fe-lede">{children}</p>
    </header>
  );
}

export function Playground({ stage, panel }: { stage: ReactNode; panel: ReactNode }) {
  return (
    <div className="fe-playground">
      {stage}
      {panel}
    </div>
  );
}

interface SectionProps {
  title: string;
  /** A short paragraph under the heading. */
  intro?: ReactNode;
  children?: ReactNode;
}

export function Section({ title, intro, children }: SectionProps) {
  return (
    <section className="fe-section">
      <h2>{title}</h2>
      {intro && <p className="fe-section__intro">{intro}</p>}
      {children}
    </section>
  );
}

/** Two sections side by side on wide screens. */
export function SectionPair({ children }: { children: ReactNode }) {
  return <div className="fe-section fe-section-pair">{children}</div>;
}

export function SubSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function Steps({ items }: { items: Array<{ title: string; body: ReactNode }> }) {
  return (
    <ol className="fe-steps">
      {items.map((item) => (
        <li key={item.title}>
          <b>{item.title}.</b> {item.body}
        </li>
      ))}
    </ol>
  );
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="fe-bullets">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export function ConceptGrid({ items }: { items: Array<{ name: string; body: string }> }) {
  return (
    <ul className="fe-concepts" role="list">
      {items.map((concept) => (
        <li key={concept.name}>
          <h3 className="mono">{concept.name}</h3>
          <p>{concept.body}</p>
        </li>
      ))}
    </ul>
  );
}

/** Keyboard, screen reader, reduced motion and touch notes, read from the pattern's note. */
export function AccessibilitySection({ pattern }: { pattern: PatternRecord }) {
  const source = noteSection(pattern.slug, 'Accessibility');
  if (!source) return null;
  return (
    <section className="fe-section" aria-labelledby={`${pattern.slug}-a11y`}>
      <h2 id={`${pattern.slug}-a11y`}>Accessibility</h2>
      <p>
        WCAG criteria to check: <WcagList criteria={pattern.wcag} />
      </p>
      <Markdown source={source} className="fe-prose fe-prose--bullets" />
    </section>
  );
}

const WCAG_NAMES: Record<string, string> = {
  '2.1.1': 'Keyboard',
  '2.1.2': 'No Keyboard Trap',
  '2.2.2': 'Pause, Stop, Hide',
  '2.3.3': 'Animation from Interactions',
  '2.4.3': 'Focus Order',
  '2.4.7': 'Focus Visible',
  '2.5.1': 'Pointer Gestures',
  '4.1.2': 'Name, Role, Value',
  '4.1.3': 'Status Messages',
};

function WcagList({ criteria }: { criteria: string[] }) {
  return (
    <>
      {criteria.map((id, index) => (
        <span key={id}>
          {index > 0 && ', '}
          <b>
            {id} {WCAG_NAMES[id] ?? ''}
          </b>
        </span>
      ))}
    </>
  );
}

/** Authored links: the concepts this pattern uses and the patterns it pairs or clashes with. */
export function RelatedSection({ pattern, showConcepts = true }: { pattern: PatternRecord; showConcepts?: boolean }) {
  const groups = [
    { title: 'Concepts', ids: showConcepts ? pattern.concepts : [] },
    { title: 'Pairs well with', ids: pattern.pairs_with },
    { title: 'Clashes with', ids: pattern.clashes_with },
  ].filter((group) => group.ids.length > 0);
  if (groups.length === 0) return null;

  return (
    <section className="fe-section">
      <h2>Related</h2>
      <div className="fe-related">
        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="fe-related__title">{group.title}</h3>
            <ul className="fe-chips" role="list">
              {group.ids.map((id) => {
                const target = linkTarget(id);
                return (
                  <li key={id}>{target ? <Link to={target.href}>{target.title}</Link> : <span>{id}</span>}</li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/** A "## Heading" section of the pattern's note, rendered as is. */
export function NoteSection({ pattern, heading, title = heading }: { pattern: PatternRecord; heading: string; title?: string }) {
  const source = noteSection(pattern.slug, heading);
  if (!source) return null;
  return (
    <section className="fe-section">
      <h2>{title}</h2>
      <Markdown source={source} className="fe-prose" />
    </section>
  );
}

/** The concept tiles, filled from the concept notes so they never drift from the glossary. */
export function ConceptNotes({ pattern }: { pattern: PatternRecord }) {
  const items = pattern.concepts.flatMap((id) => {
    const concept = findConcept(id);
    return concept ? [concept] : [];
  });
  return (
    <section className="fe-section">
      <h2>Front-end concepts in this pattern</h2>
      <ul className="fe-concepts" role="list">
        {items.map((concept) => (
          <li key={concept.id}>
            <h3 className="mono">
              <Link to={`/docs/glossary#${concept.id}`}>{concept.title}</Link>
            </h3>
            <p>{concept.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
