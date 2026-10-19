import { COPY } from '../data/ui';
import { Icon } from './icons';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  /** Announced to assistive tech while searching. */
  resultCount: number;
}

export function SearchBar({ value, onChange, resultCount }: SearchBarProps) {
  return (
    <div className="relative">
      <label htmlFor="directory-search" className="sr-only">
        {COPY.searchLabel}
      </label>
      <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink" />
      <input
        id="directory-search"
        type="search"
        name="q"
        className="search"
        placeholder={COPY.searchPlaceholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="search"
      />
      {value && (
        <button
          type="button"
          className="icon-btn absolute right-1 top-1/2 -translate-y-1/2"
          aria-label={COPY.clearSearch}
          onClick={() => onChange('')}
        >
          <Icon name="close" />
        </button>
      )}
      <p className="sr-only" aria-live="polite">
        {value.trim() ? `${resultCount} ${resultCount === 1 ? 'listing' : 'listings'}` : ''}
      </p>
    </div>
  );
}
