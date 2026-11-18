import './orbit-thumbnail.css';

/** Gallery illustration: a tiny sun with two planets on spinning rings. */
export function OrbitThumbnail() {
  return (
    <div className="orbit-thumb" aria-hidden="true">
      <span className="orbit-thumb__sun" />
      <span className="orbit-thumb__ring orbit-thumb__ring--inner">
        <i style={{ background: '#5ee0f5', boxShadow: '0 0 10px #5ee0f5' }} />
      </span>
      <span className="orbit-thumb__ring orbit-thumb__ring--outer">
        <i style={{ background: '#ff8ad8', boxShadow: '0 0 10px #ff8ad8' }} />
      </span>
    </div>
  );
}
