import { COPY } from '../data/ui';
import { QuickChips } from './QuickChips';
import { SearchBar } from './SearchBar';

interface CoverProps {
  query: string;
  onQueryChange: (query: string) => void;
  resultCount: number;
}

/** The directory cover: yellow card, the illustration, the title, the signature, and the search. */
export function Cover({ query, onQueryChange, resultCount }: CoverProps) {
  return (
    <header className="cover">
      <div className="mx-auto grid min-h-[70svh] max-w-[62rem] content-center gap-5 px-4 pb-8 pt-7 md:min-h-0 md:grid-cols-[1fr_auto] md:items-center md:gap-12 md:pb-11 md:pt-10">
        <div className="md:order-1">
          <h1 className="display cover__title" translate="no">
            {COPY.title[0]}
            <br />
            {COPY.title[1]}
          </h1>
          <p className="cover__subtitle">{COPY.subtitle}</p>
          <p className="hand cover__byline" translate="no">
            {COPY.byline}
          </p>
          <div className="mt-6 max-w-xl">
            <SearchBar value={query} onChange={onQueryChange} resultCount={resultCount} />
            <QuickChips query={query} onPick={onQueryChange} />
          </div>
        </div>
        <img
          className="order-first h-28 w-auto md:order-2 md:h-64 lg:h-72"
          src="/hero.png"
          alt=""
          width={720}
          height={600}
          decoding="async"
          fetchPriority="high"
        />
      </div>
    </header>
  );
}
