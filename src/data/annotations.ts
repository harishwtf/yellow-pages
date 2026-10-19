import type { LinkType } from '../types';

/** Everything handwritten or UI-only lives here, apart from the listing data itself. */

export interface MarginNote {
  text: string;
  /** The note is scribbled above the first listing of this category. */
  beforeCategory: string;
}

export interface SectionMeta {
  /** Short label for the thumb index. */
  short: string;
  note: MarginNote;
}

export const SECTION_META: Record<string, SectionMeta> = {
  'settle-in': { short: 'Settle in', note: { text: 'bed first, boxes later', beforeCategory: 'Furniture' } },
  kitchen: { short: 'Kitchen', note: { text: 'do this first week!', beforeCategory: 'Gas' } },
  utilities: { short: 'Utilities', note: { text: 'stick these on the fridge', beforeCategory: 'Wi-Fi' } },
  laundry: { short: 'Laundry', note: { text: 'don’t let the pile win', beforeCategory: 'Laundry' } },
  plants: { short: 'Plants', note: { text: 'start with one you can’t kill', beforeCategory: 'Plants' } },
  corners: { short: 'Corners', note: { text: 'best filter coffee', beforeCategory: 'Coffee' } },
};

export const FEATURED_LISTING_ID = 'kitchen-find-a-cook-m-trained-home-cook';
export const FEATURED_NOTE = 'Need a cook? Ask M';

/** Ratings at or above this get a red-pen circle. */
export const CIRCLE_RATING_FROM = 4.8;

export const OPEN_LABELS: Record<LinkType, string> = {
  website: 'Website',
  maps: 'Map',
  appstore: 'App',
  contact: 'Contact M',
};

export const STORAGE_KEYS = {
  favorites: 'movein-guide:favorites',
  checklist: 'movein-guide:checklist',
} as const;

export const COPY = {
  masthead: 'The Indiranagar Move-In Guide',
  byline: 'by M',
  imprint: 'Est.\u00A02026 · Bengaluru\u00A0560038 · Vol.\u00A01',
  tagline: 'Trusted local services for your first month, with notes from a friend who lives nearby.',
  searchPlaceholder: 'Search… e.g. “gas” or “coffee”',
  emptySearch: 'nothing here… try “coffee” or “gas”',
  emptyFavorites: 'nothing here yet — star a few places and they land on this page',
  undo: 'Undo',
  copyNumber: 'Copy number',
  copied: 'copied ✓',
  copyFailed: 'couldn’t copy — select the number instead',
  favoriteAdded: 'added to My Page ✓',
  favoriteRemoved: 'taken off My Page',
  sectionDone: 'done ✓',
  source: { label: 'indiranagar.tellm.co', url: 'https://indiranagar.tellm.co' },
  smallPrint: 'Map links open a Google Maps search for the listed address. App links point to the iOS App Store.',
} as const;
