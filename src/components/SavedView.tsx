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
      <div className="rule-double" aria-hidden="true" />
      <h2 id="saved-heading" className="mt-3 font-display text-[1.5rem] font-bold uppercase leading-none md:text-[1.8rem]">
        {COPY.saved}
      </h2>
      <p className="mt-1 text-[0.95rem] text-muted">{COPY.savedIntro}</p>
      {items.length === 0 ? (
        <EmptyState icon="heart" title={COPY.savedEmpty} hint={COPY.savedEmptyHint} />
      ) : (
        <ul className="directory mt-2">
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
