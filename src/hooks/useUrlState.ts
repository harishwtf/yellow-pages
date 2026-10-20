import { useEffect, useRef } from 'react';

/** Search lives in the query string (?q=gas); chapters are plain #anchors. */
export interface UrlState {
  query: string;
}

export function readUrlState(): UrlState {
  if (typeof window === 'undefined') return { query: '' };
  try {
    const params = new URLSearchParams(window.location.search);
    return { query: params.get('q') ?? '' };
  } catch {
    return { query: '' };
  }
}

/** Mirrors the state into the URL with replaceState, debounced so typing never floods history. */
export function useUrlSync({ query }: UrlState, delay = 200) {
  const skipFirst = useRef(true);
  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    const handle = window.setTimeout(() => {
      try {
        const params = new URLSearchParams();
        if (query.trim()) params.set('q', query.trim());
        const search = params.toString();
        const next = `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`;
        const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        if (next !== current) window.history.replaceState(window.history.state, '', next);
      } catch {
        // History API unavailable: the on-screen state is still right.
      }
    }, delay);
    return () => window.clearTimeout(handle);
  }, [query, delay]);
}
