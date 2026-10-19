import { useEffect, useRef } from 'react';

/** The search lives in the query string (?q=gas) so a search can be shared. */
export function readUrlQuery(): string {
  if (typeof window === 'undefined') return '';
  try {
    return new URLSearchParams(window.location.search).get('q') ?? '';
  } catch {
    return '';
  }
}

export function useUrlQuerySync(query: string, delay = 250) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const handle = window.setTimeout(() => {
      try {
        const params = new URLSearchParams(window.location.search);
        if (query.trim()) params.set('q', query.trim());
        else params.delete('q');
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
