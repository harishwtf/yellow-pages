import { useId } from 'react';
import { MWave } from './icons';

/** Kraft fibres: a feTurbulence tile, rasterised once and laid over the covers. */
export const KRAFT_GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.15' numOctaves='2' seed='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .33 0 0 0 0 .21 0 0 0 0 .12 0 0 0 2.4 -1.25'/%3E%3C/filter%3E%3Cfilter id='b'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='2' seed='11' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 .94 0 0 0 0 .86 0 0 0 2.2 -1.2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23a)' opacity='.55'/%3E%3Crect width='220' height='220' filter='url(%23b)' opacity='.5'/%3E%3C/svg%3E";

/** Wavy cancellation lines, as on a franked envelope. */
export function Postmark() {
  return (
    <svg className="postmark" viewBox="0 0 120 44" aria-hidden="true" focusable="false">
      {[8, 20, 32].map((y) => (
        <path
          key={y}
          d={`M2 ${y}c10 0 10-7 20-7s10 7 20 7 10-7 20-7 10 7 20 7 10-7 20-7 10 7 16 7`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      ))}
    </svg>
  );
}

/** A square rubber stamp with M's mark. */
export function MStamp() {
  return (
    <span className="m-stamp" aria-hidden="true">
      <MWave className="m-stamp__wave" />
      <span className="m-stamp__text">tellm.co</span>
    </span>
  );
}

/** A round ink stamp: the place around the rim, the count in the middle. */
export function CountStamp({ count, label }: { count: number; label: string }) {
  const uid = useId().replace(/:/g, '');
  return (
    <svg className="count-stamp" viewBox="0 0 200 200" role="img" aria-label={`${count} ${label}`}>
      <defs>
        <path id={`${uid}-rim`} d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1-148 0" />
      </defs>
      <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="2 5" />
      <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text className="count-stamp__rim">
        <textPath href={`#${uid}-rim`} startOffset="0">
          INDIRANAGAR · BENGALURU · INDIRANAGAR · BENGALURU ·
        </textPath>
      </text>
      <text x="100" y="104" textAnchor="middle" className="count-stamp__count">
        {count}
      </text>
      <text x="100" y="128" textAnchor="middle" className="count-stamp__label">
        {label.toUpperCase()}
      </text>
    </svg>
  );
}
