import { ACTION_LABELS, COPY, TOP_RATED_FROM } from '../data/ui';
import { cn } from '../lib/cn';
import { telHref, whatsappHref } from '../lib/phone';
import type { Listing } from '../types';
import { Highlight } from './Highlight';
import { ArrowUpRight, CopyIcon, PhoneIcon, RedPenRing, VerifiedMark } from './icons';

interface EntryProps {
  listing: Listing;
  pattern: RegExp | null;
  onCopy: (phone: string) => void;
  className?: string;
}

/** One directory entry.
 *  NAME ·········· number ⧉
 *  TAG  ★ 4.8  Website ↗                    [Call]   ← the Call button is phones only */
export function Entry({ listing, pattern, onCopy, className }: EntryProps) {
  const { name, phone, phoneNote, rating, url, linkType } = listing;
  const action = ACTION_LABELS[linkType];
  const whatsapp = phoneNote ? whatsappHref(phoneNote) : null;

  const actionLink = (linkClass: string) => (
    <a href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {action}
      <span className="sr-only">
        {' '}
        for {name} ({COPY.newTab})
      </span>
      <ArrowUpRight />
    </a>
  );

  return (
    <li className={cn('entry', listing.featured && 'entry--featured', !phone && 'entry--no-phone', className)}>
      <div className="entry__line">
        <h3 className="entry__name" translate="no">
          <Highlight text={name} pattern={pattern} />
          {listing.verified && (
            <>
              {' '}
              <VerifiedMark label={COPY.verified} />
            </>
          )}
        </h3>
        {phone && (
          <>
            <span className="leader" aria-hidden="true" />
            <span className="entry__number">
              <a href={telHref(phone)} className="entry__phone" aria-label={`${COPY.call} ${name}, ${phone}`}>
                {phone}
              </a>
              <button type="button" className="copy-btn" aria-label={`${COPY.copyNumber}, ${name}`} onClick={() => onCopy(phone)}>
                <CopyIcon size={16} />
              </button>
            </span>
          </>
        )}
      </div>

      <div className="entry__meta">
        <span className="tags">
          {listing.categories.map((category) => (
            <span key={category} className="tag">
              <Highlight text={category} pattern={pattern} />
            </span>
          ))}
        </span>
        {rating !== null && (
          <span className="rating">
            <span aria-hidden="true">★</span>
            <span className="sr-only">Rated </span>
            <span className={cn('rating__num', rating >= TOP_RATED_FROM && 'rating__num--top')}>
              {rating.toFixed(1)}
              {rating >= TOP_RATED_FROM && <RedPenRing />}
            </span>
          </span>
        )}
        {phoneNote && (
          <span className="note">
            {whatsapp ? (
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="note__link">
                {phoneNote}
                <span className="sr-only"> ({COPY.newTab})</span>
              </a>
            ) : (
              phoneNote
            )}
          </span>
        )}
        <span className={cn('entry__action', !phone && 'entry__action--desktop')}>
          {actionLink('action-link')}
        </span>
      </div>

      {phone ? (
        <a href={telHref(phone)} className="call-btn" aria-label={`${COPY.call} ${name}`}>
          <PhoneIcon size={16} />
          {COPY.call}
        </a>
      ) : (
        actionLink('call-btn call-btn--quiet')
      )}
    </li>
  );
}
