import { useCallback, useEffect, useId, useRef } from 'react';
import { Modal } from './Modal';
import { useCombobox, type MatchMode } from './useCombobox';
import './CommandPalette.css';

export interface Command {
  id: string;
  label: string;
  /** Heading the command is listed under. */
  group?: string;
  /** Extra words that should find it, such as "dark" for "Toggle theme". */
  keywords?: string[];
  /** Shown on the right, such as ["⌘", "B"]. Display only. */
  shortcut?: string[];
  run: () => void;
}

export interface CommandPaletteProps {
  commands: Command[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Letter that opens the palette with Cmd (Mac) or Ctrl (others). Default "k". Pass null for none. */
  hotkey?: string | null;
  /** List commands under group headings. Default true. */
  showGroups?: boolean;
  /** Close after a command runs. Default true. */
  closeOnRun?: boolean;
  /** Default "contains". */
  matchMode?: MatchMode;
  /** Called after a command runs, for example to announce it. */
  onRun?: (command: Command) => void;
  placeholder?: string;
}

/**
 * A searchable list of actions in a modal, opened with Cmd+K or Ctrl+K.
 * It is a combobox inside a dialog: type to filter, arrows to move, Enter to run.
 */
export function CommandPalette({
  commands,
  open,
  onOpenChange,
  hotkey = 'k',
  showGroups = true,
  closeOnRun = true,
  matchMode,
  onRun,
  placeholder = 'Type a command or search…',
}: CommandPaletteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const groupId = useId();

  // Show results in group order, so the arrow keys follow what you see.
  const byGroup = useCallback(
    (list: Command[]) => {
      if (!showGroups) return list;
      const order = [...new Set(commands.map((c) => c.group ?? ''))];
      return [...list].sort((a, b) => order.indexOf(a.group ?? '') - order.indexOf(b.group ?? ''));
    },
    [showGroups, commands],
  );

  const box = useCombobox({
    items: commands,
    getLabel: (c) => c.label,
    getKeywords: (c) => c.keywords ?? [],
    onSelect: (command) => {
      if (closeOnRun) onOpenChange(false);
      command.run();
      onRun?.(command);
    },
    matchMode,
    maxResults: 50,
    showAllWhenEmpty: true,
    sortResults: byGroup,
  });

  // Global shortcut. Cmd on Mac, Ctrl elsewhere; either works everywhere.
  useEffect(() => {
    if (!hotkey) return;
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === hotkey.toLowerCase()) {
        event.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hotkey, open, onOpenChange]);

  const { setQuery } = box;
  useEffect(() => {
    if (!open) setQuery('');
  }, [open, setQuery]);

  // Split the results into runs that share a group, keeping each option's flat index.
  const sections: Array<{ group: string; items: Array<{ command: Command; index: number }> }> = [];
  box.results.forEach((command, index) => {
    const group = showGroups ? (command.group ?? '') : '';
    const last = sections.at(-1);
    if (last && last.group === group) last.items.push({ command, index });
    else sections.push({ group, items: [{ command, index }] });
  });

  const renderOption = ({ command, index }: { command: Command; index: number }) => {
    const match = box.matchIn(command.label);
    return (
      <div key={command.id} {...box.getOptionProps(index)} className="palette__option">
        <span>
          {match ? (
            <>
              {command.label.slice(0, match.start)}
              <mark>{command.label.slice(match.start, match.end)}</mark>
              {command.label.slice(match.end)}
            </>
          ) : (
            command.label
          )}
        </span>
        {command.shortcut && (
          <span className="palette__keys" aria-hidden="true">
            {command.shortcut.map((key) => (
              <kbd key={key}>{key}</kbd>
            ))}
          </span>
        )}
      </div>
    );
  };

  return (
    <Modal
      open={open}
      onClose={() => onOpenChange(false)}
      title="Command palette"
      hideTitle
      initialFocusRef={inputRef}
      className="palette"
    >
      <input
        ref={inputRef}
        className="palette__input"
        placeholder={placeholder}
        aria-label="Search commands"
        {...box.inputProps}
      />
      <div {...box.listboxProps} aria-label="Commands" className="palette__list">
        {sections.map((section, sectionIndex) =>
          section.group ? (
            <div key={section.group} role="group" aria-labelledby={`${groupId}-${sectionIndex}`}>
              <div id={`${groupId}-${sectionIndex}`} className="palette__group" role="presentation">
                {section.group}
              </div>
              {section.items.map(renderOption)}
            </div>
          ) : (
            section.items.map(renderOption)
          ),
        )}
        {box.results.length === 0 && (
          <p className="palette__empty" role="presentation">
            No commands match "{box.query}"
          </p>
        )}
      </div>
      <p className="palette__status" role="status">
        {box.query ? box.status : ''}
      </p>
      <p className="palette__footer" aria-hidden="true">
        <span>
          <kbd>↑</kbd> <kbd>↓</kbd> move
        </span>
        <span>
          <kbd>↵</kbd> run
        </span>
        <span>
          <kbd>esc</kbd> close
        </span>
      </p>
    </Modal>
  );
}
