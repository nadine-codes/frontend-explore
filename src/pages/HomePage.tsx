import { Link } from 'react-router';
import { OrbitSystem } from '../components/OrbitSystem';
import { TECH_ORBITS } from '../data/techOrbits';
import { patterns } from '../patterns/registry';
import '../styles/home.css';

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
  const latest = patterns[patterns.length - 1];

  return (
    <div className="page home">
      <section className="hero">
        <div className="hero__copy">
          <p className="kicker mono">Mission log · {patterns.length} pattern{patterns.length === 1 ? '' : 's'} charted</p>
          <h1>
            Explore the <span className="gradient-text">frontend universe</span>
          </h1>
          <p className="lede">
            A collection of interaction patterns rebuilt with React, TypeScript and reusable components. Play with each one,
            then look inside to see how it's made.
          </p>
          <div className="hero__actions">
            <Link className="button" to="/explore">
              Start exploring
            </Link>
            {latest && (
              <Link className="button button--ghost" to={`/explore/${latest.slug}`}>
                Latest: {latest.title}
              </Link>
            )}
          </div>
        </div>

        <OrbitSystem
          className="home-orbits"
          orbits={TECH_ORBITS}
          center={<span className="home-orbits__mark mono">&lt;/&gt;</span>}
        />
      </section>

      <section className="pillars" aria-label="What you'll find">
        {PILLARS.map((pillar, index) => (
          <article key={pillar.title} className="pillar">
            <span className="pillar__index mono">0{index + 1}</span>
            <h2>{pillar.title}</h2>
            <p>{pillar.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
