import { useMemo } from 'react';
import { CHAPTER_META } from '../data/ui';
import { groupByCategory } from '../lib/group';
import type { Listing, Section } from '../types';
import { CategoryFilter } from './CategoryFilter';
import { Highlight } from './Highlight';
import { ListingCard } from './ListingCard';

interface ChapterSectionProps {
  section: Section;
  /** Listings after search and category filtering. */
  listings: Listing[];
  query: string;
  /** The category chips. */
  filter: {
    selected: string | null;
    onSelect: (category: string | null) => void;
  };
  onNotify: (text: string) => void;
}

/** One chapter: its separator (double rule, numbered tab in the chapter's print colour, its name), the category
 *  chips, then its places under a printed bar per category, like a directory's sub-headings. */
export function ChapterSection({ section, listings, query, filter, onNotify }: ChapterSectionProps) {
  const categories = useMemo(() => Array.from(new Set(section.listings.map((l) => l.category))), [section.listings]);
  const groups = useMemo(() => groupByCategory(listings), [listings]);
  const meta = CHAPTER_META[section.id];
  const name = meta?.title ?? section.title;
  const subtitle = meta?.subtitle ?? section.subtitle;
  const headingId = `heading-${section.id}`;

  return (
    <section id={section.id} aria-labelledby={headingId} data-ink={meta?.ink}>
      <div className="rule-double" aria-hidden="true" />
      <div className="mt-3 flex items-center gap-3">
        <span className="num-tab num-tab--ink" aria-hidden="true">
          {section.number}
        </span>
        <div className="min-w-0">
          <h2
            id={headingId}
            className="font-display text-[1.5rem] font-bold uppercase leading-none tracking-[-0.005em] md:text-[1.8rem]"
          >
            <span className="sr-only">Chapter {section.number}: </span>
            {name}
          </h2>
          {subtitle && <p className="chapter__subtitle">{subtitle}</p>}
        </div>
      </div>
      {!query.trim() && (
        <div className="mt-3">
          <CategoryFilter
            categories={categories}
            selected={filter.selected}
            onSelect={filter.onSelect}
            sectionTitle={meta?.short ?? name}
          />
        </div>
      )}
      <div className="directory mt-3">
        {groups.map((group) => (
          <div key={group.category} className="group">
            <h3 className="subhead">
              <Highlight text={group.category} query={query} />
            </h3>
            <ul>
              {group.listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} query={query} onNotify={onNotify} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
