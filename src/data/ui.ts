import type { LinkType } from '../types';
import type { IconName } from '../components/icons';

/** Everything that is UI, not listing data, lives here. */

export interface ChapterMeta {
  /** Short label for the chapter chip. */
  short: string;
  icon: IconName;
  /** Tailwind classes for the chapter's pastel badge. Literal strings so Tailwind can see them. */
  tone: string;
}

export const CHAPTER_META: Record<string, ChapterMeta> = {
  'settle-in': { short: 'Settle in', icon: 'bed', tone: 'bg-settle-in text-settle-in-ink' },
  kitchen: { short: 'Kitchen', icon: 'pot', tone: 'bg-kitchen text-kitchen-ink' },
  utilities: { short: 'Utilities', icon: 'bolt', tone: 'bg-utilities text-utilities-ink' },
  laundry: { short: 'Laundry', icon: 'shirt', tone: 'bg-laundry text-laundry-ink' },
  plants: { short: 'Plants', icon: 'leaf', tone: 'bg-plants text-plants-ink' },
  corners: { short: 'Corners', icon: 'cup', tone: 'bg-corners text-corners-ink' },
};

export const FEATURED_LISTING_ID = 'kitchen-kitchen-management-m-kitchen-management';

export const OPEN_LABELS: Record<LinkType, string> = {
  website: 'Website',
  maps: 'Map',
  appstore: 'App Store',
  contact: 'Contact M',
};
export const PLAY_STORE_LABEL = 'Play Store';

export const STORAGE_KEYS = {
  favorites: 'movein-guide:favorites',
} as const;

export const COPY = {
  imprint: 'Est.\u00A02026 · Bengaluru\u00A0560038 · Vol.\u00A01',
  title: 'The Indiranagar Move-In Guide',
  byline: 'by M',
  intro: 'Trusted local services for your first month in Indiranagar: who to call, where to go, what to install.',
  searchPlaceholder: 'Search places or categories…',
  searchLabel: 'Search places and categories',
  saved: 'Saved',
  savedIntro: 'Places you tapped the heart on. They stay on this phone.',
  savedEmpty: 'Nothing saved yet',
  savedEmptyHint: 'Tap the heart on any place to keep it here.',
  noMatches: 'No matches for',
  noMatchesHint: 'Try a category like “gas” or “coffee”.',
  places: 'places',
  featuredTag: 'From M',
  featuredBlurb: 'M runs kitchens end to end: setting up, groceries, a cook, meal plans and the washing-up.',
  copied: 'Number copied',
  copyFailed: 'Couldn’t copy. Select the number instead.',
  savedToast: 'Saved',
  removedToast: 'Removed',
  undo: 'Undo',
  source: { label: 'indiranagar.tellm.co', url: 'https://indiranagar.tellm.co' },
  smallPrint: 'Map links open a Google Maps search for the listed address. App links point to the iOS App Store and Google Play.',
} as const;
