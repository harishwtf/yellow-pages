import { COPY, LINKS } from '../data/ui';
import { ArrowUpRight, MWave } from './icons';

/** The back cover: M's mark, the closing note, one way to reach M, and the small print. */
export function BackCover() {
  return (
    <footer className="back-cover">
      <div className="page">
        <MWave className="back-cover__mark" title="M" />
        <p className="back-cover__note">{COPY.closing.note}</p>
        <a href={LINKS.m} target="_blank" rel="noopener noreferrer" className="btn btn--ink">
          {COPY.closing.cta}
          <span className="sr-only"> ({COPY.newTab})</span>
          <ArrowUpRight size={16} />
        </a>
        <div className="small-print">
          <p>{COPY.about}</p>
          <p>{COPY.smallPrint}</p>
          <p>
            {COPY.sourceLabel}{' '}
            <a href={LINKS.source} target="_blank" rel="noopener noreferrer">
              {COPY.sourceName}
              <span className="sr-only"> ({COPY.newTab})</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
