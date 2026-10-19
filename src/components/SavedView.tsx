import { COPY } from '../data/ui';
import type { Listing } from '../types';
import { EmptyState } from './EmptyState';
import { ListingCard } from './ListingCard';

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

export function SavedView({ items, query, onToggleSaved, onNotify }: SavedViewProps) {
  return (
    <section aria-labelledby="saved-heading">
      <h2 id="saved-heading" className="font-display text-[1.4rem] font-semibold leading-tight tracking-[-0.01em]">
        {COPY.saved}
      </h2>
      <p className="mt-1 text-sm text-muted">{COPY.savedIntro}</p>
      {items.length === 0 ? (
        <EmptyState icon="heart" title={COPY.savedEmpty} hint={COPY.savedEmptyHint} />
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {items.map(({ listing, chapterLabel }) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              query={query}
              isSaved
              onToggleSaved={onToggleSaved}
              onNotify={onNotify}
              chapterLabel={chapterLabel}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
