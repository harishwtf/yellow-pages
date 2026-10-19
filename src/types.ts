export type LinkType = 'app' | 'maps' | 'website' | 'contact';

export interface Listing {
  id: string;
  /** One or more categories; Urban Company covers six. */
  categories: string[];
  name: string;
  /** Official helplines (BESCOM, BBMP) show a small check mark. */
  verified?: boolean;
  linkType: LinkType;
  url: string;
  phone: string | null;
  /** A second number or channel, e.g. "WhatsApp +91 94481 97197". */
  phoneNote?: string;
  rating: number | null;
  /** M's own entry, set in a boxed entry. */
  featured?: boolean;
}

export interface Section {
  id: string;
  navLabel: string;
  title: string;
  subtitle: string;
  /** The sheet's one-line note for the section. */
  note?: string;
  listings: Listing[];
}

export interface Directory {
  sections: Section[];
}
