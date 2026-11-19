import { useId, useRef, useState, type KeyboardEvent } from 'react';

export interface CodeFile {
  name: string;
  code: string;
}

type CopyState = 'idle' | 'copied' | 'failed';

const COPY_TEXT: Record<CopyState, string> = { idle: 'Copy', copied: 'Copied', failed: 'Select & copy' };

/** Source files in tabs, with a copy button. Arrow keys move between tabs. */
export function CodeTabs({ files }: { files: CodeFile[] }) {
  const [active, setActive] = useState(0);
  const [copy, setCopy] = useState<CopyState>('idle');
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const id = useId();
  const file = files[active] ?? files[0];
  if (!file) return null;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(file.code);
      setCopy('copied');
    } catch {
      setCopy('failed');
    }
    window.setTimeout(() => setCopy('idle'), 1600);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const moves: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
    let next: number | undefined;
    if (event.key in moves) next = (active + (moves[event.key] ?? 0) + files.length) % files.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = files.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="fe-code">
      <div className="fe-code__bar">
        <div className="fe-code__tabs" role="tablist" aria-label="Files" onKeyDown={onKeyDown}>
          {files.map((f, index) => (
            <button
              key={f.name}
              ref={(el) => {
                tabs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${index}`}
              aria-selected={index === active}
              aria-controls={`${id}-panel`}
              tabIndex={index === active ? 0 : -1}
              onClick={() => setActive(index)}
            >
              {f.name}
            </button>
          ))}
        </div>
        <button type="button" className="fe-code__copy" onClick={copyCode}>
          {COPY_TEXT[copy]}
        </button>
      </div>
      <pre id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} tabIndex={0}>
        <code>{file.code.trimEnd()}</code>
      </pre>
    </div>
  );
}
