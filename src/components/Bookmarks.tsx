import type { CSSProperties } from 'react';
import { COPY } from '../data/ui';
import type { Section } from '../types';

/** How far each bookmark sticks out of the closed book (px): uneven, as if slipped in by hand. */
const CLOSED_OUT = [96, 108, 94, 104, 98, 112];
const OPEN_OUT = 104;
const CURRENT_OUT = 120;

/** Positions in % of the book's width. Closed: spread across the cover. Open on a spread: the bookmarks
 *  for earlier sections lie on the left page, later ones on the right, the open one in the gutter.
 *  On a phone (one page) they stay in order across the top and the open one stands taller. */
function positions(i: number, current: number, n: number) {
  const step = 4.6;
  const width = 3.1;
  let open: number;
  if (i < current) open = 3 + i * step;
  else if (i > current) open = 100 - 3 - width - (n - 1 - i) * step;
  else open = 51.2;
  const phone = 4 + (i * (100 - 8 - 9.4)) / (n - 1);
  return {
    '--xc-d': 53.5 + (i * (100 - 3.5 - width - 53.5)) / (n - 1),
    '--xo-d': open,
    '--xc-m': phone,
    '--xo-m': phone,
    '--hc': CLOSED_OUT[i % CLOSED_OUT.length],
    '--ho': i === current ? CURRENT_OUT : OPEN_OUT,
  };
}

interface BookmarksProps {
  sections: Section[];
  current: number;
  open: boolean;
  onPick: (index: number) => void;
}

export function Bookmarks({ sections, current, open, onPick }: BookmarksProps) {
  return (
    <div className="bookmarks" role="group" aria-label={COPY.bookmarksLabel}>
      {sections.map((section, i) => (
        <button
          key={section.id}
          type="button"
          className="bookmark"
          style={positions(i, current, sections.length) as CSSProperties}
          aria-label={`${section.navLabel}: ${section.title}, ${section.listings.length} ${COPY.places}`}
          aria-current={open && i === current ? 'page' : undefined}
          onClick={() => onPick(i)}
        >
          <span className="bookmark__label">{section.navLabel}</span>
        </button>
      ))}
    </div>
  );
}
