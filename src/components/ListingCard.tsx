import { CIRCLE_RATING_FROM, COPY, OPEN_LABELS } from '../data/annotations';
import { copyText } from '../lib/clipboard';
import { cn } from '../lib/cn';
import { splitPhone, telHref } from '../lib/phone';
import { wobble } from '../lib/wobble';
import type { Listing } from '../types';
import { Highlight } from './Highlight';
import { HandArrow } from './ink/HandArrow';
import { HandCircle } from './ink/HandCircle';

export interface ListingCardProps {
  listing: Listing;
  query: string;
  isFavorite: boolean;
  onToggleFavorite: (listing: Listing) => void;
  onNotify: (text: string) => void;
  /** Handwritten note scribbled above this entry. */
  note?: string;
  /** Render as the sticky-note feature card with this handwritten line. */
  featuredNote?: string;
}

export function ListingCard({ listing, query, isFavorite, onToggleFavorite, onNotify, note, featuredNote }: ListingCardProps) {
  const openLabel = OPEN_LABELS[listing.linkType];
  const phone = listing.phone ? splitPhone(listing.phone) : null;
  const circled = listing.rating !== null && listing.rating >= CIRCLE_RATING_FROM;

  const handleCopy = async () => {
    if (!phone) return;
    const ok = await copyText(phone.primary);
    onNotify(ok ? COPY.copied : COPY.copyFailed);
  };

  const openLink = (className: string) => (
    <a
      href={listing.url}
      target="_blank"
      rel="noopener"
      className={className}
      aria-label={`${openLabel}: ${listing.name} (opens in a new tab)`}
    >
      {openLabel}
      <span aria-hidden="true"> ↗</span>
    </a>
  );

  const favoriteButton = (
    <button
      type="button"
      className={cn('icon-btn', isFavorite && 'text-pen-red')}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? `Remove ${listing.name} from My Page` : `Add ${listing.name} to My Page`}
      onClick={() => onToggleFavorite(listing)}
    >
      <StarIcon filled={isFavorite} />
    </button>
  );

  const titleRow = (
    <div className="leader-row">
      <h3 className="min-w-0 text-[1.05rem] font-bold uppercase leading-tight tracking-wide">
        <Highlight text={listing.name} query={query} />
      </h3>
      <span aria-hidden="true" className="leader" />
      {phone ? (
        <a className="phone" href={telHref(listing.phone as string)} aria-label={`Call ${listing.name}: ${phone.primary}`}>
          {phone.primary}
        </a>
      ) : (
        openLink('phone phone--link')
      )}
    </div>
  );

  const meta = (
    <p className="text-[0.92rem] leading-snug text-ink-soft">
      <Highlight text={listing.category} query={query} />
      {listing.rating !== null && (
        <>
          <span aria-hidden="true"> · </span>
          <HandCircle active={circled}>
            <span className="font-bold text-ink">
              <span aria-hidden="true">★ </span>
              <span className="sr-only">rated </span>
              {listing.rating.toFixed(1)}
            </span>
          </HandCircle>
        </>
      )}
    </p>
  );

  if (featuredNote) {
    return (
      <li className="listing relative -mx-1.5 px-1.5 py-4">
        <div className="sticky-note mx-1 rounded-sm" style={{ transform: `rotate(${wobble(listing.id).toFixed(2)}deg)` }}>
          <p className="hand-alt text-[1.7rem] leading-none text-pen-blue">
            {featuredNote}
            <HandArrow className="ml-1 h-5 w-10 align-middle" />
          </p>
          <div className="mt-4">{titleRow}</div>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            {meta}
            {favoriteButton}
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="listing relative -mx-1.5 px-1.5 py-2.5">
      {note && (
        <span aria-hidden="true" className="margin-note mb-1 ml-1">
          {note}
          <HandArrow direction="down" className="ml-1 h-4 w-7 align-middle" />
        </span>
      )}
      {titleRow}
      {phone?.extra && <p className="mt-1 text-right text-sm tabular-nums text-ink-soft">{phone.extra}</p>}
      <div className="mt-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        {meta}
        <div className="-my-1 flex items-center gap-1">
          {phone && (
            <button type="button" className="btn" onClick={handleCopy} aria-label={`Copy the number for ${listing.name}`}>
              Copy
            </button>
          )}
          {phone && openLink('btn')}
          {favoriteButton}
        </div>
      </div>
    </li>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 17.1 6.6 20l1.1-6.1L3.2 9.6l6.1-.8z" />
    </svg>
  );
}
