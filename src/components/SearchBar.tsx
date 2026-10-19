import { COPY } from '../data/annotations';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  total: number;
}

export function SearchBar({ value, onChange, resultCount, total }: SearchBarProps) {
  const searching = value.trim().length > 0;
  return (
    <div>
      <label htmlFor="guide-search" className="sr-only">
        Search listings by name or category
      </label>
      <div className="relative">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
        >
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.5 15.5 21 21" />
        </svg>
        <input
          id="guide-search"
          type="search"
          name="q"
          className="search-input"
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
            className="icon-btn absolute right-0.5 top-1/2 -translate-y-1/2"
            aria-label="Clear search"
            onClick={() => onChange('')}
          >
            <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        )}
      </div>
      <p className="mt-1.5 text-xs uppercase tracking-[0.12em] text-ink-soft" aria-live="polite">
        {searching ? `${resultCount} of ${total} listings match` : `${total} listings`}
      </p>
    </div>
  );
}
