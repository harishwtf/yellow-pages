import { useEffect, useRef } from 'react';

/** Search and the Saved view live in the query string (?q=gas, ?view=saved); chapters are plain #anchors. */
export interface UrlState {
  query: string;
  view: 'all' | 'saved';
}

export function readUrlState(): UrlState {
  if (typeof window === 'undefined') return { query: '', view: 'all' };
  try {
    const params = new URLSearchParams(window.location.search);
    return { query: params.get('q') ?? '', view: params.get('view') === 'saved' ? 'saved' : 'all' };
  } catch {
    return { query: '', view: 'all' };
  }
}

/** Mirrors the state into the URL with replaceState, debounced so typing never floods history. */
export function useUrlSync({ query, view }: UrlState, delay = 200) {
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
        if (view === 'saved') params.set('view', 'saved');
        const search = params.toString();
        const next = `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`;
        const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        if (next !== current) window.history.replaceState(window.history.state, '', next);
      } catch {
        // History API unavailable: the on-screen state is still right.
      }
    }, delay);
    return () => window.clearTimeout(handle);
  }, [query, view, delay]);
}
