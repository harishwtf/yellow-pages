import { useMemo } from 'react';
import type { Listing, Section } from '../types';
import { CategoryFilter } from './CategoryFilter';
import { ListingCard } from './ListingCard';

interface ChapterSectionProps {
  section: Section;
  /** Listings after search and category filtering. */
  listings: Listing[];
  query: string;
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  saved: ReadonlySet<string>;
  onToggleSaved: (listing: Listing) => void;
  onNotify: (text: string) => void;
}

export function ChapterSection({
  section,
  listings,
  query,
  selectedCategory,
  onSelectCategory,
  saved,
  onToggleSaved,
  onNotify,
}: ChapterSectionProps) {
  const categories = useMemo(() => Array.from(new Set(section.listings.map((l) => l.category))), [section.listings]);

  return (
    <section id={section.id} aria-labelledby={`heading-${section.id}`} className="scroll-mt-32">
      <div className="rule-double" aria-hidden="true" />
      <div className="mt-3 flex items-center gap-3">
        <span className="num-tab" aria-hidden="true">
          {section.number}
        </span>
        <div className="min-w-0">
          <h2 id={`heading-${section.id}`} className="font-display text-[1.5rem] font-bold uppercase leading-none tracking-[-0.005em] md:text-[1.8rem]">
            <span className="sr-only">Chapter {section.number}: </span>
            {section.title}
          </h2>
        </div>
      </div>
      {!query.trim() && (
        <div className="mt-2.5">
          <CategoryFilter categories={categories} selected={selectedCategory} onSelect={onSelectCategory} sectionTitle={section.title} />
        </div>
      )}
      <ul className="directory mt-1">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            query={query}
            isSaved={saved.has(listing.id)}
            onToggleSaved={onToggleSaved}
            onNotify={onNotify}
          />
        ))}
      </ul>
    </section>
  );
}
