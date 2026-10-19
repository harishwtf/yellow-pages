import { CIRCLE_FROM, COPY } from '../data/ui';

/** "★ 4.6"; at 4.8 and above a thin red pen circle is drawn around it. */
export function Rating({ value }: { value: number }) {
  const circled = value >= CIRCLE_FROM;
  return (
    <span className="rating">
      <span aria-hidden="true">★ </span>
      <span className="sr-only">Rated </span>
      {value.toFixed(1)}
      {circled && (
        <>
          <svg className="rating__circle" viewBox="0 0 100 44" preserveAspectRatio="none" aria-hidden="true">
            <path pathLength={1} d="M24 8 C 48 -1, 97 3, 96 22 C 95 40, 52 47, 22 41 C 2 37, 0 15, 23 9 C 32 6, 42 4, 52 5" />
          </svg>
          <span className="sr-only"> ({COPY.topRated})</span>
        </>
      )}
    </span>
  );
}
