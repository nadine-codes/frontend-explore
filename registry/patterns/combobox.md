# Combobox

A text field that filters a list as you type. Arrow keys move through the matches, Enter picks one, Esc closes the list.

## Use when

Picking one value from a long list (more than about 10 options) where typing is faster than scrolling: a country, a timezone, a teammate.

## Avoid when

Short lists: use radio buttons or a native `<select>`. Free text that is not a choice from a list.

## Drop it in

Copy the `Combobox/` folder (`Combobox.tsx`, `useCombobox.ts`, `Combobox.css`, `index.ts`).

```tsx
import { Combobox } from './components/Combobox';

<Combobox
  label="Destination"
  items={planets}
  getLabel={(p) => p.name}
  onSelect={(p) => setDestination(p)}
  placeholder="Try Mars"
/>
```

Props: `label` (required), `items`, `getLabel`, `getKeywords`, `onSelect`, `renderHint`, `placeholder`, `matchMode` (`contains` or `startsWith`), `maxResults` (default 8), `autoHighlight` (default true), `highlightMatch` (default true).

For your own markup, use the `useCombobox()` hook. It returns `inputProps`, `listboxProps`, `getOptionProps(index)`, `results`, `status` and `matchIn(label)`.

Theme with `--combobox-bg`, `--combobox-text`, `--combobox-muted`, `--combobox-border`, `--combobox-accent`, `--combobox-active-bg`, `--combobox-radius`.

## Design notes

- Show the matching letters, so people see why a result is there.
- "Contains" forgives typos in the middle; "starts with" is calmer for short, well-known names.
- Say so when nothing matches, and keep the typed text.

## Accessibility

- The input has `role="combobox"`, `aria-expanded` and `aria-controls`, and the list is a `listbox` of `option`s (WAI-ARIA combobox pattern).
- Focus stays in the input. The active option is announced through `aria-activedescendant`. See [[aria-activedescendant]].
- Keys: Down and Up move (and wrap), Enter picks, Esc closes the list and then clears the text, Tab leaves. See [[keyboard-navigation]].
- A polite `role="status"` says how many results there are. See [[live-region]].
- The active option has a visible bar as well as a color change, so it does not rely on color alone.
- Mobile: the on-screen keyboard can cover the list. Keep the field high on the page.

## Links

Concepts: [[custom-hook]], [[aria-activedescendant]], [[keyboard-navigation]], [[live-region]], [[css-custom-properties]].

Pairs with: [[focus-trap-modal]].
