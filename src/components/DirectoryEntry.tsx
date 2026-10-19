import { COPY, TOP_RATED_FROM } from '../data/ui';
import { copyText } from '../lib/clipboard';
import { cn } from '../lib/cn';
import { localNumber, splitPhone, telHref } from '../lib/phone';
import type { Listing } from '../types';
import { Highlight } from './Highlight';
import { Icon } from './icons';
import { OpenLink } from './OpenLink';

interface DirectoryEntryProps {
  listing: Listing;
  query: string;
  isSaved: boolean;
  onToggleSaved: (listing: Listing) => void;
  onNotify: (text: string) => void;
  /** Shown before the rating when the entry is outside its chapter, e.g. "Kitchen · Gas" on the Saved view. */
  context?: string;
}

/** One directory line. Everything is visible and one tap away:
 *  NAME ······ number ⧉   (tap the number to call, ⧉ to copy)
 *  ★ 4.6  Top rated!                 ◎  ♡   (map / website / stores, save) */
export function DirectoryEntry({ listing, query, isSaved, onToggleSaved, onNotify, context }: DirectoryEntryProps) {
  const phone = listing.phone ? splitPhone(listing.phone) : null;
  const topRated = listing.rating !== null && listing.rating >= TOP_RATED_FROM;

  const handleCopy = async () => {
    if (!phone) return;
    onNotify((await copyText(phone.primary)) ? `${COPY.copied} ${phone.primary}` : COPY.copyFailed);
  };

  return (
    <li className="entry">
      <div className="leader-row">
        <h4 className="name min-w-0 text-pretty" translate="no">
          <Highlight text={listing.name} query={query} />
        </h4>
        <span aria-hidden="true" className="leader" />
        {phone ? (
          <span className="inline-flex items-center whitespace-nowrap">
            <a className="num" href={telHref(listing.phone as string)} aria-label={`Call ${listing.name}: ${phone.primary}`} translate="no">
              {localNumber(phone.primary)}
            </a>
            <button type="button" className="copy-btn" aria-label={`Copy the number for ${listing.name}`} title={COPY.copyLabel} onClick={handleCopy}>
              <Icon name="copy" />
            </button>
          </span>
        ) : (
          <span className="inline-flex items-center gap-3 whitespace-nowrap">
            <OpenLink listing={listing} variant="text" />
            <OpenLink listing={listing} variant="text" store="android" />
          </span>
        )}
      </div>
      <div className="entry__meta">
        <p className="min-w-0 text-[0.88rem] text-muted tabular-nums">
          {context && (
            <>
              <Highlight text={context} query={query} />
              {listing.rating !== null && <span aria-hidden="true"> · </span>}
            </>
          )}
          {listing.rating !== null && (
            <>
              <span aria-hidden="true">★ </span>
              <span className="sr-only">Rated </span>
              {listing.rating.toFixed(1)}
            </>
          )}
          {topRated && <span className="tag-top">{COPY.topRated}</span>}
          {phone?.extra && (
            <span className="ml-2" translate="no">
              {phone.extra}
            </span>
          )}
        </p>
        <span className="entry__icons">
          {phone && <OpenLink listing={listing} variant="mark" />}
          {phone && <OpenLink listing={listing} variant="mark" store="android" />}
          <button
            type="button"
            className={cn('icon-btn', isSaved && 'icon-btn--saved')}
            aria-pressed={isSaved}
            aria-label={isSaved ? `Remove ${listing.name} from saved` : `Save ${listing.name}`}
            onClick={() => onToggleSaved(listing)}
          >
            <Icon name="heart" filled={isSaved} />
          </button>
        </span>
      </div>
    </li>
  );
}
