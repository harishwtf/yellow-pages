import { OPEN_LABELS, PLAY_STORE_LABEL } from '../data/ui';
import type { Listing } from '../types';
import { AppStoreMark, Icon, PlayMark } from './icons';

interface OpenLinkProps {
  listing: Listing;
  store?: 'ios' | 'android';
}

function mark(listing: Listing, android: boolean) {
  if (android) return <PlayMark />;
  if (listing.linkType === 'appstore') return <AppStoreMark />;
  if (listing.linkType === 'maps') return <Icon name="pin" />;
  if (listing.linkType === 'contact') return <Icon name="chat" />;
  return <Icon name="globe" />;
}

/** Opens the listing's website, map search, App Store / Google Play page or contact form in a new tab: just its icon,
 *  with a 44px target. */
export function OpenLink({ listing, store = 'ios' }: OpenLinkProps) {
  const android = store === 'android';
  const href = android ? listing.androidUrl : listing.url;
  if (!href) return null;
  const label = android ? PLAY_STORE_LABEL : OPEN_LABELS[listing.linkType];
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={`${label}: ${listing.name} (opens in a new tab)`}
      className="mark-btn"
      title={label}
    >
      {mark(listing, android)}
    </a>
  );
}
