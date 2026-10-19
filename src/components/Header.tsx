import type { MouseEvent } from 'react';
import { COPY } from '../data/ui';

interface HeaderProps {
  /** Back to the start: clear search, leave Saved, scroll to the top. */
  onHome: () => void;
}

/** The masthead: just type. The "peela.pages by M" home link top left, then the title and one quiet line. */
export function Header({ onHome }: HeaderProps) {
  const handleHome = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    onHome();
  };

  return (
    <header className="cover mx-auto max-w-4xl px-4">
      <a href="/" className="home-link" aria-label={COPY.homeLabel} onClick={handleHome} translate="no">
        <span className="font-display font-extrabold">{COPY.siteName}</span>
        <span className="home-link__by">{COPY.byline}</span>
      </a>
      <h1 className="cover__title font-display font-extrabold" translate="no">
        <span className="block">The Indiranagar</span>
        <span className="block">Move-In Guide</span>
      </h1>
      <p className="cover__line">{COPY.promise}</p>
    </header>
  );
}
