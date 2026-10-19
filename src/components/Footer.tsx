import { COPY } from '../data/ui';

export function Footer() {
  return (
    <footer className="mx-auto max-w-4xl px-4 pb-16 pt-12 text-[0.9rem] text-muted">
      <p>
        Source:{' '}
        <a
          href={COPY.source.url}
          target="_blank"
          rel="noopener"
          className="font-bold text-ink underline decoration-2 underline-offset-2 hover:decoration-accent"
          translate="no"
        >
          {COPY.source.label}
        </a>
      </p>
      <p className="mt-2 max-w-prose text-pretty">{COPY.smallPrint}</p>
    </footer>
  );
}
