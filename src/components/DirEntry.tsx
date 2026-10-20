import { COPY } from '../data/ui';
import { cn } from '../lib/cn';
import { localNumber, telHref, whatsappHref } from '../lib/phone';
import type { Listing } from '../types';
import { CopyIcon, VerifiedMark } from './icons';
import { LinkMarks } from './LinkMarks';
import { Rating } from './Rating';

interface DirEntryProps {
  listing: Listing;
  onCopy: (phone: string) => void;
}

/** One directory line:
 *  NAME ··········· 98833 33123 ⧉        (tap the number to call, ⧉ to copy)
 *  ★ (4.8)                          ◎       (top ratings circled in red pen; the link as an icon)
 *  A place with no number shows its link icons where the number would be. */
export function DirEntry({ listing, onCopy }: DirEntryProps) {
  const { name, phone, phoneNote, rating } = listing;
  const whatsapp = phoneNote ? whatsappHref(phoneNote) : null;

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
          <LinkMarks listing={listing} size="book" />
        )}
      </div>
      {(rating !== null || phoneNote || phone) && (
        <div className="de__meta">
          <span className="de__facts">
            {rating !== null && <Rating rating={rating} />}
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
          {phone && <LinkMarks listing={listing} size="book" />}
        </div>
      )}
    </div>
  );
}
