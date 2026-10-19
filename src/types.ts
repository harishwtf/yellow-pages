/** How a listing's link opens: an App Store page, a Google Maps search, a website, or M's contact form. */
export type LinkType = 'app' | 'maps' | 'website' | 'contact';

export interface Listing {
  id: string;
  /** Usually one; Urban Company covers several trades. */
  categories: string[];
  name: string;
  /** Official services (BESCOM, BBMP) get a small check mark. */
  verified?: boolean;
  linkType: LinkType;
  url: string;
  phone: string | null;
  /** Extra contact detail kept as written, e.g. "WhatsApp +91 94481 97197". */
  phoneNote?: string;
  rating: number | null;
  /** Set as a boxed entry with the red-pen accent. */
  featured?: boolean;
}

export interface Section {
  id: string;
  navLabel: string;
  title: string;
  subtitle: string;
  listings: Listing[];
}

export interface GuideData {
  sections: Section[];
}
