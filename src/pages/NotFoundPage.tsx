import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <section className="page not-found">
      <p className="kicker mono">Error 404 · signal lost</p>
      <h1>Lost in space</h1>
      <p className="lede">There's nothing at these coordinates. It may be a pattern that hasn't launched yet.</p>
      <Link className="button" to="/explore">
        Back to the star map
      </Link>
    </section>
  );
}
