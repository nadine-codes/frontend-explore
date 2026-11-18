import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import { patterns } from '../patterns/registry';
import '../styles/home.css';

interface Orbit {
  size: number; // % of the system's width
  duration: number; // seconds per lap
  planets: Array<{ label: string; color: string; angle: number }>;
}

const ORBITS: Orbit[] = [
  { size: 44, duration: 38, planets: [{ label: 'Components', color: '#5ee0f5', angle: 20 }] },
  {
    size: 70,
    duration: 60,
    planets: [
      { label: 'React', color: '#61dafb', angle: 200 },
      { label: 'Hooks', color: '#ff8ad8', angle: 60 },
    ],
  },
  {
    size: 96,
    duration: 90,
    planets: [
      { label: 'TypeScript', color: '#4f8cff', angle: 300 },
      { label: 'CSS', color: '#b9a8ff', angle: 130 },
      { label: 'Motion', color: '#ffc46b', angle: 220 },
    ],
  },
];

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

        <div className="orbits" aria-hidden="true">
          <div className="orbits__sun">
            <span className="mono">&lt;/&gt;</span>
          </div>
          {ORBITS.map((orbit) => (
            <div
              key={orbit.size}
              className="orbits__ring"
              style={{ '--size': `${orbit.size}%`, '--duration': `${orbit.duration}s` } as CSSProperties}
            >
              {orbit.planets.map((planet) => (
                <div
                  key={planet.label}
                  className="orbits__arm"
                  style={{ '--angle': `${planet.angle}deg` } as CSSProperties}
                >
                  <div className="orbits__planet" style={{ '--color': planet.color } as CSSProperties}>
                    <span className="orbits__label">{planet.label}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
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
