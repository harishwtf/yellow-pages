import type { Listing } from '../types';

/** Lowercase letters and digits only, so "wifi" finds "Wi-Fi" and "fresh meat" finds "Fresh meat". */
export const normalize = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '');

/** The words of a query, normalized, empty ones dropped. */
export const queryTokens = (query: string): string[] => query.split(/\s+/).map(normalize).filter(Boolean);

/** A listing matches when every word appears in its name or one of its categories. */
export function matchesQuery(listing: Listing, tokens: string[]): boolean {
  if (tokens.length === 0) return false;
  const fields = [listing.name, ...listing.categories].map(normalize);
  return tokens.every((token) => fields.some((field) => field.includes(token)));
}

/** A regex that finds the tokens in display text, allowing punctuation and spaces between letters. */
export function tokenPattern(tokens: string[]): RegExp | null {
  if (tokens.length === 0) return null;
  const parts = [...tokens].sort((a, b) => b.length - a.length).map((token) => token.split('').join('[^a-z0-9]*'));
  return new RegExp(`(${parts.join('|')})`, 'gi');
}
