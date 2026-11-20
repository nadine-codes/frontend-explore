import { useEffect, useId, useRef, type ReactNode, type RefObject } from 'react';
import './Modal.css';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface ModalProps {
  open: boolean;
  /** Called on Esc, a backdrop click (if allowed) or a close button. Set `open` to false here. */
  onClose: () => void;
  /** Becomes the dialog's accessible name. */
  title: ReactNode;
  /** Optional line under the title, linked with aria-describedby. */
  description?: ReactNode;
  children: ReactNode;
  /** What gets focus on open. Default: the first focusable element inside. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Close when the backdrop is clicked. Default true. */
  closeOnBackdrop?: boolean;
  /** small = 400px, medium = 560px. Default medium. */
  size?: 'small' | 'medium';
  /** Hide the visible title. It is still the dialog's name for screen readers. */
  hideTitle?: boolean;
  className?: string;
}

/**
 * A modal dialog built on the native <dialog> element.
 *
 * showModal() puts the dialog in the top layer and makes everything else inert,
 * so focus and screen readers stay inside without a hand-written focus loop.
 * Esc closes it. Focus moves in on open and goes back to the opener on close.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  initialFocusRef,
  closeOnBackdrop = true,
  size = 'medium',
  hideTitle = false,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const pressStartedOnBackdrop = useRef(false);
  const latestOnClose = useRef(onClose);
  useEffect(() => {
    latestOnClose.current = onClose;
  });
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
      const target = initialFocusRef?.current ?? dialog.querySelector<HTMLElement>(FOCUSABLE);
      target?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
      openerRef.current?.focus();
    }
  }, [open, initialFocusRef]);

  // If the component unmounts while open, still hand focus back.
  useEffect(() => {
    const dialog = dialogRef.current;
    return () => {
      if (dialog?.open) {
        dialog.close();
        openerRef.current?.focus();
      }
    };
  }, []);

  // Esc fires "cancel". Let the parent decide, so React state stays the source of truth.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onCancel = (event: Event) => {
      event.preventDefault();
      latestOnClose.current();
    };
    dialog.addEventListener('cancel', onCancel);
    return () => dialog.removeEventListener('cancel', onCancel);
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={['modal', `modal--${size}`, className].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      // A click lands on the <dialog> itself only on the backdrop, because the panel fills it.
      // Track where the press started, so a drag from inside the panel does not close it.
      onPointerDown={(event) => {
        pressStartedOnBackdrop.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (closeOnBackdrop && pressStartedOnBackdrop.current && event.target === event.currentTarget) onClose();
      }}
      // showModal() keeps focus out of the page, but Tab can still leave for the browser's own toolbar.
      // Wrap it instead, so Tab and Shift+Tab cycle inside. Esc is always the way out.
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const items = [...event.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
          (el) => el.offsetParent !== null || el === document.activeElement,
        );
        const first = items[0];
        const last = items.at(-1);
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
    >
      <div className="modal__panel">
        <h2 id={titleId} className={hideTitle ? 'modal__title modal__title--hidden' : 'modal__title'}>
          {title}
        </h2>
        {description && (
          <p id={descriptionId} className="modal__description">
            {description}
          </p>
        )}
        {children}
      </div>
    </dialog>
  );
}
