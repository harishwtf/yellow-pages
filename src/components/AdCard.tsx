import { COPY } from '../data/ui';
import { MWave } from './MWave';

/** M's promo, set as a boxed classified ad. */
export function AdCard() {
  return (
    <aside className="ad" aria-label={COPY.ad.label}>
      <p className="ad__label">{COPY.ad.label}</p>
      <MWave className="mx-auto mt-4 h-5 w-auto" />
      <p className="ad__body">{COPY.ad.body}</p>
      <a className="btn btn--cover mt-5" href={COPY.ad.url} target="_blank" rel="noopener">
        {COPY.ad.cta}
        <span aria-hidden="true">↗</span>
      </a>
    </aside>
  );
}
