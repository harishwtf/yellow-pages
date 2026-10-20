import { useEffect, useRef, type MouseEvent } from 'react';
import { CHAPTER_META } from '../data/ui';
import type { Section } from '../types';

interface ChapterChipsProps {
  sections: Section[];
  activeId: string | null;
  onJump: (sectionId: string) => void;
}

/** The index: one numbered tab per chapter (an anchor). Scrolls sideways on small screens. */
export function ChapterChips({ sections, activeId, onJump }: ChapterChipsProps) {
  const handleJump = (sectionId: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    onJump(sectionId);
  };

  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const list = listRef.current;
    const tab = list?.querySelector('[aria-current]');
    if (!list || !tab) return;
    const t = tab.getBoundingClientRect();
    const l = list.getBoundingClientRect();
    if (t.left < l.left + 16 || t.right > l.right - 16) {
      list.scrollBy({ left: t.left - l.left - 16, behavior: 'smooth' });
    }
  }, [activeId]);

  return (
    <nav aria-label="Index" className="min-w-0">
      <ul ref={listRef} className="hide-scrollbar -mx-4 -my-1 flex min-w-0 gap-1.5 overflow-x-auto px-4 py-1">
        {sections.map((section) => (
          <li key={section.id} className="flex-none">
            <a
              href={`#${section.id}`}
              data-ink={CHAPTER_META[section.id]?.ink}
              className="tab tab--ink"
              aria-current={activeId === section.id ? 'location' : undefined}
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
      </ul>
    </nav>
  );
}
