export type LinkType = 'website' | 'maps' | 'appstore' | 'contact';

export interface Listing {
  id: string;
  category: string;
  name: string;
  linkType: LinkType;
  url: string;
  phone: string | null;
  rating: number | null;
  /** Google Play page for listings whose link is an iOS App Store page. */
  androidUrl?: string;
}

export interface Section {
  id: string;
  number: number;
  title: string;
  subtitle?: string;
  listings: Listing[];
}

export interface GuideData {
  sections: Section[];
}
