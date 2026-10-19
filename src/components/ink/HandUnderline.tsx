import { cn } from '../../lib/cn';

/** A quick pen underline. Absolutely positioned under a `relative` parent. */
export function HandUnderline({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-x-0 -bottom-1 h-3 w-full', className)}
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      fill="none"
    >
      <path
        d="M3 7.5C40 3.2 78 8.8 118 5.1S178 7.6 197 4.2"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
