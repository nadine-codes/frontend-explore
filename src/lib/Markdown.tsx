import { marked } from 'marked';
import { useMemo, type MouseEvent } from 'react';
import { useNavigate } from 'react-router';
import { findConcept, findPattern } from './registry';

/** Where a [[link]] goes on the site. */
export function linkTarget(id: string): { href: string; title: string } | undefined {
  const pattern = findPattern(id);
  if (pattern) return { href: `/explore/${pattern.slug}`, title: pattern.title };
  const concept = findConcept(id);
  if (concept) return { href: `/docs/glossary#${concept.id}`, title: concept.title };
  return undefined;
}

/** Turn [[id]] into a normal markdown link. The registry build already fails on links that do not resolve. */
export function resolveLinks(markdown: string): string {
  return markdown.replace(/\[\[([a-z0-9-]+)\]\]/g, (whole, id: string) => {
    const target = linkTarget(id);
    return target ? `[${target.title}](${target.href})` : whole;
  });
}

interface MarkdownProps {
  source: string;
  className?: string;
}

/**
 * Renders authored markdown from the repo (registry notes, docs). Never pass visitor input:
 * the HTML is inserted as is. Internal links navigate without a full page load.
 */
export function Markdown({ source, className }: MarkdownProps) {
  const navigate = useNavigate();
  const html = useMemo(() => marked.parse(resolveLinks(source), { async: false }), [source]);

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    const link = (event.target as HTMLElement).closest('a');
    const href = link?.getAttribute('href');
    if (!href || !href.startsWith('/') || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    navigate(href);
  };

  return <div className={className} onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />;
}
