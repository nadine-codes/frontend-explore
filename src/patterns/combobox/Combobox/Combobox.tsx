import { useId, type ReactNode } from 'react';
import { useCombobox, type MatchMode } from './useCombobox';
import './Combobox.css';

export interface ComboboxProps<T> {
  /** Visible label. Required: a combobox needs a name. */
  label: string;
  items: T[];
  getLabel: (item: T) => string;
  getKeywords?: (item: T) => string[];
  onSelect: (item: T) => void;
  /** Optional second line under each option. */
  renderHint?: (item: T) => ReactNode;
  placeholder?: string;
  /** Default "contains". */
  matchMode?: MatchMode;
  /** Default 8. */
  maxResults?: number;
  /** Highlight the first result so Enter picks it. Default true. */
  autoHighlight?: boolean;
  /** Bold the matching part of each option. Default true. */
  highlightMatch?: boolean;
  className?: string;
}

/** A text input that filters a list as you type. Arrow keys move, Enter picks, Esc closes. */
export function Combobox<T>({
  label,
  items,
  getLabel,
  getKeywords,
  onSelect,
  renderHint,
  placeholder,
  matchMode,
  maxResults,
  autoHighlight,
  highlightMatch = true,
  className,
}: ComboboxProps<T>) {
  const inputId = useId();
  const box = useCombobox({ items, getLabel, getKeywords, onSelect, matchMode, maxResults, autoHighlight });

  return (
    <div className={['combobox', className].filter(Boolean).join(' ')}>
      <label htmlFor={inputId} className="combobox__label">
        {label}
      </label>
      <input id={inputId} className="combobox__input" placeholder={placeholder} {...box.inputProps} />
      <ul {...box.listboxProps} aria-label={label} className="combobox__list" hidden={!box.open}>
        {box.results.map((item, index) => {
          const text = getLabel(item);
          const match = highlightMatch ? box.matchIn(text) : null;
          return (
            <li key={text} {...box.getOptionProps(index)} className="combobox__option">
              <span>
                {match ? (
                  <>
                    {text.slice(0, match.start)}
                    <mark>{text.slice(match.start, match.end)}</mark>
                    {text.slice(match.end)}
                  </>
                ) : (
                  text
                )}
              </span>
              {renderHint && <span className="combobox__hint">{renderHint(item)}</span>}
            </li>
          );
        })}
        {box.open && box.results.length === 0 && (
          <li className="combobox__empty" role="presentation">
            No matches for "{box.query}"
          </li>
        )}
      </ul>
      <p className="combobox__status" role="status">
        {box.status}
      </p>
    </div>
  );
}
