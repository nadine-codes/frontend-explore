import './thumbnail.css';

/** Gallery illustration: a text field with a short list of matches. */
export function ComboboxThumbnail() {
  return (
    <div className="combo-thumb" aria-hidden="true">
      <span className="combo-thumb__input">
        <i />
      </span>
      <span className="combo-thumb__list">
        <i className="combo-thumb__row combo-thumb__row--active" />
        <i className="combo-thumb__row" />
        <i className="combo-thumb__row" />
      </span>
    </div>
  );
}
