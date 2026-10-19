import { cn } from '../lib/cn';

export type IconName = 'search' | 'close' | 'copy' | 'phone';

const PATHS: Record<IconName, string> = {
  search: 'M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13z M15.5 15.5 21 21',
  close: 'M6 6l12 12M18 6 6 18',
  copy: 'M9 9h10v11H9z M5 15V4h10',
  phone: 'M5 3h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 12l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z',
};

/** One small line icon. Decorative: label the control that holds it. */
export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn('h-5 w-5 shrink-0', className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
