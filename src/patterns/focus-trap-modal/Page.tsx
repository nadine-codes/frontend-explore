import { useState } from 'react';
import { controlsFor, findPattern } from '../../lib/registry';
import { defaultSettings, read, type Settings } from '../../playground/manifest';
import { CodeTabs } from '../../playground/CodeTabs';
import {
  AccessibilitySection,
  ConceptNotes,
  NoteSection,
  PatternArticle,
  PatternHeader,
  RelatedSection,
  Section,
  Steps,
} from '../../pages/pattern/blocks';
import { ModalPlayground } from './ModalPlayground';
import modalSource from './Modal/Modal.tsx?raw';
import modalCss from './Modal/Modal.css?raw';

const SLUG = 'focus-trap-modal';

function usageCode(s: Settings): string {
  const size = read.string(s, 'size');
  const props = [
    'open={open}',
    'onClose={() => setOpen(false)}',
    read.string(s, 'kind') === 'confirm' ? 'title="Delete this mission?"' : 'title="Rename mission"',
    size !== 'medium' ? `size="${size}"` : null,
    read.boolean(s, 'closeOnBackdrop') ? null : 'closeOnBackdrop={false}',
    read.string(s, 'kind') === 'confirm' ? 'initialFocusRef={cancelRef}' : null,
  ].filter(Boolean);

  return `import { useState } from 'react';
import { Modal } from './components/Modal';

export function RenameButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Rename mission…</button>
      <Modal
        ${props.join('\n        ')}
      >
        {/* your form or message */}
      </Modal>
    </>
  );
}`;
}

export default function FocusTrapModalPage() {
  const pattern = findPattern(SLUG);
  const manifest = controlsFor(SLUG);
  const [settings, setSettings] = useState<Settings>(() => defaultSettings(manifest));
  if (!pattern) return null;

  return (
    <PatternArticle>
      <PatternHeader pattern={pattern}>
        Open the dialog, then press Tab a few times: focus stays inside. Press Esc and focus lands back on the button you
        started from. Try the <b>Confirm</b> preset to see focus start on the safe choice.
      </PatternHeader>

      <ModalPlayground manifest={manifest} settings={settings} onChange={setSettings} />

      <Section
        title="Use it"
        intro={
          <>
            The playground above is the real component. The <b>Usage</b> tab follows the controls; the other tabs are the
            actual source files.
          </>
        }
      >
        <CodeTabs
          files={[
            { name: 'Usage.tsx', code: usageCode(settings) },
            { name: 'Modal.tsx', code: modalSource },
            { name: 'Modal.css', code: modalCss },
          ]}
        />
      </Section>

      <Section title="How it's built">
        <Steps
          items={[
            {
              title: 'Native dialog',
              body: (
                <>
                  The component renders a <code>&lt;dialog&gt;</code> and calls <code>showModal()</code> when{' '}
                  <code>open</code> turns true. The browser puts it in the top layer and makes the rest of the page inert,
                  so there is no hand-written focus loop.
                </>
              ),
            },
            {
              title: 'Focus in',
              body: (
                <>
                  Before opening, it remembers <code>document.activeElement</code>. Then it focuses{' '}
                  <code>initialFocusRef</code>, or the first focusable element inside.
                </>
              ),
            },
            {
              title: 'Esc and the backdrop',
              body: (
                <>
                  Esc fires the dialog's <code>cancel</code> event. The component cancels the default and calls{' '}
                  <code>onClose</code>, so React state stays the single source of truth. A click whose press started on
                  the backdrop also closes it, unless <code>closeOnBackdrop</code> is off.
                </>
              ),
            },
            {
              title: 'Focus out',
              body: (
                <>
                  When <code>open</code> turns false, it calls <code>close()</code> and focuses the remembered opener, even
                  if the component unmounts while open.
                </>
              ),
            },
            {
              title: 'Motion',
              body: (
                <>
                  It fades and rises with CSS transitions. <code>@starting-style</code> gives the opening frame, and{' '}
                  <code>transition-behavior: allow-discrete</code> on <code>display</code> and <code>overlay</code> lets the
                  close animate too. Reduced motion turns it off.
                </>
              ),
            },
          ]}
        />
      </Section>

      <ConceptNotes pattern={pattern} />
      <NoteSection pattern={pattern} heading="Design notes" />
      <AccessibilitySection pattern={pattern} />
      <RelatedSection pattern={pattern} showConcepts={false} />
    </PatternArticle>
  );
}
