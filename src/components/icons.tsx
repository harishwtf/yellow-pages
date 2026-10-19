import { cn } from '../lib/cn';

export type IconName = 'search' | 'close' | 'heart' | 'copy' | 'globe' | 'pin' | 'chat' | 'chevron';

const PATHS: Record<IconName, string> = {
  search: 'M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13z M15.5 15.5 21 21',
  close: 'M6 6l12 12M18 6 6 18',
  heart: 'M12 20.5s-7.5-4.6-7.5-10A4 4 0 0 1 12 8a4 4 0 0 1 7.5 2.5c0 5.4-7.5 10-7.5 10z',
  copy: 'M9 9h10v11H9z M5 15V4h10',
  globe: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z M3 12h18 M12 3a13.5 13.5 0 0 1 0 18 M12 3a13.5 13.5 0 0 0 0 18',
  pin: 'M12 21.5s-6.5-5.6-6.5-10.5a6.5 6.5 0 0 1 13 0c0 4.9-6.5 10.5-6.5 10.5z M12 13.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8z',
  chat: 'M4 6a2.5 2.5 0 0 1 2.5-2.5h11A2.5 2.5 0 0 1 20 6v8a2.5 2.5 0 0 1-2.5 2.5H9.5L4.5 20.5V6z',
  chevron: 'M8 10l4 4 4-4',
};

interface IconProps {
  name: IconName;
  className?: string;
  filled?: boolean;
}

/** One small line icon. Decorative: label the control that holds it. */
export function Icon({ name, className, filled = false }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn('h-5 w-5 shrink-0', className)}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

/** The App Store mark (from design/apple-app-store-icon.svg), set in the page ink. */
export function AppStoreMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={cn('h-5 w-5 shrink-0', className)} viewBox="0 0 333334 332780" fill="currentColor" fillRule="evenodd">
      <path d="M67387 0h198559c37063 0 67387 30324 67387 67387v198005c0 37063-30324 67387-67387 67387H67387C30324 332779 0 302455 0 265392V67387C0 30324 30324 0 67387 0zm192804 188911c8471 0 15339 6868 15339 15339 0 8472-6868 15339-15339 15339h-13707l12369 21361c4186 7375 1601 16748-5774 20934-7376 4186-16748 1600-20933-5775l-21148-36520h-292l-18180-30679h707l-17948-30995 17460-31129 35974 62123h31472zM137016 91830c-4186-7376-1601-16748 5775-20934 7375-4186 16748-1601 20933 5774l3533 6102 3041-5232c4186-7375 13559-9960 20934-5774s9960 13559 5775 20933l-12043 20650 35 60-9218 15688-34881 59815h36634l17798 30678-71907 1-19809 34780c-4186 7375-13559 9960-20933 5774-7375-4186-9961-13558-5774-20934l11175-19619H73143c-8471 0-15339-6868-15339-15340 0-8471 6868-15339 15339-15339h32415l43922-75559-12464-21524z" />
    </svg>
  );
}

/** The Google Play mark (from design/google-play-store-icon.svg), its four facets set in four tints of the page ink. */
export function PlayMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={cn('h-5 w-5 shrink-0', className)} viewBox="0 0 466 511.98" fill="currentColor">
      <path d="M1.39 41.86c-1.39,4.18 -1.39,9.77 -1.39,15.34l0 397.64c0,5.57 0,9.76 1.4,15.34l216.27 -214.86 -216.28 -213.46z" />
      <path fillOpacity={0.72} d="M199.42 273.45l129.85 -128.35 -241.37 -136.73c-8.37,-5.58 -19.54,-8.37 -30.7,-8.37 -26.5,0 -50.22,18.14 -55.8,41.86l198.02 231.59z" />
      <path fillOpacity={0.5} d="M199.9 237.8l-198.5 232.37c7.22,24.57 30.16,41.81 55.8,41.81 11.16,0 20.93,-2.79 29.3,-8.37l244.16 -139.46 -130.76 -126.35z" />
      <path fillOpacity={0.3} d="M433.91 205.1l-104.65 -60 -111.61 110.22 113.01 108.83 104.64 -58.6c18.14,-9.77 30.7,-29.3 30.7,-50.23 -1.4,-20.93 -13.95,-40.46 -32.09,-50.22z" />
    </svg>
  );
}
