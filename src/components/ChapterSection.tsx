import { useMemo } from 'react';
import { CHAPTER_META, COPY } from '../data/ui';
import { cn } from '../lib/cn';
import type { Listing, Section } from '../types';
import { CategoryFilter } from './CategoryFilter';
import { Icon } from './icons';
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
  const meta = CHAPTER_META[section.id];
  const categories = useMemo(() => Array.from(new Set(section.listings.map((l) => l.category))), [section.listings]);

  return (
    <section id={section.id} aria-labelledby={`heading-${section.id}`} className="scroll-mt-36">
      <div className="mb-3 flex items-center gap-3">
        <span className={cn('badge', meta?.tone)} aria-hidden="true">
          <Icon name={meta?.icon ?? 'pin'} />
        </span>
        <div className="min-w-0">
          <h2 id={`heading-${section.id}`} className="font-display text-[1.4rem] font-semibold leading-tight tracking-[-0.01em]">
            {section.title}
          </h2>
          <p className="text-sm text-muted">
            {listings.length} {COPY.places}
          </p>
        </div>
      </div>
      {!query.trim() && (
        <div className="mb-3">
          <CategoryFilter categories={categories} selected={selectedCategory} onSelect={onSelectCategory} sectionTitle={section.title} />
        </div>
      )}
      <ul className="flex flex-col gap-3">
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
