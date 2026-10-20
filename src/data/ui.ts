import type { LinkType } from '../types';

/** Every piece of interface copy in one place. Section titles and listings live in listings.json. */
export const COPY = {
  title: 'The Indiranagar Move-In Guide',
  coverLabel: 'Indiranagar',
  pinPlace: 'Bengaluru',
  pinCode: '560038',
  openBook: 'Open the book',
  openHint: 'Scroll to open',
  coverPlace: 'Indiranagar',
  coverBrand: 'peela pages',
  siteName: 'peela.pages',
  search: 'Search',
  searchLabel: 'Search the guide',
  searchPlaceholder: 'What do you need? Try gas, wifi, coffee…',
  closeSearch: 'Close search',
  quickSearches: 'Quick searches',
  emptyBefore: 'Nothing in the directory for that. Try ',
  emptyBetween: ' or ',
  emptyAfter: '.',
  results: (n: number) => (n === 1 ? '1 place' : `${n} places`),
  openPage: 'Open page',
  byline: 'by M',
  homeLabel: 'peela.pages by M, back to the cover',
  coverSub: 'The move-in guide',
  edition: 'Oct 2026',
  inside: 'Inside',
  promise: 'Who to call, where to go, what to install.',
  contents: 'Contents',
  sectionsWord: 'sections',
  notes: 'Notes',
  continued: 'cont.',
  topRated: 'top rated',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  bookmarksLabel: 'Bookmarks',
  bookLabel: 'The guide, open at',
  previous: 'Previous section',
  next: 'Next section',
  nextUp: 'Next:',
  places: 'places',
  placesInside: 'places inside',
  page: 'p.',
  subtitle: 'A handbook of everything you need to turn your house into a home',
  signature: '— by M',
  place: 'Indiranagar · Bengaluru',
  call: 'Call',
  copyNumber: 'Copy number',
  copied: 'Number copied',
  copyFailed: "Couldn't copy. Long-press the number instead.",
  verified: 'Verified',
  newTab: 'opens in a new tab',
  closing: {
    note: "Moving into a new neighborhood can be intimidating. Hope this little guide helps you find your feet. It won't be long before you belong.",
    cta: 'Need a hand?',
  },
  /** The note from the top of the current site, kept as small print. */
  about:
    'A practical list for people moving into Indiranagar, Bengaluru. Curated by M (tellm.co). Most picks have 100+ ratings and a rating above 4.5 (Google Maps for local businesses, App Store or Play Store for apps). Official utilities, helplines, and a few user picks are included even when they do not meet that bar. Ratings checked October 2026; details can change.',
  smallPrint: 'Map links open a Google Maps search for the listed address. App links open the App Store or Google Play.',
  sourceLabel: 'Source:',
  sourceName: 'indiranagar.tellm.co',
} as const;

export const LINKS = {
  /** Where the M wave logo goes, as on the current site. */
  home: 'https://tellm.co/',
  /** "Need a hand?" on the closing page. The current site hides this behind its sign-up form, so it uses
   *  the guide's own Contact M link until we have the real one. */
  m: 'https://app.tellm.co/q/mqYeNfEp',
  source: 'https://indiranagar.tellm.co/',
} as const;

export const ACTION_LABELS: Record<LinkType, string> = {
  app: 'App Store',
  maps: 'Map',
  website: 'Website',
  contact: 'Contact M',
};

/** The Google Play link beside an App Store link. */
export const PLAY_LABEL = 'Google Play';

/** Ratings at or above this get the red-pen circle. */
export const TOP_RATED_FROM = 4.8;


/** Where a long section name may break on its bookmark (a soft hyphen, shown only if it breaks). */
export const BOOKMARK_BREAKS: Record<string, string> = {
  neighbourhood: 'Neighbour­hood',
};

/** Quick searches under the search box: each one runs that search. */
export const QUICK_SEARCHES = ['Gas', 'Wi-Fi', 'Cook', 'Laundry', 'Coffee'] as const;

/** Suggestions offered when a search finds nothing. */
export const EMPTY_SUGGESTIONS = ['gas', 'coffee'] as const;
