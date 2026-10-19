import { forwardRef, type RefObject, useEffect, useRef } from 'react';
import { COPY, LINKS } from '../data/ui';
import type { Turn } from '../hooks/useBook';
import { cn } from '../lib/cn';
import type { Section } from '../types';
import { Bookmarks } from './Bookmarks';
import { LeftPage, RightPage } from './BookPages';
import { CoverArt } from './CoverArt';
import { MWave } from './icons';

interface BookStageProps {
  sections: Section[];
  current: number;
  shown: { left: number; right: number };
  turn: Turn | null;
  open: boolean;
  stageRef: RefObject<HTMLDivElement | null>;
  onOpenBook: () => void;
  onPick: (index: number) => void;
  onCopy: (phone: string) => void;
}

/** The notebook on the desk. Scrolling the track swings the cover open; bookmarks turn to a section. */
export const BookStage = forwardRef<HTMLDivElement, BookStageProps>(function BookStage(
  { sections, current, shown, turn, open, stageRef, onOpenBook, onPick, onCopy },
  trackRef,
) {
  const total = sections.reduce((n, s) => n + s.listings.length, 0);
  const leftScroll = useRef<HTMLDivElement>(null);
  const rightScroll = useRef<HTMLDivElement>(null);
  const prev = current > 0 ? sections[current - 1] : null;
  const next = current < sections.length - 1 ? sections[current + 1] : null;

  // A newly shown page starts at its top.
  useEffect(() => {
    leftScroll.current?.scrollTo({ top: 0 });
  }, [shown.left]);
  useEffect(() => {
    rightScroll.current?.scrollTo({ top: 0 });
  }, [shown.right]);

  const turnTo = (section: Section | null, label: string, arrow: 'back' | 'forward', className: string) =>
    section && (
      <button type="button" className={className} onClick={() => onPick(sections.indexOf(section))} aria-label={`${label}: ${section.navLabel}`}>
        {arrow === 'back' && <span aria-hidden="true">← </span>}
        {section.navLabel}
        {arrow === 'forward' && <span aria-hidden="true"> →</span>}
      </button>
    );

  return (
    <div ref={trackRef} className="track">
      <div ref={stageRef} className={cn('stage', open && 'is-open', turn && 'is-turning')}>
        <a href={LINKS.home} className="brand" target="_blank" rel="noopener noreferrer">
          <MWave className="brand__wave" title={`M, tellm.co (${COPY.newTab})`} />
        </a>

        <div className="book" role="region" aria-label={open ? `${COPY.bookLabel} ${sections[current].navLabel}` : COPY.title}>
          <Bookmarks sections={sections} current={current} open={open} onPick={onPick} />
          <div className="book__board" aria-hidden="true" />

          <div className="sheet sheet--right">
            <div ref={rightScroll} className="sheet__scroll" tabIndex={0} aria-label={sections[shown.right].navLabel}>
              <RightPage
                section={sections[shown.right]}
                index={shown.right}
                onCopy={onCopy}
                footer={
                  <nav className="turns only-single" aria-label={COPY.bookmarksLabel}>
                    {turnTo(prev, COPY.previous, 'back', 'turns__btn')}
                    {turnTo(next, COPY.next, 'forward', 'turns__btn turns__btn--next')}
                  </nav>
                }
              />
            </div>
            <div className="sheet__foot sheet__foot--right">{turnTo(next, COPY.next, 'forward', 'corner')}</div>
          </div>

          {turn && (
            <div key={turn.key} className={`leaf leaf--${turn.dir}`} aria-hidden="true" inert>
              <div className="leaf__face leaf__front sheet">
                <div className="sheet__scroll">
                  <RightPage section={sections[turn.front]} index={turn.front} onCopy={onCopy} />
                </div>
              </div>
              <div className="leaf__face leaf__back sheet">
                <div className="sheet__scroll">
                  <LeftPage section={sections[turn.back]} index={turn.back} onCopy={onCopy} />
                </div>
              </div>
            </div>
          )}

          <div className="cover">
            <div className="cover__face cover__front">
              <CoverArt total={total} />
              {!open && (
                <button type="button" className="cover__open" onClick={onOpenBook}>
                  <span className="sr-only">{COPY.openBook}</span>
                </button>
              )}
            </div>
            <div className="cover__face cover__back" aria-hidden="true" inert>
              {/* The left page as it swings over with the cover; once open, the flat copy below takes over. */}
              <div className="sheet sheet--left">
                <div className="sheet__scroll">
                  <LeftPage section={sections[shown.left]} index={shown.left} onCopy={onCopy} />
                </div>
              </div>
            </div>
          </div>

          <div className="sheet sheet--left sheet--flat">
            <div ref={leftScroll} className="sheet__scroll" tabIndex={open ? 0 : -1} aria-label={sections[shown.left].navLabel}>
              <LeftPage section={sections[shown.left]} index={shown.left} onCopy={onCopy} />
            </div>
            <div className="sheet__foot">{turnTo(prev, COPY.previous, 'back', 'corner')}</div>
          </div>
        </div>

        <p className="stage__hint" aria-hidden={open}>
          {COPY.openHint}
          <span aria-hidden="true">↓</span>
        </p>
      </div>
    </div>
  );
});
