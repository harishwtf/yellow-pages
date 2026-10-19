import { COPY, LINKS } from '../data/ui';
import { ArrowUpRight, MWave } from './icons';

/** M's promo, set as a boxed classified ad. */
export function ClassifiedAd() {
  return (
    <aside className="ad" aria-labelledby="ad-lead">
      <p className="ad__label">{COPY.ad.label}</p>
      <MWave className="ad__mark" title="M" />
      <p id="ad-lead" className="ad__lead">
        {COPY.ad.lead}
      </p>
      <p className="ad__body">{COPY.ad.body}</p>
      <p className="ad__close">{COPY.ad.close}</p>
      <a href={LINKS.m} target="_blank" rel="noopener noreferrer" className="btn btn--cover">
        {COPY.ad.cta}
        <span className="sr-only"> ({COPY.newTab})</span>
        <ArrowUpRight size={16} />
      </a>
    </aside>
  );
}
