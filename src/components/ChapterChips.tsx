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

/** The index: one numbered tab per chapter (an anchor) plus Saved. Scrolls sideways on small screens. */
export function ChapterChips({ sections, activeId, view, savedCount, onJump, onToggleSaved }: ChapterChipsProps) {
  const handleJump = (sectionId: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    onJump(sectionId);
  };

  return (
    <nav aria-label="Index" className="min-w-0">
      <ul className="hide-scrollbar -mx-4 flex min-w-0 gap-1.5 overflow-x-auto px-4 pb-0.5">
        {sections.map((section) => (
          <li key={section.id} className="flex-none">
            <a
              href={`#${section.id}`}
              className="tab"
              aria-current={view === 'all' && activeId === section.id ? 'location' : undefined}
              onClick={handleJump(section.id)}
            >
              <span className="tab__num" aria-hidden="true">
                {section.number}
              </span>
              <span className="sr-only">{section.number}. </span>
              {CHAPTER_META[section.id]?.short ?? section.title}
            </a>
          </li>
        ))}
        <li className="flex-none">
          <button type="button" className="tab" aria-pressed={view === 'saved'} onClick={onToggleSaved}>
            <Icon name="heart" filled={view === 'saved'} className="h-4 w-4" />
            {COPY.saved}
            {savedCount > 0 && (
              <span className="tab__count">
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
