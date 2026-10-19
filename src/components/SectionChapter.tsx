import { useMemo } from 'react';
import { FEATURED_LISTING_ID, FEATURED_NOTE, SECTION_META } from '../data/annotations';
import type { Listing, Section } from '../types';
import { CategoryChips } from './CategoryChips';
import { HandCheckbox } from './ink/HandCheckbox';
import { ListingCard } from './ListingCard';

interface SectionChapterProps {
  section: Section;
  /** Listings after search and category filtering. */
  listings: Listing[];
  query: string;
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  done: boolean;
  onToggleDone: (done: boolean) => void;
  favorites: ReadonlySet<string>;
  onToggleFavorite: (listing: Listing) => void;
  onNotify: (text: string) => void;
}

export function SectionChapter({
  section,
  listings,
  query,
  selectedCategory,
  onSelectCategory,
  done,
  onToggleDone,
  favorites,
  onToggleFavorite,
  onNotify,
}: SectionChapterProps) {
  const meta = SECTION_META[section.id];
  const categories = useMemo(() => Array.from(new Set(section.listings.map((l) => l.category))), [section.listings]);
  const notedListingId = meta ? listings.find((l) => l.category === meta.note.beforeCategory)?.id : undefined;

  return (
    <section id={`section-${section.id}`} aria-labelledby={`heading-${section.id}`} className="chapter">
      <header className="halftone mb-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b-[3px] border-ink pb-3">
        <div className="flex items-center gap-3">
          <span className="chapter-num" aria-hidden="true">
            {section.number}
          </span>
          <div>
            <h2
              id={`heading-${section.id}`}
              className="font-display text-balance text-3xl font-bold uppercase leading-none tracking-tight md:text-5xl"
            >
              <span className="sr-only">Chapter {section.number}: </span>
              {section.title}
            </h2>
            {section.subtitle && <p className="mt-1 text-ink-soft">{section.subtitle}</p>}
          </div>
        </div>
        <HandCheckbox id={`done-${section.id}`} label="Done ✓" checked={done} onChange={onToggleDone} />
      </header>

      <div className="mb-4">
        <CategoryChips
          categories={categories}
          selected={selectedCategory}
          onSelect={onSelectCategory}
          sectionTitle={section.title}
        />
      </div>

      {listings.length > 0 ? (
        <ul className="directory-columns">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              query={query}
              isFavorite={favorites.has(listing.id)}
              onToggleFavorite={onToggleFavorite}
              onNotify={onNotify}
              note={listing.id === notedListingId ? meta?.note.text : undefined}
              featuredNote={listing.id === FEATURED_LISTING_ID ? FEATURED_NOTE : undefined}
            />
          ))}
        </ul>
      ) : (
        <p className="hand py-4 text-2xl text-pen-blue">nothing in this chapter matches</p>
      )}
    </section>
  );
}
