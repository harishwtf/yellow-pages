import type { MouseEvent } from 'react';
import { COPY } from '../data/ui';

/** "peela.pages" over "by M", top left on every screen. Takes the reader back to the cover. */
export function HomeLink({ onHome }: { onHome: () => void }) {
  const handle = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.blur();
    try {
      window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}`);
    } catch {
      // History API unavailable.
    }
    onHome();
  };
  return (
    <a href="/" className="home" aria-label={COPY.homeLabel} onClick={handle} translate="no">
      <span className="home__name">{COPY.siteName}</span>
      <span className="home__by">{COPY.byline}</span>
    </a>
  );
}
