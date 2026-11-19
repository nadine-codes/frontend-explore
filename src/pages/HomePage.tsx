import { Link } from 'react-router';
import { patterns } from '../lib/registry';
import { OrbitSystem } from '../patterns/orbit-animation/OrbitSystem';
import { TECH_ORBITS } from '../patterns/orbit-animation/techOrbits';
import './home.css';

const PILLARS = [
  {
    title: 'React components',
    body: 'Every pattern is a reusable component you can drop into any React app, not a one-off page script.',
  },
  {
    title: 'TypeScript',
    body: 'Typed props document every option and catch mistakes before the browser does.',
  },
  {
    title: 'Interaction craft',
    body: 'Motion tuned by feel, smooth at 60fps, with reduced-motion and touch support built in.',
  },
];

export function HomePage() {
  const latest = patterns.at(-1);
  const count = patterns.length;

  return (
    <div className="fe-page fe-home">
      <section className="fe-hero">
        <div className="fe-hero__copy">
          <p className="fe-kicker">
            Mission log · {count} pattern{count === 1 ? '' : 's'} charted
          </p>
          <h1>
            Explore the <span className="fe-gradient-text">frontend universe</span>
          </h1>
          <p className="fe-lede">
            A collection of interaction patterns rebuilt with React, TypeScript and reusable components. Play with each
            one, then look inside to see how it's made.
          </p>
          <div className="fe-hero__actions">
            <Link className="fe-button" to="/explore">
              Start exploring
            </Link>
            {latest && (
              <Link className="fe-button fe-button--ghost" to={`/explore/${latest.slug}`}>
                Latest: {latest.title}
              </Link>
            )}
          </div>
        </div>

        <OrbitSystem
          className="fe-hero__orbits"
          orbits={TECH_ORBITS}
          center={<span className="fe-hero__mark mono">&lt;/&gt;</span>}
        />
      </section>

      <section className="fe-pillars" aria-label="What you'll find">
        {PILLARS.map((pillar, index) => (
          <article key={pillar.title} className="fe-pillar">
            <span className="fe-pillar__index mono">0{index + 1}</span>
            <h2>{pillar.title}</h2>
            <p>{pillar.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
