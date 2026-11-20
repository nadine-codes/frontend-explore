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
import { PalettePlayground } from './PalettePlayground';
import paletteSource from './CommandPalette/CommandPalette.tsx?raw';
import paletteCss from './CommandPalette/CommandPalette.css?raw';

const SLUG = 'command-palette';

function usageCode(s: Settings): string {
  const matchMode = read.string(s, 'matchMode');
  const props = [
    'commands={commands}',
    'open={open}',
    'onOpenChange={setOpen}',
    read.boolean(s, 'showGroups') ? null : 'showGroups={false}',
    read.boolean(s, 'closeOnRun') ? null : 'closeOnRun={false}',
    matchMode !== 'contains' ? `matchMode="${matchMode}"` : null,
  ].filter(Boolean);

  return `import { useState } from 'react';
import { CommandPalette, type Command } from './components/CommandPalette';

const commands: Command[] = [
  { id: 'probe', label: 'Launch probe', group: 'Mission', run: launchProbe },
  { id: 'theme', label: 'Toggle light cockpit', group: 'View', keywords: ['theme', 'dark'], shortcut: ['⌘', 'J'], run: toggleTheme },
];

export function Search() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Search commands <kbd>⌘K</kbd></button>
      <CommandPalette
        ${props.join('\n        ')}
      />
    </>
  );
}`;
}

export default function CommandPalettePage() {
  const pattern = findPattern(SLUG);
  const manifest = controlsFor(SLUG);
  const [settings, setSettings] = useState<Settings>(() => defaultSettings(manifest));
  if (!pattern) return null;

  return (
    <PatternArticle>
      <PatternHeader pattern={pattern}>
        Press Cmd+K (Ctrl+K on Windows and Linux), type "probe" and press Enter. Every command changes the mission
        control panel, so you can see it work. It is the <b>combobox</b> inside the <b>focus-trapped modal</b>.
      </PatternHeader>

      <PalettePlayground manifest={manifest} settings={settings} onChange={setSettings} />

      <Section
        title="Use it"
        intro={
          <>
            The <b>Usage</b> tab follows the controls. The palette imports <code>Modal</code> and{' '}
            <code>useCombobox</code> from patterns 03 and 04; the skill bundle copies them in next to it.
          </>
        }
      >
        <CodeTabs
          files={[
            { name: 'Usage.tsx', code: usageCode(settings) },
            { name: 'CommandPalette.tsx', code: paletteSource },
            { name: 'CommandPalette.css', code: paletteCss },
          ]}
        />
      </Section>

      <Section title="How it's built">
        <Steps
          items={[
            {
              title: 'Shortcut',
              body: (
                <>
                  A <code>keydown</code> listener on the window toggles the palette on Cmd+K or Ctrl+K and calls{' '}
                  <code>preventDefault</code>, so the browser's own Cmd+K does not run too.
                </>
              ),
            },
            {
              title: 'A modal',
              body: (
                <>
                  The palette renders inside <code>Modal</code>, so the page goes inert, Esc closes it, and focus returns
                  to wherever it was. The title is hidden but still names the dialog.
                </>
              ),
            },
            {
              title: 'A combobox',
              body: (
                <>
                  <code>useCombobox</code> filters commands by label and keywords and drives the arrow keys. With{' '}
                  <code>showAllWhenEmpty</code>, every command shows before you type.
                </>
              ),
            },
            {
              title: 'Groups that read right',
              body: (
                <>
                  Results are sorted by group so the arrow keys follow what you see. Each run of commands sits in a{' '}
                  <code>role="group"</code> named by its heading.
                </>
              ),
            },
            {
              title: 'Run',
              body: (
                <>
                  Enter or a click runs the command, closes the palette (unless <code>closeOnRun</code> is off) and calls{' '}
                  <code>onRun</code>, which the playground uses to announce "Ran: Launch probe" in a status region.
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

      <Section title="Seen in the wild">
        <p>
          <b>VS Code</b> made the pattern famous with its Command Palette (Ctrl+Shift+P, or Cmd+Shift+P on a Mac).{' '}
          <b>GitHub</b> and <b>Linear</b> open theirs with Cmd+K or Ctrl+K, next to a visible search button.
        </p>
      </Section>
    </PatternArticle>
  );
}
