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

/** A loose red-pen loop drawn around top ratings. pathLength=1 lets CSS draw it in. */
export const RedPenRing = () => (
  <svg className="pen-ring" viewBox="0 0 48 28" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path
      pathLength={1}
      d="M31 3.4C19.4 1.6 5.9 4.3 3.3 12.4c-2.3 7.3 8.1 13.1 21.5 12.7 13.2-.4 21.5-5.6 20.4-13.1C44.1 5.2 33.6 2 21.9 3.6"
    />
  </svg>
);
