import type { Listing } from '../types';

/** Lower case with everything but letters and digits dropped, so "wifi", "Wi Fi" and "wi-fi" all match "Wi-Fi". */
function fold(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

export function matchesQuery(listing: Listing, query: string): boolean {
  const q = fold(query);
  if (!q) return true;
  return fold(listing.name).includes(q) || fold(listing.category).includes(q);
}

/** Finds the query in `text` the same forgiving way, allowing anything but letters and digits between its characters
 *  (so "wifi" marks "Wi-Fi"). */
export function queryPattern(query: string): RegExp | null {
  const q = fold(query);
  return q ? new RegExp(q.split('').join('[^a-z0-9]*'), 'gi') : null;
}
