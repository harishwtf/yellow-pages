import { OPEN_LABELS, PLAY_STORE_LABEL } from '../data/ui';
import type { Listing } from '../types';
import { AppStoreMark, Icon, PlayMark } from './icons';

interface OpenLinkProps {
  listing: Listing;
  /** `mark`: just the icon, 44px target. `text`: small uppercase text action. */
  variant: 'mark' | 'text';
  store?: 'ios' | 'android';
}

function mark(listing: Listing, android: boolean) {
  if (android) return <PlayMark />;
  if (listing.linkType === 'appstore') return <AppStoreMark />;
  if (listing.linkType === 'maps') return <Icon name="pin" />;
  if (listing.linkType === 'contact') return <Icon name="chat" />;
  return <Icon name="globe" />;
}

/** Opens the listing's website, map search, App Store / Google Play page or contact form in a new tab. */
export function OpenLink({ listing, variant, store = 'ios' }: OpenLinkProps) {
  const android = store === 'android';
  const href = android ? listing.androidUrl : listing.url;
  if (!href) return null;
  const label = android ? PLAY_STORE_LABEL : OPEN_LABELS[listing.linkType];
  const shared = {
    href,
    target: '_blank',
    rel: 'noopener',
    'aria-label': `${label}: ${listing.name} (opens in a new tab)`,
  } as const;

  if (variant === 'mark') {
    return (
      <a {...shared} className="mark-btn" title={label}>
        {mark(listing, android)}
      </a>
    );
  }
  return (
    <a {...shared} className="action">
      {mark(listing, android)}
      {label}
    </a>
  );
}
