import type { LinkType } from '../types';

/** Every piece of interface copy in one place. Section titles and listings live in listings.json. */
export const COPY = {
  title: 'The Indiranagar Move-In Guide',
  coverLabel: 'Indiranagar',
  pinPlace: 'Bengaluru',
  pinCode: '560038',
  openBook: 'Open the book',
  openHint: 'Scroll or tap to open',
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
  ad: {
    label: 'Advertisement',
    lead: "It's not easy to set up a new kitchen in a new home.",
    body: "Good thing there's M. M runs your kitchen end-to-end. From planning the meals, to providing a certified cook, to ordering groceries, M takes care of all of it.",
    close: 'You just show up and eat :)',
    cta: 'Get Access to M',
  },
  closing: {
    note: "Moving into a new neighborhood can be intimidating. Hope this little guide helps you find your feet. It won't be long before you belong.",
    cta: 'Need a hand?',
  },
  /** The note from the top of the current site, kept as small print. */
  about:
    'A practical list for people moving into Indiranagar, Bengaluru. Curated by M (tellm.co). Most picks have 100+ ratings and a rating above 4.5 (Google Maps for local businesses, App Store or Play Store for apps). Official utilities, helplines, and a few user picks are included even when they do not meet that bar. Ratings checked October 2026; details can change.',
  smallPrint: 'Map links open a Google Maps search for the listed address. App links point to the iOS App Store.',
  sourceLabel: 'Source:',
  sourceName: 'indiranagar.tellm.co',
} as const;

export const LINKS = {
  /** Where the M wave logo goes, as on the current site. */
  home: 'https://tellm.co/',
  /** "Get Access to M" and "Need a hand?". The current site hides these behind its sign-up form, so they use
   *  the guide's own Contact M link until we have the real one. */
  m: 'https://app.tellm.co/q/mqYeNfEp',
  source: 'https://indiranagar.tellm.co/',
} as const;

export const ACTION_LABELS: Record<LinkType, string> = {
  app: 'App',
  maps: 'Map',
  website: 'Website',
  contact: 'Contact M',
};

/** Ratings at or above this get the red-pen circle. */
export const TOP_RATED_FROM = 4.8;

/** The M classified ad runs at the end of this section's pages. */
export const AD_AFTER_SECTION = 'kitchen';
