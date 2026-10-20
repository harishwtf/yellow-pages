import { COPY, TOP_RATED_FROM } from '../data/ui';
import { RedPenRing } from './icons';

/** ★ 4.8 — top ratings circled in red pen, as if someone marked their favourites in the directory. */
export function Rating({ rating }: { rating: number }) {
  const top = rating >= TOP_RATED_FROM;
  return (
    <span className="rating">
      <span aria-hidden="true">★</span>
      <span className="sr-only">Rated </span>
      <span className={top ? 'rating__num rating__num--top' : 'rating__num'}>
        {rating.toFixed(1)}
        {top && <RedPenRing />}
      </span>
      {top && <span className="sr-only">, {COPY.topRated}</span>}
    </span>
  );
}
