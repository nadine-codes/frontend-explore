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
import { ComboboxPlayground } from './ComboboxPlayground';
import comboboxSource from './Combobox/Combobox.tsx?raw';
import hookSource from './Combobox/useCombobox.ts?raw';
import comboboxCss from './Combobox/Combobox.css?raw';

const SLUG = 'combobox';

function usageCode(s: Settings): string {
  const matchMode = read.string(s, 'matchMode');
  const maxResults = read.number(s, 'maxResults');
  const props = [
    'label="Destination"',
    'items={destinations}',
    'getLabel={(d) => d.name}',
    'onSelect={setDestination}',
    matchMode !== 'contains' ? `matchMode="${matchMode}"` : null,
    maxResults !== 8 ? `maxResults={${maxResults}}` : null,
    read.boolean(s, 'autoHighlight') ? null : 'autoHighlight={false}',
    read.boolean(s, 'highlightMatch') ? null : 'highlightMatch={false}',
  ].filter(Boolean);

  return `import { Combobox } from './components/Combobox';

export function DestinationPicker({ destinations, setDestination }) {
  return (
    <Combobox
      ${props.join('\n      ')}
    />
  );
}`;
}

export default function ComboboxPage() {
  const pattern = findPattern(SLUG);
  const manifest = controlsFor(SLUG);
  const [settings, setSettings] = useState<Settings>(() => defaultSettings(manifest));
  if (!pattern) return null;

  return (
    <PatternArticle>
      <PatternHeader pattern={pattern}>
        Type a few letters and the list narrows. Use the arrow keys to move, Enter to pick, Esc to close. Focus never
        leaves the text field, yet a screen reader still hears each option you land on.
      </PatternHeader>

      <ComboboxPlayground manifest={manifest} settings={settings} onChange={setSettings} />

      <Section
        title="Use it"
        intro={
          <>
            The playground above is the real component. The <b>Usage</b> tab follows the controls. For your own markup,
            use the <code>useCombobox</code> hook directly.
          </>
        }
      >
        <CodeTabs
          files={[
            { name: 'Usage.tsx', code: usageCode(settings) },
            { name: 'Combobox.tsx', code: comboboxSource },
            { name: 'useCombobox.ts', code: hookSource },
            { name: 'Combobox.css', code: comboboxCss },
          ]}
        />
      </Section>

      <Section title="How it's built">
        <Steps
          items={[
            {
              title: 'A hook for the behavior',
              body: (
                <>
                  <code>useCombobox</code> owns the query, the filtered results and the active index. It returns prop
                  objects for the input, the list and each option, so any markup can use it.
                </>
              ),
            },
            {
              title: 'Filter',
              body: (
                <>
                  Each keystroke filters <code>items</code> by label and keywords, with <code>contains</code> or{' '}
                  <code>startsWith</code>, then caps the list at <code>maxResults</code>.
                </>
              ),
            },
            {
              title: 'Focus stays put',
              body: (
                <>
                  Arrow keys change the active index, not focus. The input's <code>aria-activedescendant</code> points at
                  the active option's id, so screen readers announce it while you keep typing.
                </>
              ),
            },
            {
              title: 'Mouse without losing focus',
              body: (
                <>
                  Options cancel <code>mousedown</code>, so clicking one does not blur the input before the click lands.
                </>
              ),
            },
            {
              title: 'Status',
              body: (
                <>
                  A visually hidden <code>role="status"</code> reports "3 results" or "No results", politely, after each
                  change.
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
