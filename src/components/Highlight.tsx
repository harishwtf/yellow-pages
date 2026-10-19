import type { ReactNode } from 'react';

/** Renders `text` with every match of `pattern` (from tokenPattern) under a soft highlighter swipe. */
export function Highlight({ text, pattern }: { text: string; pattern: RegExp | null }) {
  if (!pattern) return <>{text}</>;
  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    const at = match.index ?? 0;
    if (match[0].length === 0) continue;
    if (at > cursor) parts.push(text.slice(cursor, at));
    parts.push(
      <mark key={at} className="match">
        {match[0]}
      </mark>,
    );
    cursor = at + match[0].length;
  }
  if (cursor === 0) return <>{text}</>;
  parts.push(text.slice(cursor));
  return <>{parts}</>;
}
