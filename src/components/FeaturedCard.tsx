import { COPY } from '../data/ui';
import { cn } from '../lib/cn';
import type { Listing } from '../types';
import { Highlight } from './Highlight';
import { Icon } from './icons';
import { OpenLink } from './OpenLink';

interface FeaturedCardProps {
  listing: Listing;
  query: string;
  isSaved: boolean;
  onToggleSaved: (listing: Listing) => void;
}

/** M's own entry, set as a boxed display ad: what M does, and two clear actions. */
export function FeaturedCard({ listing, query, isSaved, onToggleSaved }: FeaturedCardProps) {
  return (
    <li className="ad">
      <h4 className="font-display text-[1.45rem] font-extrabold leading-tight tracking-[-0.01em]" translate="no">
        <Highlight text={listing.name} query={query} />
      </h4>
      <p className="mt-1.5 text-[1rem] leading-snug text-pretty">{COPY.featuredBlurb}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1">
        <OpenLink listing={listing} variant="text" />
        <button type="button" className={cn('action', isSaved && 'action--on')} aria-pressed={isSaved} onClick={() => onToggleSaved(listing)}>
          <Icon name="heart" filled={isSaved} />
          {isSaved ? COPY.savedLabel : COPY.saveLabel}
        </button>
      </div>
    </li>
  );
}
