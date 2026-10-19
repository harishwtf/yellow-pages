import { useMemo } from 'react';
import { FEATURED_LISTING_ID } from '../data/ui';
import { groupByCategory } from '../lib/group';
import type { Listing, Section } from '../types';
import { DirectoryEntry } from './DirectoryEntry';
import { FeaturedCard } from './FeaturedCard';

interface ChapterSectionProps {
  section: Section;
  /** Listings after search. */
  listings: Listing[];
  query: string;
  saved: ReadonlySet<string>;
  onToggleSaved: (listing: Listing) => void;
  onNotify: (text: string) => void;
}

/** A chapter set like a phone-book page: category headings, one line per place. */
export function ChapterSection({ section, listings, query, saved, onToggleSaved, onNotify }: ChapterSectionProps) {
  const groups = useMemo(() => groupByCategory(listings), [listings]);

  return (
    <section id={section.id} aria-labelledby={`heading-${section.id}`} className="scroll-mt-32">
      <div className="flex items-center gap-3">
        <span className="num-tab" aria-hidden="true">
          {section.number}
        </span>
        <h2
          id={`heading-${section.id}`}
          className="min-w-0 font-display text-[1.6rem] font-extrabold leading-[1.05] tracking-[-0.015em] text-balance md:text-[2rem]"
        >
          <span className="sr-only">Chapter {section.number}: </span>
          {section.title}
        </h2>
      </div>
      <div className="grouped mt-4">
        {groups.map(({ category, items }) => (
          <div key={category} className="group">
            <h3 className="cat-head">{category}</h3>
            <ul>
              {items.map((listing) =>
                listing.id === FEATURED_LISTING_ID ? (
                  <FeaturedCard
                    key={listing.id}
                    listing={listing}
                    query={query}
                    isSaved={saved.has(listing.id)}
                    onToggleSaved={onToggleSaved}
                  />
                ) : (
                  <DirectoryEntry
                    key={listing.id}
                    listing={listing}
                    query={query}
                    isSaved={saved.has(listing.id)}
                    onToggleSaved={onToggleSaved}
                    onNotify={onNotify}
                  />
                ),
              )}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
