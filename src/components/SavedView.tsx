import { COPY } from '../data/ui';
import type { Listing } from '../types';
import { DirectoryEntry } from './DirectoryEntry';
import { EmptyState } from './EmptyState';

export interface SavedItem {
  listing: Listing;
  chapterLabel: string;
}

interface SavedViewProps {
  items: SavedItem[];
  query: string;
  onToggleSaved: (listing: Listing) => void;
  onNotify: (text: string) => void;
}

/** Saved places, as the same directory lines with their chapter and category in front. */
export function SavedView({ items, query, onToggleSaved, onNotify }: SavedViewProps) {
  return (
    <section aria-labelledby="saved-heading">
      <h2 id="saved-heading" className="font-display text-[1.6rem] font-extrabold leading-none md:text-[2rem]">
        {COPY.saved}
      </h2>
      <p className="mt-1 text-[0.95rem] text-muted">{COPY.savedIntro}</p>
      {items.length === 0 ? (
        <EmptyState icon="heart" title={COPY.savedEmpty} hint={COPY.savedEmptyHint} />
      ) : (
        <ul className="grouped mt-4">
          {items.map(({ listing, chapterLabel }) => (
            <DirectoryEntry
              key={listing.id}
              listing={listing}
              query={query}
              isSaved
              onToggleSaved={onToggleSaved}
              onNotify={onNotify}
              context={`${chapterLabel} · ${listing.category}`}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
