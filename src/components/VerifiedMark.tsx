import { COPY } from '../data/ui';

/** The small check mark on official helplines. */
export function VerifiedMark() {
  return (
    <svg className="verified" viewBox="0 0 16 16" role="img" aria-label={COPY.verified}>
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4.6 8.3 7 10.6 11.5 5.6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
