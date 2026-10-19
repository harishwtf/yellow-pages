export type LinkType = 'website' | 'maps' | 'appstore' | 'contact';

export interface Listing {
  id: string;
  category: string;
  name: string;
  linkType: LinkType;
  url: string;
  phone: string | null;
  rating: number | null;
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
