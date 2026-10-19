import type { LinkType } from '../types';

/** Everything that is copy or UI configuration, not listing data. */

const CONTACT_M = 'https://tellm.co/';

export const COPY = {
  place: 'Indiranagar',
  title: ['The Indiranagar', 'Move-In Guide'],
  subtitle: 'A handbook of everything you need to turn your house into a home',
  byline: '— by M',
  searchLabel: 'Search the directory by name or category',
  searchPlaceholder: 'What do you need? Try gas, wifi, coffee…',
  clearSearch: 'Clear search',
  chips: ['Gas', 'Wi-Fi', 'Cook', 'Laundry', 'Coffee'],
  sectionsNav: 'Sections',
  skipLink: 'Skip to the listings',
  empty: 'Nothing in the directory for that. Try ‘gas’ or ‘coffee’.',
  copied: 'Number copied',
  copyFailed: 'Couldn’t copy. Select the number instead.',
  verified: 'Official',
  topRated: 'Top rated',
  ad: {
    label: 'Advertisement',
    body: 'It’s not easy to set up a new kitchen in a new home. Good thing there’s M. M runs your kitchen end-to-end. From planning the meals, to providing a certified cook, to ordering groceries, M takes care of all of it. You just show up and eat :)',
    cta: 'Get Access to M',
    url: CONTACT_M,
  },
  closing: {
    body: 'Moving into a new neighborhood can be intimidating. Hope this little guide helps you find your feet. It won’t be long before you belong.',
    cta: 'Need a hand?',
    url: CONTACT_M,
  },
  smallPrint: 'Map links open a Google Maps search for the listed address. App links point to the iOS App Store.',
  source: { label: 'indiranagar.tellm.co', url: 'https://indiranagar.tellm.co' },
} as const;

export const LINK_LABELS: Record<LinkType, string> = {
  app: 'App',
  maps: 'Map',
  website: 'Website',
  contact: 'Contact M',
};

/** Ratings at or above this get the red-pen circle. */
export const CIRCLE_FROM = 4.8;

/** The M classified ad runs after this section. */
export const AD_AFTER_SECTION = 'kitchen';
