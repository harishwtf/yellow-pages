import { useEffect, useRef, type MouseEvent } from 'react';
import { COPY } from '../data/ui';
import { cn } from '../lib/cn';
import { isPlainClick, jumpTo } from '../lib/jump';

export interface SectionTab {
  id: string;
  label: string;
  count: number;
  active: boolean;
  /** No listings match the current search. */
  empty: boolean;
}

interface NavProps {
  tabs: SectionTab[];
}

const follow = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
  if (!isPlainClick(event)) return;
  event.preventDefault();
  jumpTo(id);
};

/** Small screens: a strip of tabs that sticks to the top and scrolls sideways. */
export function TabStrip({ tabs }: NavProps) {
  const list = useRef<HTMLUListElement>(null);
  const activeId = tabs.find((tab) => tab.active)?.id;

  useEffect(() => {
    const container = list.current;
    const tab = container?.querySelector<HTMLElement>('[aria-current]');
    if (!container || !tab) return;
    const left = tab.offsetLeft - (container.clientWidth - tab.offsetWidth) / 2;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    container.scrollTo({ left, behavior: reduced ? 'auto' : 'smooth' });
  }, [activeId]);

  return (
    <nav aria-label={COPY.sectionsNav} className="tab-strip xl:hidden">
      <ul ref={list} className="tab-strip__list">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <a
              href={`#${tab.id}`}
              className={cn('tab', tab.empty && 'tab--empty')}
              aria-current={tab.active ? 'location' : undefined}
              onClick={follow(tab.id)}
            >
              {tab.label}
              <span className="tab__count">
                {tab.count}
                <span className="sr-only"> {tab.count === 1 ? 'listing' : 'listings'}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Wide screens: thumb-index tabs down the right edge of the page. */
export function ThumbIndex({ tabs }: NavProps) {
  return (
    <nav aria-label={COPY.sectionsNav} className="thumb-index hidden xl:flex">
      {tabs.map((tab) => (
        <a
          key={tab.id}
          href={`#${tab.id}`}
          className={cn('thumb', tab.empty && 'thumb--empty')}
          aria-current={tab.active ? 'location' : undefined}
          onClick={follow(tab.id)}
        >
          {tab.label}
          <span className="tab__count">
            {tab.count}
            <span className="sr-only"> {tab.count === 1 ? 'listing' : 'listings'}</span>
          </span>
        </a>
      ))}
    </nav>
  );
}
