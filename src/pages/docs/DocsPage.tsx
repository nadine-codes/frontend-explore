import { useState } from 'react';
import { Link, NavLink, useParams } from 'react-router';
import { Markdown, resolveLinks } from '../../lib/Markdown';
import { SITE } from '../../site/site';
import { NotFoundPage } from '../NotFoundPage';
import './docs.css';

interface DocPage {
  slug: string;
  title: string;
  summary: string;
  group: string;
  order: number;
  lastChecked: string;
  body: string;
}

const files = import.meta.glob<string>('../../../docs/*.md', { eager: true, query: '?raw', import: 'default' });

function parse(path: string, raw: string): DocPage {
  const front = /^---\n([\s\S]*?)\n---\n/.exec(raw);
  const meta: Record<string, string> = {};
  for (const line of (front?.[1] ?? '').split('\n')) {
    const at = line.indexOf(':');
    if (at > 0) meta[line.slice(0, at).trim()] = line.slice(at + 1).trim();
  }
  const slug = path.slice(path.lastIndexOf('/') + 1).replace(/\.md$/, '');
  const body = (front ? raw.slice(front[0].length) : raw).replace(/<!-- Generated[^>]*-->\n?/, '');
  return {
    slug,
    title: meta.title ?? slug,
    summary: meta.summary ?? '',
    group: meta.group ?? 'Other',
    order: Number(meta.order ?? 99),
    lastChecked: meta.last_checked ?? '',
    body,
  };
}

export const docPages: DocPage[] = Object.entries(files)
  .map(([path, raw]) => parse(path, raw))
  .sort((a, b) => a.order - b.order);

const groups = [...new Set(docPages.map((page) => page.group))];

/** The page as markdown with absolute links, for pasting into an AI tool. */
function asMarkdown(page: DocPage): string {
  const absolute = resolveLinks(page.body).replace(/\]\(\/(?!\/)/g, `](${SITE.url}/`);
  return `# ${page.title}\n\n> ${page.summary}\n\n${absolute.trim()}\n`;
}

type CopyState = 'idle' | 'copied' | 'failed';

export function DocsPage() {
  const { slug = 'overview' } = useParams();
  const page = docPages.find((p) => p.slug === slug);
  const [copy, setCopy] = useState<CopyState>('idle');
  const [helpful, setHelpful] = useState<'yes' | 'no' | null>(null);
  if (!page) return <NotFoundPage />;

  const copyForLlm = async () => {
    try {
      await navigator.clipboard.writeText(asMarkdown(page));
      setCopy('copied');
    } catch {
      setCopy('failed');
    }
    window.setTimeout(() => setCopy('idle'), 1600);
  };

  const issueUrl = `${SITE.githubUrl}/issues/new?title=${encodeURIComponent(`Docs: ${page.title}`)}`;

  return (
    <div className="fe-page fe-docs">
      <nav className="fe-docs__nav" aria-label="Docs">
        {groups.map((group) => (
          <div key={group}>
            <p className="fe-docs__group">{group}</p>
            <ul role="list">
              {docPages
                .filter((p) => p.group === group)
                .map((p) => (
                  <li key={p.slug}>
                    <NavLink to={`/docs/${p.slug}`} end>
                      {p.title}
                    </NavLink>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </nav>

      <article className="fe-docs__article" key={page.slug}>
        <header className="fe-docs__head">
          <p className="fe-docs__crumbs mono">
            <Link to="/docs/overview">Docs</Link> / {page.group} / <span aria-current="page">{page.title}</span>
          </p>
          <h1>{page.title}</h1>
          <p className="fe-lede">{page.summary}</p>
          <div className="fe-docs__tools">
            <button type="button" onClick={copyForLlm}>
              {copy === 'copied' ? 'Copied' : copy === 'failed' ? 'Copy failed' : 'Copy for LLM'}
            </button>
            <a href={`/docs/${page.slug}.md`}>View as Markdown</a>
          </div>
        </header>

        <Markdown source={page.body} className="fe-prose fe-docs__body" />

        <footer className="fe-docs__foot">
          <p className="mono">Last checked {page.lastChecked}</p>
          <div className="fe-docs__helpful" aria-live="polite">
            {helpful === null && (
              <>
                <span>Was this page helpful?</span>
                <button type="button" onClick={() => setHelpful('yes')}>
                  Yes
                </button>
                <button type="button" onClick={() => setHelpful('no')}>
                  No
                </button>
              </>
            )}
            {helpful === 'yes' && <span>Thanks!</span>}
            {helpful === 'no' && (
              <span>
                Sorry about that. <a href={issueUrl}>Tell us what was missing on GitHub</a>.
              </span>
            )}
          </div>
        </footer>
      </article>
    </div>
  );
}
