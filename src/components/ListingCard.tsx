import { COPY } from '../data/ui';
import { copyText } from '../lib/clipboard';
import { localNumber, splitPhone, telHref } from '../lib/phone';
import { IS_ANDROID } from '../lib/platform';
import { reveal } from '../lib/reveal';
import type { Listing } from '../types';
import { BrandMark } from './BrandMark';
import { Highlight } from './Highlight';
import { Icon } from './icons';
import { OpenLink } from './OpenLink';

export interface ListingCardProps {
  listing: Listing;
  query: string;
  onNotify: (text: string) => void;
}

/** One directory entry: the place's mark, then two lines of print: its name, leader and number (or its website / app
 *  links when it has no number), then its rating and any second number. Its category is the bar it sits under. */
export function ListingCard({ listing, query, onNotify }: ListingCardProps) {
  const phone = listing.phone ? splitPhone(listing.phone) : null;
  // A second way to reach them, printed after the rating: "(WhatsApp +91 94481 97197)" → "WhatsApp +91 94481 97197".
  // Its digit groups are joined with no-break spaces so the number never splits across lines.
  const extra = phone?.extra?.replace(/^\((.*)\)$/, '$1').replace(/([+\d]) (?=\d)/g, '$1\u00A0') ?? null;

  const handleCopy = async () => {
    if (!phone) return;
    onNotify((await copyText(phone.primary)) ? `${COPY.copied} ${phone.primary}` : COPY.copyFailed);
  };

  const meta = listing.rating !== null && (
    <span className="tabular-nums">
      <span aria-hidden="true">{'★ '}</span>
      <span className="sr-only">rated </span>
      {listing.rating.toFixed(1)}
    </span>
  );

  return (
    <li ref={reveal} className="row reveal">
      <BrandMark name={listing.name} wave={listing.linkType === 'contact'} />
      <div className="row__body">
        <div className="leader-row">
          <h4 className="name min-w-0 text-pretty" translate="no">
            <Highlight text={listing.name} query={query} />
          </h4>
          <span aria-hidden="true" className="leader" />
          {phone ? (
            <span className="inline-flex items-center">
              <a
                className="num"
                href={telHref(listing.phone as string)}
                aria-label={`Call ${listing.name}: ${phone.primary}`}
                translate="no"
              >
                {localNumber(phone.primary)}
              </a>
              <button
                type="button"
                className="copy-btn"
                aria-label={`Copy the number for ${listing.name}`}
                title={COPY.copyLabel}
                onClick={handleCopy}
              >
                <Icon name="copy" />
              </button>
            </span>
          ) : (
            <span className="marks -mr-2 flex items-center">
              {/* An app shows one store, the one for this device; any other link keeps its own mark. */}
              {listing.linkType === 'appstore' ? (
                <OpenLink
                  listing={listing}

                  store={IS_ANDROID && listing.androidUrl ? 'android' : 'ios'}
                />
              ) : (
                <>
                  <OpenLink listing={listing} />
                  {IS_ANDROID && <OpenLink listing={listing} store="android" />}
                </>
              )}
            </span>
          )}
        </div>
        <p className="meta mt-0.5 text-[0.9rem] leading-snug text-muted break-words">
          {meta}
          {meta && extra && ' · '}
          {extra && <span className="tabular-nums">{extra}</span>}
        </p>
      </div>
    </li>
  );
}
