import type { MouseEvent } from 'react';
import { CHAPTER_META, COPY } from '../data/ui';
import type { Section } from '../types';
import { Icon } from './icons';

interface ChapterChipsProps {
  sections: Section[];
  activeId: string | null;
  view: 'all' | 'saved';
  savedCount: number;
  onJump: (sectionId: string) => void;
  onToggleSaved: () => void;
}

/** One chip per chapter (an anchor) plus the Saved view. Scrolls horizontally on small screens. */
export function ChapterChips({ sections, activeId, view, savedCount, onJump, onToggleSaved }: ChapterChipsProps) {
  const handleJump = (sectionId: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    onJump(sectionId);
  };

  return (
    <nav aria-label="Chapters" className="min-w-0">
      <ul className="hide-scrollbar -mx-4 flex min-w-0 gap-2 overflow-x-auto px-4 pb-0.5">
        {sections.map((section) => {
          const meta = CHAPTER_META[section.id];
          return (
            <li key={section.id} className="flex-none">
              <a
                href={`#${section.id}`}
                className="chip"
                aria-current={view === 'all' && activeId === section.id ? 'location' : undefined}
                onClick={handleJump(section.id)}
              >
                <Icon name={meta?.icon ?? 'pin'} />
                {meta?.short ?? section.title}
              </a>
            </li>
          );
        })}
        <li className="flex-none">
          <button type="button" className="chip" aria-pressed={view === 'saved'} onClick={onToggleSaved}>
            <Icon name="heart" filled={view === 'saved'} />
            {COPY.saved}
            {savedCount > 0 && (
              <span className="chip__count">
                {savedCount}
                <span className="sr-only"> saved</span>
              </span>
            )}
          </button>
        </li>
      </ul>
    </nav>
  );
}
