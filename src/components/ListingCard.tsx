import { useId, useState } from 'react';
import { COPY, FEATURED_LISTING_ID } from '../data/ui';
import { copyText } from '../lib/clipboard';
import { cn } from '../lib/cn';
import { localNumber, splitPhone, telHref } from '../lib/phone';
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
  /** Chapter name shown before the category when the row is outside its chapter (Saved view). */
  chapterLabel?: string;
}

/** One directory entry: two lines of print. Tap the name to unfold copy / open / save. */
export function ListingCard({ listing, query, isSaved, onToggleSaved, onNotify, chapterLabel }: ListingCardProps) {
  const phone = listing.phone ? splitPhone(listing.phone) : null;
  const featured = listing.id === FEATURED_LISTING_ID;
  const [open, setOpen] = useState(false);
  const actionsId = useId();

  const handleCopy = async () => {
    if (!phone) return;
    onNotify((await copyText(phone.primary)) ? `${COPY.copied} ${phone.primary}` : COPY.copyFailed);
  };

  const saveAction = (
    <button type="button" className={cn('action', isSaved && 'action--on')} aria-pressed={isSaved} onClick={() => onToggleSaved(listing)}>
      <Icon name="heart" filled={isSaved} />
      {isSaved ? COPY.savedLabel : COPY.saveLabel}
    </button>
  );

  const meta = (
    <>
      {chapterLabel && <>{chapterLabel} · </>}
      <Highlight text={listing.category} query={query} />
      {listing.rating !== null && (
        <>
          <span aria-hidden="true"> · </span>
          <span className="tabular-nums">
            <span aria-hidden="true">{'★ '}</span>
            <span className="sr-only">rated </span>
            {listing.rating.toFixed(1)}
          </span>
        </>
      )}
    </>
  );

  if (featured) {
    return (
      <li className="ad">
        <h3 className="font-display text-[1.35rem] font-bold uppercase leading-tight" translate="no">
          <Highlight text={listing.name} query={query} />
        </h3>
        <p className="mt-1.5 text-[1rem] leading-snug text-pretty">{COPY.featuredBlurb}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
          <OpenLink listing={listing} variant="text" />
          {saveAction}
        </div>
      </li>
    );
  }

  return (
    <li className={cn('row', open && 'row--open')}>
      <div className="leader-row">
        <h3 className="name min-w-0 text-pretty" translate="no">
          <button
            type="button"
            className="name__toggle"
            aria-expanded={open}
            aria-controls={actionsId}
            onClick={() => setOpen((current) => !current)}
          >
            <Highlight text={listing.name} query={query} />
          </button>
        </h3>
        <span aria-hidden="true" className="leader" />
        {phone ? (
          <span className="inline-flex items-center">
            <a className="num" href={telHref(listing.phone as string)} aria-label={`Call ${listing.name}: ${phone.primary}`} translate="no">
              {localNumber(phone.primary)}
            </a>
            <button type="button" className="copy-btn" aria-label={`Copy the number for ${listing.name}`} title={COPY.copyLabel} onClick={handleCopy}>
              <Icon name="copy" />
            </button>
          </span>
        ) : (
          <span className="-my-2 -mr-2 flex items-center">
            <OpenLink listing={listing} variant="mark" />
            <OpenLink listing={listing} variant="mark" store="android" />
          </span>
        )}
      </div>
      <p className="mt-0.5 text-[0.9rem] leading-snug text-muted break-words">
        {meta}
        {isSaved && !open && (
          <span className="ml-1.5 inline-block align-[-0.1em] text-accent" aria-hidden="true">
            <Icon name="heart" filled className="h-3.5 w-3.5" />
          </span>
        )}
      </p>
      <div id={actionsId} hidden={!open} className="actions">
        {phone && <OpenLink listing={listing} variant="text" />}
        {phone && <OpenLink listing={listing} variant="text" store="android" />}
        {saveAction}
        {phone?.extra && <span className="text-[0.8rem] text-muted tabular-nums">{phone.extra}</span>}
      </div>
    </li>
  );
}
