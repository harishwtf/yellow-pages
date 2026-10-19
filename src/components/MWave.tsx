import { cn } from '../lib/cn';

/** The M wave mark (two crests of a sine wave), drawn in the current colour. */
export function MWave({ className, title = 'M' }: { className?: string; title?: string }) {
  return (
    <svg className={cn('block overflow-visible', className)} viewBox="0 0 53 16" role="img" aria-label={title} fill="none">
      <path
        d="M0.5 14.5 C 5.2 14.5, 8.3 1.5, 13.3 1.5 C 18.3 1.5, 21.4 14.5, 26.5 14.5 C 31.6 14.5, 34.7 1.5, 39.7 1.5 C 44.7 1.5, 47.8 14.5, 52.5 14.5"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="butt"
      />
    </svg>
  );
}
