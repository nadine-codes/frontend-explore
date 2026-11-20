import './thumbnail.css';

/** Gallery illustration: a wide palette with a search line, rows and key hints. */
export function PaletteThumbnail() {
  return (
    <div className="palette-thumb" aria-hidden="true">
      <span className="palette-thumb__input">
        <i />
        <b>⌘K</b>
      </span>
      <span className="palette-thumb__row palette-thumb__row--active">
        <i />
        <b />
      </span>
      <span className="palette-thumb__row">
        <i />
        <b />
      </span>
      <span className="palette-thumb__row">
        <i />
      </span>
    </div>
  );
}
