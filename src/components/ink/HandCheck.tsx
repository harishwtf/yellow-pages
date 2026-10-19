import { cn } from '../../lib/cn';

/** A hand-drawn tick. Decorative; label the parent. */
export function HandCheck({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={cn('inline-block', className)} viewBox="0 0 24 24" fill="none">
      <path
        d="M4.5 12.8c1.6 1.3 3.4 3.5 4.6 5.6 2.2-5.1 6-10.3 10.6-13.9"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
