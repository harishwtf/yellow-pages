import type { Listing } from '../types';

const byName = new Intl.Collator('en', {
  sensitivity: 'base',
  ignorePunctuation: true,
  numeric: true,
});

/** Listings under their category, in the order the categories first appear in the guide; A–Z within each, as a
 *  phone book lists them. */
export function groupByCategory(listings: Listing[]): Array<{ category: string; listings: Listing[] }> {
  const groups = new Map<string, Listing[]>();
  for (const listing of listings) {
    if (!groups.has(listing.category)) groups.set(listing.category, []);
    groups.get(listing.category)!.push(listing);
  }
  return Array.from(groups, ([category, items]) => ({
    category,
    listings: items.sort((a, b) => byName.compare(a.name, b.name)),
  }));
}
