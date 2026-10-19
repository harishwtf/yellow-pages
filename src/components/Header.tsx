import { COPY } from '../data/annotations';
import { HandUnderline } from './ink/HandUnderline';
import { TornEdge } from './TornEdge';

interface HeaderProps {
  listingCount: number;
  sectionCount: number;
}

/** Phone-book cover masthead with a torn bottom edge. */
export function Header({ listingCount, sectionCount }: HeaderProps) {
  return (
    <header className="cover relative bg-paper-deep pb-12 md:pb-16">
      <div className="mx-auto max-w-6xl px-4 lg:pr-28">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-xs uppercase tracking-[0.18em] text-ink-soft md:text-sm">
          <p>{COPY.imprint}</p>
          <p>
            {listingCount} listings · {sectionCount} chapters
          </p>
        </div>
        <div className="rule-double my-3" />
        <h1 className="font-display text-[clamp(2.7rem,11vw,7.5rem)] font-bold uppercase leading-[0.9] tracking-tight" translate="no">
          <span className="block">The Indiranagar</span>
          <span className="block">Move-In Guide</span>
        </h1>
        <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-3">
          <p className="hand relative inline-block -rotate-2 pr-2 text-[clamp(2rem,6vw,3.25rem)] leading-none text-pen-blue" translate="no">
            — {COPY.byline}
            <HandUnderline />
          </p>
          <p className="max-w-md text-pretty text-base leading-snug text-ink-soft md:text-lg">{COPY.tagline}</p>
        </div>
      </div>
      <TornEdge edge="bottom" fill="var(--color-paper)" />
    </header>
  );
}
