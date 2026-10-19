import type { MouseEvent } from 'react';
import { SECTION_META } from '../data/annotations';
import type { Section } from '../types';
import { HandCheck } from './ink/HandCheck';

interface SectionNavProps {
  sections: Section[];
  activeId: string | null;
  doneIds: ReadonlySet<string>;
  favoriteCount: number;
  favoritesOpen: boolean;
  onSelect: (sectionId: string) => void;
  onOpenFavorites: () => void;
}

/** Thumb-index tabs: a horizontal sticky strip on small screens, a vertical stack on the right edge on desktop. */
export function SectionNav({
  sections,
  activeId,
  doneIds,
  favoriteCount,
  favoritesOpen,
  onSelect,
  onOpenFavorites,
}: SectionNavProps) {
  const doneCount = sections.filter((section) => doneIds.has(section.id)).length;

  const handleTabClick = (sectionId: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    // Leave modifier clicks and middle clicks to the browser (new tab, etc.).
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    onSelect(sectionId);
  };

  return (
    <nav aria-label="Chapters" className="thumb-index">
      <ol className="thumb-index__list">
        {sections.map((section) => {
          const done = doneIds.has(section.id);
          return (
            <li key={section.id} className="flex">
              <a
                href={`#section-${section.id}`}
                className="thumb-tab"
                aria-current={activeId === section.id ? 'true' : undefined}
                onClick={handleTabClick(section.id)}
              >
                <span className="thumb-tab__num" aria-hidden="true">
                  {section.number}
                </span>
                <span>{SECTION_META[section.id]?.short ?? section.title}</span>
                {done && (
                  <>
                    <HandCheck className="thumb-tab__tick" />
                    <span className="sr-only">(done)</span>
                  </>
                )}
              </a>
            </li>
          );
        })}
        <li className="flex lg:mt-3">
          <button
            type="button"
            id="my-page-trigger"
            className="thumb-tab"
            aria-haspopup="dialog"
            aria-expanded={favoritesOpen}
            onClick={onOpenFavorites}
          >
            <span className="thumb-tab__num" aria-hidden="true">
              ★
            </span>
            <span>My&nbsp;Page</span>
            {favoriteCount > 0 && (
              <span className="rounded-full bg-pen-red px-1.5 py-0.5 text-[0.68rem] leading-none text-white tabular-nums lg:absolute lg:-left-2 lg:-top-2">
                {favoriteCount}
                <span className="sr-only"> starred</span>
              </span>
            )}
          </button>
        </li>
      </ol>
      <p className="thumb-index__progress tabular-nums">
        <span aria-hidden="true">
          {doneCount}/{sections.length} done
        </span>
        <span className="sr-only">
          {doneCount} of {sections.length} chapters done
        </span>
      </p>
    </nav>
  );
}
