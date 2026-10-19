import type { ReactNode } from 'react';
import { findRanges } from '../lib/search';

/** `text` with every match of `query` under a highlighter swipe. */
export function Highlight({ text, query }: { text: string; query: string }) {
  const ranges = findRanges(text, query);
  if (ranges.length === 0) return <>{text}</>;
  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const range of ranges) {
    if (range.start > cursor) parts.push(text.slice(cursor, range.start));
    parts.push(
      <mark key={range.start} className="hl">
        {text.slice(range.start, range.end)}
      </mark>,
    );
    cursor = range.end;
  }
  parts.push(text.slice(cursor));
  return <>{parts}</>;
}
