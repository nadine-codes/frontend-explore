import type { ReactNode } from 'react';
import { Link } from 'react-router';
import type { PatternRecord } from '../../lib/registry';
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
        Pattern {pattern.number} · {pattern.category}
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
