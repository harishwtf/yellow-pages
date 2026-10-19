import { COPY } from '../data/ui';

export function Header() {
  return (
    <header className="mx-auto max-w-2xl px-4 pb-5 pt-7 md:pt-12">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">{COPY.imprint}</p>
      <h1 className="mt-2 font-display text-[2rem] font-semibold leading-[1.1] tracking-[-0.01em] text-balance md:text-[2.5rem]">
        {COPY.title}
        <span className="font-hand ml-2 inline-block -rotate-3 align-baseline text-[1.5rem] font-semibold text-muted md:text-[1.8rem]">
          {COPY.byline}
        </span>
      </h1>
      <p className="mt-3 max-w-prose text-[1.02rem] leading-relaxed text-muted text-pretty">{COPY.intro}</p>
      <div className="rule-double mt-5" aria-hidden="true" />
    </header>
  );
}
