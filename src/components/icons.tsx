import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const line = ({ size = 18, ...props }: IconProps) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
  ...props,
});

export const SearchIcon = (props: IconProps) => (
  <svg {...line(props)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const CloseIcon = (props: IconProps) => (
  <svg {...line(props)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const CopyIcon = (props: IconProps) => (
  <svg {...line({ strokeWidth: 1.8, ...props })}>
    <rect x="8" y="8" width="12" height="12" rx="2" />
    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
  </svg>
);

export const PhoneIcon = (props: IconProps) => (
  <svg {...line({ strokeWidth: 2, ...props })}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  </svg>
);

export const ArrowUpRight = (props: IconProps) => (
  <svg {...line({ size: 14, strokeWidth: 2.2, ...props })}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

/** The small check mark beside official services. */
export const VerifiedMark = ({ label }: { label: string }) => (
  <svg className="verified" width="15" height="15" viewBox="0 0 16 16" role="img" aria-label={label}>
    <title>{label}</title>
    <circle cx="8" cy="8" r="7.25" fill="currentColor" />
    <path d="m4.6 8.2 2.2 2.2 4.6-4.8" fill="none" stroke="var(--color-paper)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** M's wave mark, redrawn from the current site's logo as a single stroke. */
export const MWave = ({ className, title }: { className?: string; title?: string }) => (
  <svg className={className} viewBox="0 0 200 61" role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
    {title && <title>{title}</title>}
    <path
      d="M0 53.4C23.6 53.4 29.2 7.6 52.8 7.6S76.4 53.4 100 53.4s23.6-45.8 47.2-45.8 29.2 45.8 52.8 45.8"
      fill="none"
      stroke="currentColor"
      strokeWidth="15"
    />
  </svg>
);

/** A loose red-pen loop drawn around top ratings, as if circled by hand. */
export const RedPenRing = () => (
  <svg className="pen-ring" viewBox="0 0 48 28" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path d="M31 3.4C19.4 1.6 5.9 4.3 3.3 12.4c-2.3 7.3 8.1 13.1 21.5 12.7 13.2-.4 21.5-5.6 20.4-13.1C44.1 5.2 33.6 2 21.9 3.6" />
  </svg>
);

const LINE: Record<'globe' | 'pin' | 'chat', string> = {
  globe: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z M3 12h18 M12 3a13.5 13.5 0 0 1 0 18 M12 3a13.5 13.5 0 0 0 0 18',
  pin: 'M12 21.5s-6.5-5.6-6.5-10.5a6.5 6.5 0 0 1 13 0c0 4.9-6.5 10.5-6.5 10.5z M12 13.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8z',
  chat: 'M4 6a2.5 2.5 0 0 1 2.5-2.5h11A2.5 2.5 0 0 1 20 6v8a2.5 2.5 0 0 1-2.5 2.5H9.5L4.5 20.5V6z',
};

/** A small line icon for a kind of link (from Version 3). Decorative: the link carries the label. */
export const LinkIcon = ({ name, size = 18 }: { name: keyof typeof LINE; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d={LINE[name]} />
  </svg>
);

/** The App Store mark, set in the page ink. */
export const AppStoreMark = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 333334 332780" fill="currentColor" fillRule="evenodd" aria-hidden="true" focusable="false">
    <path d="M67387 0h198559c37063 0 67387 30324 67387 67387v198005c0 37063-30324 67387-67387 67387H67387C30324 332779 0 302455 0 265392V67387C0 30324 30324 0 67387 0zm192804 188911c8471 0 15339 6868 15339 15339 0 8472-6868 15339-15339 15339h-13707l12369 21361c4186 7375 1601 16748-5774 20934-7376 4186-16748 1600-20933-5775l-21148-36520h-292l-18180-30679h707l-17948-30995 17460-31129 35974 62123h31472zM137016 91830c-4186-7376-1601-16748 5775-20934 7375-4186 16748-1601 20933 5774l3533 6102 3041-5232c4186-7375 13559-9960 20934-5774s9960 13559 5775 20933l-12043 20650 35 60-9218 15688-34881 59815h36634l17798 30678-71907 1-19809 34780c-4186 7375-13559 9960-20933 5774-7375-4186-9961-13558-5774-20934l11175-19619H73143c-8471 0-15339-6868-15339-15340 0-8471 6868-15339 15339-15339h32415l43922-75559-12464-21524z" />
  </svg>
);

/** The Google Play mark, its four facets in four tints of the page ink. */
export const PlayMark = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 466 511.98" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M1.39 41.86c-1.39,4.18 -1.39,9.77 -1.39,15.34l0 397.64c0,5.57 0,9.76 1.4,15.34l216.27 -214.86 -216.28 -213.46z" />
    <path fillOpacity={0.72} d="M199.42 273.45l129.85 -128.35 -241.37 -136.73c-8.37,-5.58 -19.54,-8.37 -30.7,-8.37 -26.5,0 -50.22,18.14 -55.8,41.86l198.02 231.59z" />
    <path fillOpacity={0.5} d="M199.9 237.8l-198.5 232.37c7.22,24.57 30.16,41.81 55.8,41.81 11.16,0 20.93,-2.79 29.3,-8.37l244.16 -139.46 -130.76 -126.35z" />
    <path fillOpacity={0.3} d="M433.91 205.1l-104.65 -60 -111.61 110.22 113.01 108.83 104.64 -58.6c18.14,-9.77 30.7,-29.3 30.7,-50.23 -1.4,-20.93 -13.95,-40.46 -32.09,-50.22z" />
  </svg>
);
