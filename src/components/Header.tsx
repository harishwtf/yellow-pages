import { COPY } from '../data/ui';

/** The masthead: just type. The title in the soft serif, then one quiet line with the byline and the promise. */
export function Header() {
  return (
    <header className="cover mx-auto max-w-4xl px-4">
      <h1 className="cover__title font-display font-extrabold" translate="no">
        <span className="block">The Indiranagar</span>
        <span className="block">Move-In Guide</span>
      </h1>
      <p className="cover__line">
        <span className="font-display font-bold text-ink" translate="no">
          {COPY.byline}
        </span>
        <span aria-hidden="true"> — </span>
        {COPY.promise}
      </p>
    </header>
  );
}
