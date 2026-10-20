import { useEffect, useMemo, useRef, useState } from 'react';
import { COPY, EMPTY_SUGGESTIONS, QUICK_SEARCHES } from '../data/ui';
import { localNumber, telHref } from '../lib/phone';
import { matchesQuery, normalize, queryTokens, tokenPattern } from '../lib/search';
import type { Listing, Section } from '../types';
import { Highlight } from './Highlight';
import { ArrowUpRight, CloseIcon, SearchIcon } from './icons';

const byName = new Intl.Collator('en', { sensitivity: 'base', ignorePunctuation: true, numeric: true });

export interface SearchHit {
  listing: Listing;
  section: Section;
}

/** The magnifier, top right on every screen. */
export function SearchButton({ onOpen }: { onOpen: () => void }) {
  return (
    <button type="button" className="search-btn" onClick={onOpen} aria-label={COPY.searchLabel} aria-haspopup="dialog">
      <SearchIcon size={22} />
    </button>
  );
}

interface SearchPanelProps {
  sections: Section[];
  onClose: () => void;
  /** Take the reader to a place: the book turns to its page, the phone scrolls to it. */
  onPick: (hit: SearchHit) => void;
}

/** A sheet of paper that drops down over the guide: type, and every matching place is listed by name and
 *  category. Numbers call straight from here; tapping a place opens it in the guide. */
export function SearchPanel({ sections, onClose, onPick }: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const tokens = useMemo(() => queryTokens(query), [query]);
  const pattern = useMemo(() => tokenPattern(tokens), [tokens]);
  const hits = useMemo(
    () =>
      sections.flatMap((section) =>
        section.listings
          .filter((l) => matchesQuery(l, tokens))
          .sort((a, b) => byName.compare(a.name, b.name))
          .map((listing) => ({ listing, section })),
      ),
    [sections, tokens],
  );

  /** Closing without picking a place hands focus back to the magnifier; picking one moves the reader on. */
  const restoreFocus = useRef(true);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (restoreFocus.current) previous?.focus?.();
    };
  }, [onClose]);

  const current = normalize(query);
  const suggestion = (term: string) => (
    <button type="button" className="search__try" onClick={() => setQuery(term)}>
      ‘{term}’
    </button>
  );

  return (
    <div className="search-layer" data-free-scroll>
      <div className="search-scrim" onClick={onClose} aria-hidden="true" />
      <div className="search-sheet" role="dialog" aria-modal="true" aria-label={COPY.searchLabel}>
        <form className="search-box" role="search" onSubmit={(event) => event.preventDefault()}>
          <SearchIcon size={20} className="search-box__icon" />
          <label htmlFor="guide-search" className="sr-only">
            {COPY.searchLabel}
          </label>
          <input
            ref={inputRef}
            id="guide-search"
            type="search"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder={COPY.searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="button" className="search-box__close" onClick={onClose} aria-label={COPY.closeSearch}>
            <CloseIcon size={20} />
          </button>
        </form>

        <div className="search-chips" role="group" aria-label={COPY.quickSearches}>
          {QUICK_SEARCHES.map((term) => (
            <button
              key={term}
              type="button"
              className="search-chip"
              aria-pressed={current === normalize(term)}
              onClick={() => setQuery(current === normalize(term) ? '' : term)}
            >
              {term}
            </button>
          ))}
        </div>

        {tokens.length > 0 && (
          <div className="search-results" aria-live="polite">
            {hits.length === 0 ? (
              <p className="search__empty">
                {COPY.emptyBefore}
                {suggestion(EMPTY_SUGGESTIONS[0])}
                {COPY.emptyBetween}
                {suggestion(EMPTY_SUGGESTIONS[1])}
                {COPY.emptyAfter}
              </p>
            ) : (
              <>
                <p className="search__count">{COPY.results(hits.length)}</p>
                <ul className="search__list">
                  {hits.map((hit) => (
                    <li key={hit.listing.id} className="hit">
                      <button
                        type="button"
                        className="hit__open"
                        onClick={() => {
                          restoreFocus.current = false;
                          onPick(hit);
                        }}
                      >
                        <span className="hit__name" translate="no">
                          <Highlight text={hit.listing.name} pattern={pattern} />
                        </span>
                        <span className="hit__where">
                          <Highlight text={hit.listing.categories.join(' · ')} pattern={pattern} /> · {hit.section.navLabel}
                        </span>
                        <span className="sr-only">, {COPY.openPage}</span>
                      </button>
                      {hit.listing.phone ? (
                        <a href={telHref(hit.listing.phone)} className="hit__num" aria-label={`${COPY.call} ${hit.listing.name}, ${hit.listing.phone}`}>
                          {localNumber(hit.listing.phone)}
                        </a>
                      ) : (
                        <span className="hit__go" aria-hidden="true">
                          <ArrowUpRight size={14} />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
