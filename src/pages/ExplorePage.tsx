import { Link } from 'react-router';
import { patterns } from '../lib/registry';
import { views } from '../patterns';
import { TiltCard } from '../patterns/3d-tilt-hover/TiltCard';
import './explore.css';

export function ExplorePage() {
  return (
    <div className="fe-page">
      <header className="fe-page-head">
        <p className="fe-kicker">Star map</p>
        <h1>Explore the patterns</h1>
        <p className="fe-lede">
          Each one is a React + TypeScript component with a live playground, the source code, and notes on how it works.
        </p>
      </header>

      <ul className="fe-grid" role="list">
        {patterns.map((pattern) => {
          const Thumbnail = views[pattern.slug]?.Thumbnail;
          return (
            <li key={pattern.slug}>
              <TiltCard maxTilt={7} lift={1.015} className="fe-card">
                <Link to={`/explore/${pattern.slug}`} className="fe-card__link">
                  <div className="fe-card__thumb">{Thumbnail && <Thumbnail />}</div>
                  <div className="fe-card__body">
                    <p className="fe-card__meta mono">
                      {pattern.number} · {pattern.label}
                    </p>
                    <h2>{pattern.title}</h2>
                    <p>{pattern.summary}</p>
                    <ul className="fe-tags" role="list" aria-label="Skills">
                      {pattern.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                    <span className="fe-card__go mono">Open pattern →</span>
                  </div>
                </Link>
              </TiltCard>
            </li>
          );
        })}
        <li className="fe-card fe-card--uncharted" aria-label="More patterns coming soon">
          <span className="fe-uncharted__dot" aria-hidden="true" />
          <p className="mono">Uncharted territory</p>
          <p>The next pattern is on its way.</p>
        </li>
      </ul>
    </div>
  );
}
