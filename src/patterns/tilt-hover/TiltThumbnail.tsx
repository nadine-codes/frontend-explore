import './tilt-thumbnail.css';

/** Gallery illustration: a small card tipped back in 3D. */
export function TiltThumbnail() {
  return (
    <div className="tilt-thumb" aria-hidden="true">
      <div className="tilt-thumb__card">
        <span className="tilt-thumb__line tilt-thumb__line--short" />
        <span className="tilt-thumb__line" />
        <span className="tilt-thumb__line" />
        <span className="tilt-thumb__chip" />
      </div>
    </div>
  );
}
