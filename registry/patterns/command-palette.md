# Command palette

Press Cmd+K (Ctrl+K on Windows and Linux), type a few letters, press Enter. Every action and page, one shortcut away. It is a combobox inside a modal dialog.

## Use when

An app or docs site with many actions or pages that keyboard users jump between.

## Avoid when

Simple marketing pages. And never as the only way to reach something: a palette is a shortcut, not a hiding place.

## Drop it in

Copy the `CommandPalette/` folder. It includes the modal and combobox hook it is built on (`Modal.tsx`, `Modal.css`, `useCombobox.ts`).

```tsx
import { CommandPalette, type Command } from './components/CommandPalette';

const commands: Command[] = [
  { id: 'new', label: 'New project', group: 'Create', shortcut: ['⌘', 'N'], run: newProject },
  { id: 'theme', label: 'Toggle theme', group: 'Settings', keywords: ['dark', 'light'], run: toggleTheme },
];

const [open, setOpen] = useState(false);

<button onClick={() => setOpen(true)}>Search <kbd>⌘K</kbd></button>
<CommandPalette commands={commands} open={open} onOpenChange={setOpen} />
```

Props: `commands` (`id`, `label`, `group`, `keywords`, `shortcut`, `run`), `open`, `onOpenChange`, `hotkey` (default `"k"`, `null` for none), `showGroups` (default true), `closeOnRun` (default true), `matchMode`, `onRun`, `placeholder`.

Theme with the modal variables plus `--palette-accent`, `--palette-active-bg`, `--palette-muted`.

## Design notes

- Always pair it with a visible button that shows the shortcut. Phones have no Cmd key, and shortcuts are hard to discover.
- Use keywords for synonyms ("dark" finds "Toggle theme").
- Group commands by what they do, and keep labels as verbs: "New project", not "Projects".

## Accessibility

- It is a modal dialog: the page behind is inert, Esc closes it, and focus returns to where it was. See [[native-dialog]] and [[focus-management]].
- The input is a combobox. Focus stays in it while the arrow keys move; the active command is announced through [[aria-activedescendant]]. See [[keyboard-navigation]].
- Groups are real ARIA groups with names, so screen readers hear "Settings" before the commands under it.
- A polite status says how many commands match. After a command runs, announce what happened (the `onRun` callback). See [[live-region]].
- The key hints are `aria-hidden`; they repeat what the keyboard already does. See [[decorative-aria-hidden]].
- Cmd+K uses a modifier, so it never fires while someone types. See [[global-shortcut]].
- Reduced motion: the dialog appears without a fade. See [[reduced-motion]].

## Links

Concepts: [[global-shortcut]], [[native-dialog]], [[focus-management]], [[aria-activedescendant]], [[keyboard-navigation]], [[live-region]], [[custom-hook]], [[reduced-motion]], [[decorative-aria-hidden]], [[css-custom-properties]].
