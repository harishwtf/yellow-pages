import { COPY } from '../data/ui';

export function Footer() {
  return (
    <footer className="mx-auto max-w-2xl px-4 pb-16 pt-12 text-sm text-muted">
      <p>
        Source:{' '}
        <a
          href={COPY.source.url}
          target="_blank"
          rel="noopener"
          className="font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
          translate="no"
        >
          {COPY.source.label}
        </a>
      </p>
      <p className="mt-2 max-w-prose text-pretty">{COPY.smallPrint}</p>
      <p className="mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em]">{COPY.imprint}</p>
    </footer>
  );
}
