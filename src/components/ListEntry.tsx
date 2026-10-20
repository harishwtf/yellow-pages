import { COPY } from '../data/ui';
import { cn } from '../lib/cn';
import { localNumber, telHref, whatsappHref } from '../lib/phone';
import type { Listing } from '../types';
import { CopyIcon, VerifiedMark } from './icons';
import { LinkMarks } from './LinkMarks';
import { Rating } from './Rating';

interface ListEntryProps {
  listing: Listing;
  onCopy: (phone: string) => void;
  /** Set when search has just brought the reader here: the row gets a highlighter swipe. */
  flashKey?: number;
}

/** One directory line on a phone. The first line is the main action, at least 44px tall:
 *  NAME ··········· 98833 33123   [⧉]      tap the line to call; ⧉ copies
 *  ★ (4.8)                          [◎]     top ratings circled in red pen; the link as an icon
 *  A place with no number shows its link icons on the first line instead. */
export function ListEntry({ listing, onCopy, flashKey }: ListEntryProps) {
  const { name, phone, phoneNote, rating } = listing;
  const whatsapp = phoneNote ? whatsappHref(phoneNote) : null;
  const title = (
    <span className="le__name" translate="no">
      {name}
      {listing.verified && (
        <>
          {' '}
          <VerifiedMark label={COPY.verified} />
        </>
      )}
    </span>
  );

  return (
    <div id={`place-${listing.id}`} className={cn('le', listing.featured && 'le--featured', !phone && 'le--no-phone')}>
      {flashKey !== undefined && <span key={flashKey} className="place-flash" aria-hidden="true" />}
      {phone ? (
        <a href={telHref(phone)} className="le__main" aria-label={`${COPY.call} ${name}, ${phone}`}>
          {title}
          <span className="leader" aria-hidden="true" />
          <span className="le__num">{localNumber(phone)}</span>
        </a>
      ) : (
        <div className="le__main le__main--links">
          {title}
          <span className="leader" aria-hidden="true" />
          <LinkMarks listing={listing} size="phone" />
        </div>
      )}
      {phone && (
        <button type="button" className="le__copy" aria-label={`${COPY.copyNumber}, ${name}`} onClick={() => onCopy(phone)}>
          <CopyIcon size={17} />
        </button>
      )}
      {(rating !== null || phoneNote || phone) && (
        <div className="le__meta">
          <span className="de__facts">
            {rating !== null && <Rating rating={rating} />}
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
          {phone && <LinkMarks listing={listing} size="phone" />}
        </div>
      )}
    </div>
  );
}
