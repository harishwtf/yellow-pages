import type { LinkType } from '../types';

/** Everything that is UI, not listing data, lives here. */

export interface ChapterMeta {
  /** Short label for the index tab. */
  short: string;
}

export const CHAPTER_META: Record<string, ChapterMeta> = {
  'settle-in': { short: 'Settle in' },
  kitchen: { short: 'Kitchen' },
  utilities: { short: 'Utilities' },
  laundry: { short: 'Laundry' },
  plants: { short: 'Plants' },
  corners: { short: 'Corners' },
};

export const FEATURED_LISTING_ID = 'kitchen-kitchen-management-m-kitchen-management';

/** Ratings at or above this get a "Top rated!" sticker. */
export const TOP_RATED_FROM = 4.9;

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
  siteName: 'peela.pages',
  homeLabel: 'peela.pages by M, home',
  title: 'The Indiranagar Move-In Guide',
  byline: 'by M',
  promise: 'Who to call, where to go, what to install.',
  searchPlaceholder: 'Search places or categories…',
  searchLabel: 'Search places and categories',
  saved: 'Saved',
  savedIntro: 'Places you tapped the heart on. They stay on this phone.',
  savedEmpty: 'Nothing saved yet',
  savedEmptyHint: 'Tap the heart on any place to keep it here.',
  noMatches: 'No matches for',
  noMatchesHint: 'Try a category like “gas” or “coffee”.',
  places: 'places',
  featuredBlurb: 'M runs kitchens end to end: setting up, groceries, a cook, meal plans and the washing-up.',
  copied: 'Copied',
  copyLabel: 'Copy number',
  topRated: 'Top rated!',
  openLabel: 'Open',
  saveLabel: 'Save',
  savedLabel: 'Saved',
  copyFailed: 'Couldn’t copy. Select the number instead.',
  savedToast: 'Saved',
  removedToast: 'Removed',
  undo: 'Undo',
  source: { label: 'indiranagar.tellm.co', url: 'https://indiranagar.tellm.co' },
  smallPrint: 'Map links open a Google Maps search for the listed address. App links point to the iOS App Store and Google Play.',
} as const;
