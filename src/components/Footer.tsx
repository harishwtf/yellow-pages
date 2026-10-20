import { COPY } from '../data/ui';
import { Icon } from './icons';
import { Trivia } from './Trivia';

interface FooterProps {
  /** M's contact form, for the sign-off's "Need a hand?". */
  contactUrl?: string;
}

export function Footer({ contactUrl }: FooterProps) {
  return (
    <footer className="mx-auto max-w-[68rem] px-4 pb-16 pt-12 text-[0.9rem] text-muted">
      <div className="signoff">
        <p className="signoff__text">{COPY.signoff.text}</p>
        {contactUrl && (
          <a
            className="action"
            href={contactUrl}
            target="_blank"
            rel="noopener"
            aria-label={`${COPY.signoff.cta} Contact M (opens in a new tab)`}
          >
            <Icon name="chat" />
            {COPY.signoff.cta}
          </a>
        )}
      </div>
      <Trivia />
      <div className="rule-double mb-4" aria-hidden="true" />
      <p>
        Source:{' '}
        <a
          href={COPY.source.url}
          target="_blank"
          rel="noopener"
          className="font-bold text-ink underline decoration-2 underline-offset-2 hover:decoration-accent"
          translate="no"
          aria-label={`${COPY.source.label} (opens in a new tab)`}
        >
          {COPY.source.label}
        </a>
      </p>
      <p className="mt-2 max-w-prose text-pretty">{COPY.smallPrint}</p>
      <p className="mt-4 text-[0.72rem] font-bold uppercase tracking-[0.18em]">{COPY.imprint}</p>
    </footer>
  );
}
