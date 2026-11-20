import './thumbnail.css';

/** Gallery illustration: a small dialog over a dimmed page. */
export function ModalThumbnail() {
  return (
    <div className="modal-thumb" aria-hidden="true">
      <span className="modal-thumb__page" />
      <span className="modal-thumb__dialog">
        <i className="modal-thumb__line modal-thumb__line--title" />
        <i className="modal-thumb__line" />
        <span className="modal-thumb__buttons">
          <i />
          <i />
        </span>
      </span>
    </div>
  );
}
