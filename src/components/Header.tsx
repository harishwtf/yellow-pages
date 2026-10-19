import { COPY } from '../data/ui';

/** Phone-book cover masthead: imprint, double rules, the title set in type, "by M", the one-line promise,
 *  and a single small ink spot drawing. About a third of the first screen. */
export function Header() {
  return (
    <header className="cover mx-auto max-w-4xl px-4">
      <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-muted md:text-[0.75rem]">{COPY.imprint}</p>
      <div className="rule-double mt-2" aria-hidden="true" />
      <div className="cover__body">
        <h1 className="cover__title font-display font-bold uppercase" translate="no">
          <span className="block">The Indiranagar</span>
          <span className="block">
            Move-In Guide
            <span className="font-hand ml-3 inline-block -rotate-3 align-baseline text-[0.5em] font-semibold normal-case tracking-normal text-muted">
              {COPY.byline}
            </span>
          </span>
        </h1>
        <p className="cover__promise">{COPY.promise}</p>
        <img
          src="/img/spot-auto-240.png"
          srcSet="/img/spot-auto-240.png 240w, /img/spot-auto-480.png 480w"
          sizes="(min-width: 48rem) 13rem, 6.5rem"
          width={480}
          height={426}
          alt=""
          className="cover__spot"
        />
      </div>
      <div className="rule-double" aria-hidden="true" />
    </header>
  );
}
