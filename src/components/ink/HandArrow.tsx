import { cn } from '../../lib/cn';

/** A hand-drawn arrow pointing right (or down with `direction`). */
export function HandArrow({ className, direction = 'right' }: { className?: string; direction?: 'right' | 'down' }) {
  return (
    <svg
      aria-hidden="true"
      className={cn('inline-block', direction === 'down' && 'rotate-90', className)}
      viewBox="0 0 64 24"
      fill="none"
    >
      <path
        d="M3 13.5c17-2.6 35-3.4 55-1.4M47.5 5c3.6 3 7.2 5.4 11 7.2-3.9 2.2-7.6 5-10.6 8.3"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
