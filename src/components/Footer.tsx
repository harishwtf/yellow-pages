import { COPY } from '../data/annotations';
import { CoffeeRing } from './PaperTexture';

export function Footer() {
  return (
    <footer className="relative mx-auto max-w-6xl px-4 pb-28 pt-10 text-sm text-ink-soft lg:pb-12 lg:pr-28">
      <CoffeeRing className="-top-20 right-7 md:right-12 lg:right-36" />
      <div className="rule-double mb-4" />
      <p>
        Source:{' '}
        <a
          href={COPY.source.url}
          target="_blank"
          rel="noopener"
          className="font-bold text-ink underline decoration-2 underline-offset-2"
        >
          {COPY.source.label}
        </a>
      </p>
      <p className="mt-2 max-w-xl text-xs leading-relaxed">{COPY.smallPrint}</p>
      <p className="mt-3 text-xs uppercase tracking-[0.15em]">{COPY.imprint}</p>
    </footer>
  );
}
