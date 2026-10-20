import { useEffect, useMemo, useRef, useState } from 'react';
import { COPY } from '../data/ui';
import { useBookScroll } from '../hooks/useBookScroll';
import { usePagination } from '../hooks/usePagination';
import { cn } from '../lib/cn';
import { bookPages, sectionItems, sectionStarts } from '../lib/pages';
import type { Section } from '../types';
import { BookPage, type Flash, PageItem } from './BookPage';
import { Bookmarks } from './Bookmarks';
import { HomeLink } from './HomeLink';
import { PhoneBookCover } from './PhoneBookCover';
import { SearchButton, type SearchHit, SearchPanel } from './SearchPanel';

const noop = () => {};

/** The guide as a phone book, on screens wide enough for a two-page spread (phones get PhoneDirectory).
 *  Scrolling opens the cover, then turns one spread per stretch of scroll; clicking the left or right side
 *  of the book goes back or forward; bookmarks jump to a section. Pages are filled by measurement, so
 *  nothing scrolls inside a page: what doesn't fit turns over. */
export function Book({ sections, onCopy }: { sections: Section[]; onCopy: (phone: string) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  const perSection = useMemo(() => sectionItems(sections), [sections]);
  const directory = usePagination(perSection, measureRef);
  const pages = useMemo(() => bookPages(directory), [directory]);
  const turns = Math.max(0, pages.length / 2 - 1);
  const { open, step, goTo, snaps, height, reduced } = useBookScroll(trackRef, stageRef, turns);
  const total = sections.reduce((n, s) => n + s.listings.length, 0);

  /** Book page index where each section starts. */
  const starts = useMemo(() => sectionStarts(pages), [pages]);
  const toStep = (pageIndex: number) => Math.floor(pageIndex / 2);
  const startStep = sections.map((s) => toStep(starts[s.id] ?? 0));
  /** The section being read: the one on the left page, or on the right when the left isn't a directory page. */
  const sectionOn = (pageIndex: number) => {
    const page = pages[pageIndex];
    return page?.kind === 'section' ? sections.findIndex((s) => s.id === page.section.id) : -1;
  };
  /** The section on a spread, or -1 on the title/contents and notes/closing spreads. */
  const readingAt = (s: number) => {
    const left = sectionOn(s * 2);
    return left >= 0 ? left : sectionOn(s * 2 + 1);
  };
  const readingByStep = Array.from({ length: turns + 1 }, (_, s) => readingAt(s));
  const reading = readingByStep[step] ?? -1;
  /** A tapped bookmark stays the current one while its spread is open, even if it shares the spread. */
  const [picked, setPicked] = useState<number | null>(null);
  const currentSection = picked !== null && startStep[picked] === step ? picked : reading;
  /** Picking a section always answers: the book turns there (if it isn't already open there), its bookmark
   *  lights up and its title gets a highlighter swipe, even when it was already on the open spread. */
  const [flash, setFlash] = useState<Flash | null>(null);
  const goToSection = (id: string) => {
    const index = sections.findIndex((s) => s.id === id);
    if (index >= 0) setPicked(index);
    setFlash({ id, key: Date.now() });
    goTo(toStep(starts[id] ?? 0));
  };

  /** Search: the book turns to the page with that place, and the place gets a highlighter swipe. */
  const [searching, setSearching] = useState(false);
  const openPlace = ({ listing, section }: SearchHit) => {
    setSearching(false);
    const at = pages.findIndex((p) => p.kind === 'section' && p.items.some((i) => i.kind === 'entry' && i.listing.id === listing.id));
    if (at < 0) return;
    setPicked(sections.indexOf(section));
    setFlash({ id: listing.id, key: Date.now() });
    goTo(toStep(at));
  };

  // A link to a section (#kitchen) opens the book there, once the pages are laid out.
  const linked = useRef(false);
  useEffect(() => {
    if (linked.current || !directory.length) return;
    linked.current = true;
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id in starts) goTo(Math.floor(starts[id] / 2), true);
  }, [directory.length, starts, goTo]);

  // The hash follows the section being read, so the address can be shared.
  // Back on the closed cover, the address drops the section again.
  const sectionId = sections[currentSection]?.id;
  const wasOpen = useRef(false);
  useEffect(() => {
    try {
      if (open && sectionId) {
        wasOpen.current = true;
        window.history.replaceState(window.history.state, '', `#${sectionId}`);
      } else if (wasOpen.current) {
        window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}`);
      }
    } catch {
      // History API unavailable.
    }
  }, [open, sectionId]);

  const back = () => goTo(open ? step - 1 : -1);
  const forward = () => goTo(open ? step + 1 : 0);



  const page = (index: number, side: 'left' | 'right') =>
    pages[index] ? (
      <BookPage
        page={pages[index]}
        number={index}
        side={side}
        sections={sections}
        starts={starts}
        onCopy={onCopy}
        onGoTo={goToSection}
        flash={flash}
      />
    ) : null;

  const hasLeaf = step < turns;
  const L = step * 2;
  const R = L + 1;

  return (
    <div ref={trackRef} className="track" style={{ height }}>
      {snaps.map((top) => (
        <span key={top} className="snap" style={{ top }} aria-hidden="true" />
      ))}
      <div ref={stageRef} className={cn('stage', 'is-spread', open && 'is-open', reduced && 'is-reduced')}>
        <HomeLink
          onHome={() => {
            setPicked(null);
            goTo(-1);
          }}
        />
        <SearchButton onOpen={() => setSearching(true)} />
        {searching && <SearchPanel sections={sections} onClose={() => setSearching(false)} onPick={openPlace} />}
        <div
          ref={bookRef}
          className="book"
          role="region"
          aria-label={open ? `${COPY.bookLabel} ${sections[currentSection]?.navLabel ?? COPY.contents}` : COPY.title}
        >
          <Bookmarks
            sections={sections}
            startStep={startStep}
            step={step}
            turns={turns}
            readingByStep={readingByStep}
            currentSection={currentSection}
            open={open}
            onPick={(i) => goToSection(sections[i].id)}
          />
          <span className="book__board book__board--right" aria-hidden="true" />
          <span className="book__board book__board--left" aria-hidden="true" />

          {/* A hidden page the same size as the real ones, used to measure every item. */}
          <div ref={measureRef} className="sheet sheet--right sheet--measure" aria-hidden="true" inert>
            <div className="sheet__inner">
              <p className="sheet__head">
                <span className="sheet__guide">Measure</span>
              </p>
              <div className="sheet__body">
                {perSection.flat().map((item) => (
                  <div key={item.key} data-key={item.key} data-kind={item.kind}>
                    <PageItem item={item} onCopy={noop} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sheet sheet--left">{page(L, 'left')}</div>
          <div className="sheet sheet--right" inert={hasLeaf} aria-hidden={hasLeaf || undefined}>
            {page(hasLeaf ? R + 2 : R, 'right')}
          </div>
          {hasLeaf && (
            <div className="leaf">
              <div className="leaf__face leaf__front sheet">{page(R, 'right')}</div>
              <div className="leaf__face leaf__back sheet" inert aria-hidden="true">
                {page(R + 1, 'left')}
              </div>
            </div>
          )}

          <div className="cover">
            <div className="cover__face cover__front" onClick={() => !open && forward()}>
              <PhoneBookCover sections={sections} total={total} />
            </div>
            <div className="cover__face cover__back" inert aria-hidden="true">
              <div className="sheet sheet--left">{page(0, 'left')}</div>
            </div>
          </div>

          {/* The outer margins of the open book turn the page: back on the left, forward on the right.
              They cover only the board and the page margin, never the listings. */}
          {open && (
            <>
              <span className="turn-zone turn-zone--prev" onClick={back} aria-hidden="true" />
              {step < turns && <span className="turn-zone turn-zone--next" onClick={forward} aria-hidden="true" />}
            </>
          )}

          <button type="button" className="edge edge--prev" onClick={back} aria-label={COPY.previousPage} disabled={!open}>
            <span aria-hidden="true">‹</span>
          </button>
          <button type="button" className="edge edge--next" onClick={forward} aria-label={open ? COPY.nextPage : COPY.openBook} disabled={open && step >= turns}>
            <span aria-hidden="true">›</span>
          </button>
        </div>

        <p className="stage__hint" aria-hidden="true">
          {COPY.openHint}
          <span>↓</span>
        </p>
      </div>
    </div>
  );
}
