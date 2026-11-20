import { useRef, useState, type FormEvent } from 'react';
import { ControlsPanel } from '../../playground/ControlsPanel';
import { read, type ControlsManifest, type Settings } from '../../playground/manifest';
import { Playground } from '../../pages/pattern/blocks';
import { Modal } from './Modal';
import './stage.css';

interface ModalPlaygroundProps {
  manifest: ControlsManifest;
  settings: Settings;
  onChange: (settings: Settings) => void;
}

/** Describes the focused element for the readout, such as `button "Rename mission"`. */
function describeFocus(): string {
  const el = document.activeElement;
  if (!el || el === document.body) return 'page (lost)';
  const name = el.getAttribute('aria-label') ?? (el as HTMLElement).innerText?.trim() ?? '';
  return `${el.tagName.toLowerCase()}${name ? ` "${name.slice(0, 28)}"` : ''}`;
}

export function ModalPlayground({ manifest, settings, onChange }: ModalPlaygroundProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('Mission FE-01');
  const [result, setResult] = useState('');
  const [focusNow, setFocusNow] = useState('–');
  const cancelRef = useRef<HTMLButtonElement>(null);
  const kind = read.string(settings, 'kind');

  const close = (message: string) => {
    setOpen(false);
    setResult(message);
    // After React closes the dialog and focus moves back, report where it landed.
    window.setTimeout(() => setFocusNow(describeFocus()), 0);
  };

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get('name');
    const next = typeof value === 'string' && value.trim() ? value.trim() : name;
    setName(next);
    close(`Renamed to "${next}"`);
  };

  const stage = (
    <div className="fe-stage modal-stage">
      <div className="modal-stage__card">
        <p className="modal-stage__label mono">Current mission</p>
        <p className="modal-stage__name">{name}</p>
        <button
          type="button"
          className="modal-stage__open"
          onClick={() => {
            setOpen(true);
            window.setTimeout(() => setFocusNow(describeFocus()), 0);
          }}
        >
          {kind === 'confirm' ? 'Delete mission…' : 'Rename mission…'}
        </button>
        <p className="modal-stage__result" role="status">
          {result}
        </p>
      </div>

      {kind === 'confirm' ? (
        <Modal
          open={open}
          onClose={() => close('Cancelled')}
          title="Delete this mission?"
          description={`"${name}" and its log will be gone. This cannot be undone.`}
          size={read.string(settings, 'size') as 'small' | 'medium'}
          closeOnBackdrop={read.boolean(settings, 'closeOnBackdrop')}
          initialFocusRef={cancelRef}
        >
          <div className="modal-stage__actions">
            <button ref={cancelRef} type="button" className="modal-stage__secondary" onClick={() => close('Cancelled')}>
              Cancel
            </button>
            <button type="button" className="modal-stage__danger" onClick={() => close('Deleted (not really)')}>
              Delete
            </button>
          </div>
        </Modal>
      ) : (
        <Modal
          open={open}
          onClose={() => close('Cancelled')}
          title="Rename mission"
          description="Up to 40 characters."
          size={read.string(settings, 'size') as 'small' | 'medium'}
          closeOnBackdrop={read.boolean(settings, 'closeOnBackdrop')}
        >
          <form onSubmit={save}>
            <label className="modal-stage__field">
              Mission name
              <input name="name" defaultValue={name} maxLength={40} />
            </label>
            <div className="modal-stage__actions">
              <button type="button" className="modal-stage__secondary" onClick={() => close('Cancelled')}>
                Cancel
              </button>
              <button type="submit" className="modal-stage__primary">
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );

  const panel = (
    <ControlsPanel manifest={manifest} settings={settings} onChange={onChange} label="Modal controls">
      <div className="fe-readout">
        <div>
          state <b>{open ? 'open (page inert)' : 'closed'}</b>
        </div>
        <div>
          focus now on <b>{focusNow}</b>
        </div>
        <div>
          last result <b>{result || '–'}</b>
        </div>
      </div>
    </ControlsPanel>
  );

  return <Playground stage={stage} panel={panel} />;
}
