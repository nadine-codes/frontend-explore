import { useId, useMemo, useState, type KeyboardEvent } from 'react';

export type MatchMode = 'startsWith' | 'contains';

export interface ComboboxOptions<T> {
  items: T[];
  /** The text shown for, and matched against, each item. */
  getLabel: (item: T) => string;
  /** Extra words that should also match, such as synonyms. */
  getKeywords?: (item: T) => string[];
  onSelect: (item: T) => void;
  /** Default "contains". */
  matchMode?: MatchMode;
  /** Most results to show. Default 8. */
  maxResults?: number;
  /** Highlight the first result as you type, so Enter picks it. Default true. */
  autoHighlight?: boolean;
  /** Keep the list open when the input is empty, showing every item. Default false. */
  showAllWhenEmpty?: boolean;
  /** Reorders results after filtering, such as by group. */
  sortResults?: (results: T[]) => T[];
}

export interface Match {
  start: number;
  end: number;
}

/**
 * Everything a combobox needs except the markup: filtering, the active option,
 * keyboard handling, and the ARIA attributes that tie the input to its listbox.
 *
 * Focus never leaves the input. The "active" option is announced through
 * aria-activedescendant, so screen readers follow it while you keep typing.
 */
export function useCombobox<T>({
  items,
  getLabel,
  getKeywords,
  onSelect,
  matchMode = 'contains',
  maxResults = 8,
  autoHighlight = true,
  showAllWhenEmpty = false,
  sortResults,
}: ComboboxOptions<T>) {
  const id = useId();
  const listboxId = `${id}-listbox`;
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(showAllWhenEmpty);
  const [active, setActive] = useState(-1);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return showAllWhenEmpty ? (sortResults ?? identity)(items).slice(0, maxResults) : [];
    const hits = items.filter((item) =>
      [getLabel(item), ...(getKeywords?.(item) ?? [])].some((text) =>
        matchMode === 'startsWith'
          ? text.toLowerCase().split(/\s+/).some((word) => word.startsWith(q)) || text.toLowerCase().startsWith(q)
          : text.toLowerCase().includes(q),
      ),
    );
    return (sortResults ?? identity)(hits).slice(0, maxResults);
  }, [query, items, getLabel, getKeywords, matchMode, maxResults, showAllWhenEmpty, sortResults]);

  const open = expanded && (results.length > 0 || query.trim() !== '');
  // Keep the active index inside the current results.
  const activeIndex = active >= results.length ? (autoHighlight && results.length ? 0 : -1) : active;
  const optionId = (index: number) => `${id}-option-${index}`;

  const select = (index: number) => {
    const item = results[index];
    if (!item) return;
    onSelect(item);
    setQuery('');
    setExpanded(showAllWhenEmpty);
    setActive(showAllWhenEmpty && autoHighlight ? 0 : -1);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const count = results.length;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setExpanded(true);
        if (count) setActive((activeIndex + 1) % count);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setExpanded(true);
        if (count) setActive(activeIndex <= 0 ? count - 1 : activeIndex - 1);
        break;
      case 'Enter':
        if (open && activeIndex >= 0) {
          event.preventDefault();
          select(activeIndex);
        }
        break;
      case 'Escape':
        // First Esc closes the list, a second clears the text.
        if (open && !showAllWhenEmpty) {
          event.preventDefault();
          event.stopPropagation();
          setExpanded(false);
        } else if (query) {
          event.preventDefault();
          event.stopPropagation();
          setQuery('');
        }
        break;
      case 'Tab':
        setExpanded(showAllWhenEmpty);
        break;
    }
  };

  return {
    query,
    results,
    activeIndex,
    open,
    /** Polite status text for a live region, such as "3 results". */
    status: !open ? '' : results.length === 0 ? 'No results' : `${results.length} result${results.length === 1 ? '' : 's'}`,
    setQuery,
    select,
    inputProps: {
      role: 'combobox' as const,
      value: query,
      'aria-expanded': open,
      'aria-controls': listboxId,
      'aria-autocomplete': 'list' as const,
      'aria-activedescendant': open && activeIndex >= 0 ? optionId(activeIndex) : undefined,
      autoComplete: 'off',
      spellCheck: false,
      onChange: (event: { target: { value: string } }) => {
        setQuery(event.target.value);
        setExpanded(true);
        setActive(autoHighlight ? 0 : -1);
      },
      onKeyDown,
      onBlur: () => setExpanded(showAllWhenEmpty),
      onFocus: () => showAllWhenEmpty && setExpanded(true),
    },
    listboxProps: { id: listboxId, role: 'listbox' as const },
    getOptionProps: (index: number) => ({
      id: optionId(index),
      role: 'option' as const,
      'aria-selected': index === activeIndex,
      // Keep focus in the input when an option is pressed.
      onMouseDown: (event: { preventDefault: () => void }) => event.preventDefault(),
      onClick: () => select(index),
      onMouseMove: () => index !== activeIndex && setActive(index),
    }),
    /** Where the query sits in a label, to highlight it. */
    matchIn: (label: string): Match | null => {
      const q = query.trim().toLowerCase();
      if (!q) return null;
      const start = label.toLowerCase().indexOf(q);
      return start < 0 ? null : { start, end: start + q.length };
    },
  };
}

function identity<T>(value: T): T {
  return value;
}
