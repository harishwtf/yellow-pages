import { ACTION_LABELS, COPY, TOP_RATED_FROM } from '../data/ui';
import { cn } from '../lib/cn';
import { localNumber, telHref, whatsappHref } from '../lib/phone';
import type { Listing } from '../types';
import { ArrowUpRight, CopyIcon, VerifiedMark } from './icons';

interface ListEntryProps {
  listing: Listing;
  onCopy: (phone: string) => void;
  /** Set when search has just brought the reader here: the row gets a highlighter swipe. */
  flashKey?: number;
}

/** One directory line on a phone. The whole first line is the main action, at least 44px tall:
 *  NAME ··········· 98833 33123   [⧉]      tap the line to call; ⧉ copies
 *  ★ 4.8  Top rated!            Website ↗
 *  A place with no number opens its link from the first line instead. */
export function ListEntry({ listing, onCopy, flashKey }: ListEntryProps) {
  const { name, phone, phoneNote, rating, url, linkType } = listing;
  const top = rating !== null && rating >= TOP_RATED_FROM;
  const whatsapp = phoneNote ? whatsappHref(phoneNote) : null;
  const action = ACTION_LABELS[linkType];
  const verified = listing.verified && (
    <>
      {' '}
      <VerifiedMark label={COPY.verified} />
    </>
  );

  return (
    <div id={`place-${listing.id}`} className={cn('le', listing.featured && 'le--featured', !phone && 'le--no-phone')}>
      {flashKey !== undefined && <span key={flashKey} className="place-flash" aria-hidden="true" />}
      {phone ? (
        <a href={telHref(phone)} className="le__main" aria-label={`${COPY.call} ${name}, ${phone}`}>
          <span className="le__name" translate="no">
            {name}
            {verified}
          </span>
          <span className="leader" aria-hidden="true" />
          <span className="le__num">{localNumber(phone)}</span>
        </a>
      ) : (
        <a href={url} target="_blank" rel="noopener noreferrer" className="le__main">
          <span className="le__name" translate="no">
            {name}
            {verified}
          </span>
          <span className="leader" aria-hidden="true" />
          <span className="le__go">
            {action}
            <span className="sr-only"> ({COPY.newTab})</span>
            <ArrowUpRight size={13} />
          </span>
        </a>
      )}
      {phone && (
        <button type="button" className="le__copy" aria-label={`${COPY.copyNumber}, ${name}`} onClick={() => onCopy(phone)}>
          <CopyIcon size={17} />
        </button>
      )}
      {(rating !== null || phoneNote || phone) && (
        <div className="le__meta">
          <span className="de__facts">
            {rating !== null && (
              <span className="de__rating">
                <span aria-hidden="true">★</span>
                <span className="sr-only">Rated </span> {rating.toFixed(1)}
              </span>
            )}
            {top && <span className="de__top">{COPY.topRated}</span>}
            {phoneNote &&
              (whatsapp ? (
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="le__note">
                  {phoneNote}
                  <span className="sr-only"> ({COPY.newTab})</span>
                </a>
              ) : (
                <span className="de__note">{phoneNote}</span>
              ))}
          </span>
          {phone && (
            <a href={url} target="_blank" rel="noopener noreferrer" className="le__link">
              {action}
              <span className="sr-only">
                {' '}
                for {name} ({COPY.newTab})
              </span>
              <ArrowUpRight size={12} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
