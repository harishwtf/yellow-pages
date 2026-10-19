import { LINK_LABELS } from '../data/ui';
import { cn } from '../lib/cn';
import type { Listing } from '../types';

interface ActionLinkProps {
  listing: Listing;
  /** Set when the link stands where the phone number would be. */
  slot?: boolean;
}

/** Opens the listing's map search, App Store page, website or M's contact form in a new tab. */
export function ActionLink({ listing, slot = false }: ActionLinkProps) {
  const label = LINK_LABELS[listing.linkType];
  return (
    <a
      className={cn('action', slot && 'action--slot')}
      href={listing.url}
      target="_blank"
      rel="noopener"
      aria-label={`${label}: ${listing.name} (opens in a new tab)`}
    >
      {label}
    </a>
  );
}
