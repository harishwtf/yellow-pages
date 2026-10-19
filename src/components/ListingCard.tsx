import { COPY, FEATURED_LISTING_ID } from '../data/ui';
import { copyText } from '../lib/clipboard';
import { cn } from '../lib/cn';
import { splitPhone, telHref } from '../lib/phone';
import type { Listing } from '../types';
import { Highlight } from './Highlight';
import { Icon } from './icons';
import { OpenLink } from './OpenLink';

export interface ListingCardProps {
  listing: Listing;
  query: string;
  isSaved: boolean;
  onToggleSaved: (listing: Listing) => void;
  onNotify: (text: string) => void;
  /** Chapter name shown before the category when the card is outside its chapter (Saved view). */
  chapterLabel?: string;
}

/** One place: name, category and rating, then the number and links. */
export function ListingCard({ listing, query, isSaved, onToggleSaved, onNotify, chapterLabel }: ListingCardProps) {
  const phone = listing.phone ? splitPhone(listing.phone) : null;
  const featured = listing.id === FEATURED_LISTING_ID;

  const handleCopy = async () => {
    if (!phone) return;
    onNotify((await copyText(phone.primary)) ? COPY.copied : COPY.copyFailed);
  };

  return (
    <li className={cn('card', featured && 'card--featured')}>
      {featured && <span className="tag mb-2">{COPY.featuredTag}</span>}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[1.05rem] font-semibold leading-snug text-pretty" translate="no">
            <Highlight text={listing.name} query={query} />
          </h3>
          <p className="mt-0.5 text-[0.9rem] leading-snug text-muted break-words">
            {chapterLabel && <>{chapterLabel} · </>}
            <Highlight text={listing.category} query={query} />
            {listing.rating !== null && (
              <>
                <span aria-hidden="true"> · </span>
                <span className="font-medium text-ink tabular-nums">
                  <span aria-hidden="true">{'★ '}</span>
                  <span className="sr-only">rated </span>
                  {listing.rating.toFixed(1)}
                </span>
              </>
            )}
          </p>
        </div>
        <button
          type="button"
          className="icon-btn icon-btn--heart -mr-2 -mt-1.5 shrink-0"
          aria-pressed={isSaved}
          aria-label={isSaved ? `Remove ${listing.name} from saved` : `Save ${listing.name}`}
          onClick={() => onToggleSaved(listing)}
        >
          <Icon name="heart" filled={isSaved} />
        </button>
      </div>

      {featured && <p className="mt-2 text-[0.92rem] leading-snug text-ink/80 text-pretty">{COPY.featuredBlurb}</p>}

      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        {phone ? (
          <a className="phone" href={telHref(listing.phone as string)} aria-label={`Call ${listing.name}: ${phone.primary}`} translate="no">
            <Icon name="phone" />
            {phone.primary}
          </a>
        ) : (
          <span className="flex flex-wrap gap-2">
            <OpenLink listing={listing} variant="pill" />
            <OpenLink listing={listing} variant="pill" store="android" />
          </span>
        )}
        {phone && (
          <span className="-my-1 -mr-2 flex items-center">
            <button type="button" className="icon-btn" aria-label={`Copy the number for ${listing.name}`} onClick={handleCopy}>
              <Icon name="copy" />
            </button>
            <OpenLink listing={listing} variant="icon" />
            <OpenLink listing={listing} variant="icon" store="android" />
          </span>
        )}
      </div>
      {phone?.extra && (
        <p className="mt-1 text-xs text-muted tabular-nums" translate="no">
          {phone.extra}
        </p>
      )}
    </li>
  );
}
