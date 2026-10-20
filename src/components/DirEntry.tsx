import { ACTION_LABELS, COPY, TOP_RATED_FROM } from '../data/ui';
import { cn } from '../lib/cn';
import { localNumber, telHref, whatsappHref } from '../lib/phone';
import type { Listing } from '../types';
import { ArrowUpRight, CopyIcon, VerifiedMark } from './icons';

interface DirEntryProps {
  listing: Listing;
  onCopy: (phone: string) => void;
}

/** One directory line, as in the v5 directory:
 *  NAME ··········· 98833 33123 ⧉        (tap the number to call, ⧉ to copy)
 *  ★ 4.8  Top rated!                Website ↗ */
export function DirEntry({ listing, onCopy }: DirEntryProps) {
  const { name, phone, phoneNote, rating, url, linkType } = listing;
  const top = rating !== null && rating >= TOP_RATED_FROM;
  const whatsapp = phoneNote ? whatsappHref(phoneNote) : null;
  const link = (
    <a href={url} target="_blank" rel="noopener noreferrer" className="de__link">
      {ACTION_LABELS[linkType]}
      <span className="sr-only">
        {' '}
        for {name} ({COPY.newTab})
      </span>
      <ArrowUpRight size={12} />
    </a>
  );

  return (
    <div className={cn('de', listing.featured && 'de--featured')}>
      <div className="de__line">
        <h3 className="de__name" translate="no">
          {name}
          {listing.verified && (
            <>
              {' '}
              <VerifiedMark label={COPY.verified} />
            </>
          )}
        </h3>
        <span className="leader" aria-hidden="true" />
        {phone ? (
          <span className="de__number">
            <a href={telHref(phone)} className="de__num" aria-label={`${COPY.call} ${name}, ${phone}`}>
              {localNumber(phone)}
            </a>
            <button type="button" className="de__copy" aria-label={`${COPY.copyNumber}, ${name}`} onClick={() => onCopy(phone)}>
              <CopyIcon size={14} />
            </button>
          </span>
        ) : (
          link
        )}
      </div>
      {(rating !== null || phoneNote || phone) && (
        <div className="de__meta">
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
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="de__note">
                  {phoneNote}
                  <span className="sr-only"> ({COPY.newTab})</span>
                </a>
              ) : (
                <span className="de__note">{phoneNote}</span>
              ))}
          </span>
          {phone && link}
        </div>
      )}
    </div>
  );
}
