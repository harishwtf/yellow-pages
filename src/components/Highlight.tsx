import type { ReactNode } from 'react';
import { queryPattern } from '../lib/search';

/** Renders `text` with every match of `query` (found the way search finds it) wrapped in a soft highlight. */
export function Highlight({ text, query }: { text: string; query: string }) {
  const pattern = queryPattern(query);
  if (!pattern) return <>{text}</>;

  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    const at = match.index ?? 0;
    if (at > cursor) parts.push(text.slice(cursor, at));
    parts.push(
      <mark key={at} className="match">
        {match[0]}
      </mark>,
    );
    cursor = at + match[0].length;
  }
  parts.push(text.slice(cursor));
  return <>{parts}</>;
}
