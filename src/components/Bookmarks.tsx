import type { CSSProperties } from 'react';
import { BOOKMARK_BREAKS, COPY } from '../data/ui';
import type { Section } from '../types';

/** How far each slip sticks out of the book (px): uneven when closed, as if slipped in by hand. */
const CLOSED_OUT = [70, 80, 66, 77, 72, 84];
const OPEN_OUT = 70;
const CURRENT_OUT = 86;
/** A slight, fixed tilt per slip (degrees). */
const TILT = [-2.2, 1.4, -0.8, 2, -1.6, 1];
/** Slip width and spacing in % of the book's width (a two-page spread). */
const SPREAD = { w: 7.1, step: 7.7, edge: 2.5 };

interface BookmarksProps {
  sections: Section[];
  /** The spread where each section starts. */
  startStep: number[];
  /** The spread the book rests on; while a page turns, the slips travel towards spread + 1. */
  step: number;
  turns: number;
  /** The section being read at each spread, so its slip can stand up. */
  readingByStep: number[];
  /** Which section is current right now (it is yellow). */
  currentSection: number;
  open: boolean;
  onPick: (index: number) => void;
}

/** Where slip i sits on spread s, in % of the book's width: pages already turned carry their slips on the
 *  left, pages still ahead on the right, and the spread's own sections stand over the gutter. */
function openX(i: number, s: number, starts: number[]) {
  const behind = starts.filter((t, j) => j < i && t < s).length;
  const ahead = starts.filter((t, j) => j > i && t > s).length;
  const here = starts.map((t, j) => (t === s ? j : -1)).filter((j) => j >= 0);
  if (starts[i] < s) return SPREAD.edge + behind * SPREAD.step;
  if (starts[i] > s) return 100 - SPREAD.edge - SPREAD.w - ahead * SPREAD.step;
  return 50 - SPREAD.w / 2 + (here.indexOf(i) - (here.length - 1) / 2) * SPREAD.step;
}

/** How far slip i stands out on spread s: taller for the sections on that spread. */
const openOut = (i: number, s: number, starts: number[], reading: number[]) =>
  i === reading[s] || starts[i] === s ? CURRENT_OUT : OPEN_OUT;

/** CSS variables for one slip. The browser blends them: closed → open with --p as the cover swings, and
 *  spread → next spread with --f as the page turns, so every slip moves (and changes colour) in step with
 *  the paper: the slip being left fades from yellow to cream while the next one fades in. */
function placement(i: number, n: number, starts: number[], step: number, turns: number, reading: number[], current: number) {
  const next = Math.min(step + 1, turns);
  const yellowHere = i === current ? 1 : 0;
  const coverFrom = 50 + SPREAD.edge;
  const coverTo = 100 - SPREAD.edge - SPREAD.w;
  return {
    '--xc': coverFrom + (i * (coverTo - coverFrom)) / (n - 1),
    '--xa': openX(i, step, starts),
    '--xb': openX(i, next, starts),
    '--hc': CLOSED_OUT[i % CLOSED_OUT.length],
    '--ha': openOut(i, step, starts, reading),
    '--hb': openOut(i, next, starts, reading),
    '--ya': yellowHere,
    '--yb': next === step ? yellowHere : i === reading[next] ? 1 : 0,
    '--bw': SPREAD.w,
    '--tilt': TILT[i % TILT.length],
  };
}

export function Bookmarks({ sections, startStep, step, turns, readingByStep, currentSection, open, onPick }: BookmarksProps) {
  return (
    <div className="bookmarks" role="group" aria-label={COPY.bookmarksLabel}>
      {sections.map((section, i) => (
        <button
          key={section.id}
          type="button"
          className="bookmark"
          style={placement(i, sections.length, startStep, step, turns, readingByStep, currentSection) as CSSProperties}
          aria-label={`${section.navLabel}: ${section.title}, ${section.listings.length} ${COPY.places}`}
          aria-current={open && i === currentSection ? 'page' : undefined}
          onClick={(event) => {
            event.stopPropagation();
            onPick(i);
          }}
        >
          <span className="bookmark__paper" aria-hidden="true">
            <span className={section.navLabel.length > 9 ? 'bookmark__label bookmark__label--long' : 'bookmark__label'}>
              {BOOKMARK_BREAKS[section.id] ?? section.navLabel}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
