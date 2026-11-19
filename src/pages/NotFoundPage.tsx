import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <section className="fe-page fe-not-found">
      <p className="fe-kicker">Error 404 · signal lost</p>
      <h1>Lost in space</h1>
      <p className="fe-lede">There's nothing at these coordinates. It may be a pattern that hasn't launched yet.</p>
      <Link className="fe-button" to="/explore">
        Back to the star map
      </Link>
    </section>
  );
}
