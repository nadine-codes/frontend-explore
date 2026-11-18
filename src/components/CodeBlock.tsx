import { useId, useState } from 'react';

export interface CodeFile {
  name: string;
  code: string;
}

interface CodeBlockProps {
  files: CodeFile[];
}

type CopyState = 'idle' | 'copied' | 'failed';

/** Tabbed code viewer with a copy button. */
export function CodeBlock({ files }: CodeBlockProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const id = useId();
  const active = files[activeIndex] ?? files[0];
  if (!active) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(active.code);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
    window.setTimeout(() => setCopyState('idle'), 1600);
  };

  return (
    <div className="code-block">
      <div className="code-block__bar">
        <div className="code-block__tabs" role="tablist" aria-label="Files">
          {files.map((file, index) => (
            <button
              key={file.name}
              type="button"
              role="tab"
              id={`${id}-tab-${index}`}
              aria-selected={index === activeIndex}
              aria-controls={`${id}-panel`}
              onClick={() => setActiveIndex(index)}
            >
              {file.name}
            </button>
          ))}
        </div>
        <button type="button" className="code-block__copy" onClick={copy}>
          {copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Select & copy' : 'Copy'}
        </button>
      </div>
      <pre id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${activeIndex}`} tabIndex={0}>
        <code>{active.code.trimEnd()}</code>
      </pre>
    </div>
  );
}
