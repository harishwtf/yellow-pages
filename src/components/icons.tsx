import { cn } from '../lib/cn';

export type IconName =
  | 'search'
  | 'close'
  | 'heart'
  | 'copy'
  | 'phone'
  | 'globe'
  | 'pin'
  | 'apple'
  | 'play'
  | 'chat'
  | 'bed'
  | 'pot'
  | 'bolt'
  | 'shirt'
  | 'leaf'
  | 'cup';

const PATHS: Record<IconName, string> = {
  search: 'M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13z M15.5 15.5 21 21',
  close: 'M6 6l12 12M18 6 6 18',
  heart: 'M12 20.5s-7.5-4.6-7.5-10A4 4 0 0 1 12 8a4 4 0 0 1 7.5 2.5c0 5.4-7.5 10-7.5 10z',
  copy: 'M9 9h10v11H9z M5 15V4h10',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  globe: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z M3 12h18 M12 3a13.5 13.5 0 0 1 0 18 M12 3a13.5 13.5 0 0 0 0 18',
  pin: 'M12 21.5s-6.5-5.6-6.5-10.5a6.5 6.5 0 0 1 13 0c0 4.9-6.5 10.5-6.5 10.5z M12 13.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8z',
  apple:
    'M16.4 12.7c0-2.4 2-3.5 2.1-3.6-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.6.9-.8 0-1.9-.9-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.7 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.4 0 1.9.8 3.1.8 1.3 0 2.1-1.2 2.9-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.6-1-2.6-3.8zM14 5.6c.6-.8 1.1-1.9 1-3-.9 0-2.1.7-2.8 1.5-.6.7-1.1 1.8-1 2.8 1.1.1 2.1-.5 2.8-1.3z',
  play: 'M5.5 3.4v17.2a.8.8 0 0 0 1.2.7l14.4-8.6a.8.8 0 0 0 0-1.4L6.7 2.7a.8.8 0 0 0-1.2.7z M5.9 3.1 15.6 12l-9.7 8.9',
  chat: 'M4 6a2.5 2.5 0 0 1 2.5-2.5h11A2.5 2.5 0 0 1 20 6v8a2.5 2.5 0 0 1-2.5 2.5H9.5L4.5 20.5V6z M8.5 9h7 M8.5 12.5h4.5',
  bed: 'M3 18V8h18v10 M3 12.5h18 M6.5 8V5h5v3 M3 15.5h18',
  pot: 'M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z M2 10h20 M9 6.5c0-2 2-2 2 0 M13 6.5c0-2 2-2 2 0',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7z',
  shirt: 'M7.5 4 3.5 7l2 3 2-1v11h9V9l2 1 2-3-4-3-1.5 2h-4z',
  leaf: 'M20 4c-9 0-14 5-14 12 7 0 12-5 14-12z M6 16c3-3 6-5 10-7 M6 16l-2 4',
  cup: 'M4 8h12v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z M16 10h2a2 2 0 0 1 0 4h-2 M7 4.5c0 1 1 1 1 2 M11 4.5c0 1 1 1 1 2',
};

const FILLED: Partial<Record<IconName, true>> = { apple: true };

interface IconProps {
  name: IconName;
  className?: string;
  /** Fill the shape (used for the saved heart). */
  filled?: boolean;
}

/** One small line icon. Decorative: label the control that holds it. */
export function Icon({ name, className, filled = false }: IconProps) {
  const solid = FILLED[name] || filled;
  return (
    <svg
      aria-hidden="true"
      className={cn('h-5 w-5 shrink-0', className)}
      viewBox="0 0 24 24"
      fill={solid ? 'currentColor' : 'none'}
      stroke={solid && FILLED[name] ? 'none' : 'currentColor'}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
