import type { Listing } from '../types';

export function matchesQuery(listing: Listing, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return listing.name.toLowerCase().includes(q) || listing.category.toLowerCase().includes(q);
}
