import { useEffect, useRef } from 'react';
import { COPY } from '../data/ui';
import type { Section } from '../types';

/** On phones and tablets: the sections as a row of tabs pinned to the top, in type you can read at a glance.
 *  The section being read is inked in; the row scrolls sideways when it doesn't fit and follows the reader. */
export function SectionIndex({ sections, active }: { sections: Section[]; active: string | null }) {
  const listRef = useRef<HTMLOListElement>(null);

  // Keep the current tab in view without moving the page.
  useEffect(() => {
    const list = listRef.current;
    const tab = active ? list?.querySelector<HTMLElement>(`[data-id="${active}"]`) : null;
    if (!list || !tab || list.scrollWidth <= list.clientWidth) return;
    const left = tab.offsetLeft - list.offsetLeft;
    if (left < list.scrollLeft + 12 || left + tab.offsetWidth > list.scrollLeft + list.clientWidth - 12) {
      list.scrollTo({ left: Math.max(0, left - 12), behavior: 'smooth' });
    }
  }, [active]);

  return (
    <nav className="index" aria-label={COPY.bookmarksLabel}>
      <ol ref={listRef} className="index__list">
        {sections.map((section, i) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              data-id={section.id}
              className="index__tab"
              aria-current={section.id === active ? 'true' : undefined}
            >
              <span className="index__no" aria-hidden="true">
                {i + 1}
              </span>
              <span className="index__label">{section.navLabel}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
