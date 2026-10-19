import { cn } from '../lib/cn';
import type { Listing } from '../types';
import { ActionLink } from './ActionLink';
import { CategoryTags } from './CategoryTags';
import { Highlight } from './Highlight';
import { PhoneLink } from './PhoneLink';
import { Rating } from './Rating';
import { VerifiedMark } from './VerifiedMark';

interface DirectoryEntryProps {
  listing: Listing;
  query: string;
  onNotify: (text: string) => void;
}

const Dot = () => (
  <span className="dot" aria-hidden="true">
    ·
  </span>
);

/** One directory entry:
 *  NAME ·························· number
 *  TAG · ★ 4.6 · Map
 *  Without a number, the action link takes the number's place. */
export function DirectoryEntry({ listing, query, onNotify }: DirectoryEntryProps) {
  const hasPhone = listing.phone !== null;
  return (
    <li className={cn('entry', listing.featured && 'entry--featured')}>
      <div className="entry__line">
        <h3 className="entry__name" translate="no">
          <Highlight text={listing.name} query={query} />
          {listing.verified && <VerifiedMark />}
        </h3>
        <span className="leader" aria-hidden="true" />
        {hasPhone ? (
          <PhoneLink name={listing.name} phone={listing.phone as string} onNotify={onNotify} />
        ) : (
          <span className="slot">
            <ActionLink listing={listing} slot />
          </span>
        )}
      </div>
      <div className="entry__meta">
        <CategoryTags categories={listing.categories} query={query} />
        {listing.rating !== null && (
          <>
            <Dot />
            <Rating value={listing.rating} />
          </>
        )}
        {listing.phoneNote && (
          <>
            <Dot />
            <span className="tabular-nums" translate="no">
              {listing.phoneNote}
            </span>
          </>
        )}
        {hasPhone && (
          <>
            <Dot />
            <ActionLink listing={listing} />
          </>
        )}
      </div>
    </li>
  );
}
