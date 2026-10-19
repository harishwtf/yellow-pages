import { OPEN_LABELS, PLAY_STORE_LABEL } from '../data/ui';
import type { Listing } from '../types';
import { Icon, type IconName } from './icons';

const ICON_FOR: Record<Listing['linkType'], IconName> = { website: 'globe', maps: 'pin', appstore: 'apple', contact: 'chat' };

interface OpenLinkProps {
  listing: Listing;
  /** `icon`: round icon button. `pill`: icon + label, for rows without a number. */
  variant: 'icon' | 'pill';
  store?: 'ios' | 'android';
}

/** Opens the listing's website, map search, App Store / Google Play page or contact form in a new tab. */
export function OpenLink({ listing, variant, store = 'ios' }: OpenLinkProps) {
  const android = store === 'android';
  const href = android ? listing.androidUrl : listing.url;
  if (!href) return null;
  const label = android ? PLAY_STORE_LABEL : OPEN_LABELS[listing.linkType];
  const icon: IconName = android ? 'play' : ICON_FOR[listing.linkType];
  const shared = {
    href,
    target: '_blank',
    rel: 'noopener',
    'aria-label': `${label}: ${listing.name} (opens in a new tab)`,
  } as const;

  if (variant === 'icon') {
    return (
      <a {...shared} className="icon-btn" title={label}>
        <Icon name={icon} />
      </a>
    );
  }
  return (
    <a {...shared} className="pill">
      <Icon name={icon} />
      {label}
    </a>
  );
}
