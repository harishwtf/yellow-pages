import type { Listing } from '../types';

export interface Range {
  start: number;
  end: number;
}

/** Lower-case letters and digits only, so "wifi" finds "Wi-Fi" and "fruit land" finds "Fruitland". */
export const fold = (text: string): string => text.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Every place `query` occurs in `text`, as ranges into the original string. */
export function findRanges(text: string, query: string): Range[] {
  const needle = fold(query);
  if (!needle) return [];
  const chars: string[] = [];
  const at: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const c = text[i].toLowerCase();
    if (/[a-z0-9]/.test(c)) {
      chars.push(c);
      at.push(i);
    }
  }
  const folded = chars.join('');
  const ranges: Range[] = [];
  let from = 0;
  for (;;) {
    const k = folded.indexOf(needle, from);
    if (k === -1) break;
    ranges.push({ start: at[k], end: at[k + needle.length - 1] + 1 });
    from = k + needle.length;
  }
  return ranges;
}

export function matchesListing(listing: Listing, query: string): boolean {
  if (!fold(query)) return true;
  return findRanges(listing.name, query).length > 0 || listing.categories.some((c) => findRanges(c, query).length > 0);
}
