import type { LinkType } from '../types';

/** Everything that is UI, not listing data, lives here. */

export interface ChapterMeta {
  /** The chapter's name on its index tab. */
  short: string;
  /** Its heading, and the plain line under it that says what the chapter is for (the team's copy deck). */
  title: string;
  subtitle: string;
  /** Its print colour (cyan, magenta, yellow, key), marking its tab and its number. */
  ink: 'cyan' | 'magenta' | 'yellow' | 'key';
}

export const CHAPTER_META: Record<string, ChapterMeta> = {
  'settle-in': {
    short: 'Settle in',
    title: 'A little shelf help',
    subtitle: 'Unpack, unwind and settle in',
    ink: 'cyan',
  },
  kitchen: { short: 'Kitchen', title: 'May the fork be with you', subtitle: 'Set up your kitchen', ink: 'magenta' },
  utilities: {
    short: 'Utilities',
    title: 'Plug into Convenience',
    subtitle: 'Get your utilities working',
    ink: 'yellow',
  },
  laundry: { short: 'Laundry', title: 'Dhobi or not dhobi?', subtitle: 'Get your laundry sorted', ink: 'key' },
  plants: { short: 'Plants', title: 'Grow new roots', subtitle: 'Make it cozy with plants', ink: 'cyan' },
  neighbourhood: {
    short: 'Neighbourhood',
    title: 'Love thy neighbourhood',
    subtitle: 'Find cafes, gyms and favorite corners',
    ink: 'magenta',
  },
};

export const OPEN_LABELS: Record<LinkType, string> = {
  website: 'Website',
  maps: 'Map',
  appstore: 'App Store',
  contact: 'Contact M',
};
export const PLAY_STORE_LABEL = 'Google Play';

export const COPY = {
  imprint: 'Est.\u00A02026 · Bengaluru\u00A0560038 · Vol.\u00A01',
  title: 'The Indiranagar Move-In Guide',
  byline: 'by M',
  promise: 'A handbook of everything you need to turn your house into a home',
  searchPlaceholder: 'Search for gas, Wi-Fi, a plumber, coffee…',
  searchLabel: 'Search places and categories',
  noMatches: 'Nothing for',
  noMatchesHint: 'Try a category like gas, Wi-Fi or coffee.',
  places: 'places',
  plug: {
    title: 'It’s not easy to set up a new kitchen in a new home.',
    text: 'Good thing there’s M. M runs your kitchen end-to-end. From planning the meals, to providing a certified cook, to ordering groceries, M takes care of all of it.',
    services: ['Planning', 'Ordering', 'Cooking'],
    servicesLabel: 'What M takes care of',
    kicker: 'You just show up and eat :)',
    tellM: '…just tell M',
    cta: 'Get access to M',
  },
  signoff: {
    text: 'Moving into a new neighborhood can be intimidating. Hope this little guide helps you find your feet. It won’t be long before you belong.',
    cta: 'Need a hand?',
  },
  triviaLabel: 'Did you know?',
  triviaNext: 'Another one',
  triviaSource: 'Source:',
  copied: 'Copied',
  copyLabel: 'Copy number',
  copyFailed: 'Couldn’t copy. Select the number instead.',
  source: {
    label: 'indiranagar.tellm.co',
    url: 'https://indiranagar.tellm.co',
  },
  smallPrint:
    'Map links open a Google Maps search for the address. App links open Google Play on Android and the App Store everywhere else.',
} as const;
