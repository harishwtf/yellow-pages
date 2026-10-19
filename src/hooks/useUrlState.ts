import { useEffect, useRef } from 'react';
import type { Section } from '../types';

/** Search, per-chapter category filters and the My Page drawer, mirrored into the query string
 *  so any view can be linked to: ?q=gas&kitchen=Gas&page=mine */
export interface UrlState {
  query: string;
  filters: Record<string, string | null>;
  myPage: boolean;
}

const QUERY_KEY = 'q';
const MY_PAGE_KEY = 'page';
const MY_PAGE_VALUE = 'mine';

export function readUrlState(sections: Section[]): UrlState {
  const empty: UrlState = { query: '', filters: {}, myPage: false };
  if (typeof window === 'undefined') return empty;
  try {
    const params = new URLSearchParams(window.location.search);
    const filters: Record<string, string | null> = {};
    for (const section of sections) {
      const category = params.get(section.id);
      if (category && section.listings.some((listing) => listing.category === category)) filters[section.id] = category;
    }
    return { query: params.get(QUERY_KEY) ?? '', filters, myPage: params.get(MY_PAGE_KEY) === MY_PAGE_VALUE };
  } catch {
    return empty;
  }
}

function buildUrl(state: UrlState): string {
  const params = new URLSearchParams();
  const query = state.query.trim();
  if (query) params.set(QUERY_KEY, query);
  for (const [sectionId, category] of Object.entries(state.filters)) if (category) params.set(sectionId, category);
  if (state.myPage) params.set(MY_PAGE_KEY, MY_PAGE_VALUE);
  const search = params.toString();
  return `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`;
}

/** Writes the state to the URL with replaceState, debounced so typing does not flood the history API. */
export function useUrlSync(state: UrlState, delay = 200) {
  const { query, filters, myPage } = state;
  const skipFirst = useRef(true);

  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    const handle = window.setTimeout(() => {
      try {
        const next = buildUrl({ query, filters, myPage });
        const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        if (next !== current) window.history.replaceState(window.history.state, '', next);
      } catch {
        // History API unavailable or rate-limited: the on-screen state is still right.
      }
    }, delay);
    return () => window.clearTimeout(handle);
  }, [query, filters, myPage, delay]);
}
