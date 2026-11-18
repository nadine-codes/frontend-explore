import { Link } from 'react-router';
import { TiltCard } from '../components/TiltCard';
import { patterns } from '../patterns/registry';
import '../styles/explore.css';

export function ExplorePage() {
  return (
    <div className="page explore">
      <header className="page-header">
        <p className="kicker mono">Star map</p>
        <h1>Explore the patterns</h1>
        <p className="lede">
          Each one is a React + TypeScript component with a live playground, the source code, and notes on how it works.
        </p>
      </header>

      <ul className="pattern-grid" role="list">
        {patterns.map((pattern) => {
          const { Thumbnail } = pattern;
          return (
            <li key={pattern.slug}>
              <TiltCard maxTilt={7} lift={1.015} className="pattern-card">
                <Link to={`/explore/${pattern.slug}`} className="pattern-card__link">
                  <div className="pattern-card__thumb">
                    <Thumbnail />
                  </div>
                  <div className="pattern-card__body">
                    <p className="pattern-card__meta mono">
                      {pattern.number} · {pattern.category}
                    </p>
                    <h2>{pattern.title}</h2>
                    <p>{pattern.summary}</p>
                    <ul className="tags" role="list" aria-label="Skills">
                      {pattern.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                    <span className="pattern-card__go mono">Open pattern →</span>
                  </div>
                </Link>
              </TiltCard>
            </li>
          );
        })}
        <li className="pattern-card pattern-card--uncharted" aria-label="More patterns coming soon">
          <span className="uncharted__dot" aria-hidden="true" />
          <p className="mono">Uncharted territory</p>
          <p>The next pattern is on its way.</p>
        </li>
      </ul>
    </div>
  );
}
