import { COPY, LINKS } from '../data/ui';
import { ArrowUpRight, MWave } from './icons';

/** The closing note, M's offer of help and the small print: the book's last page, or the phone's back cover. */
export function Closing() {
  return (
    <div className="closing">
      <MWave className="closing__mark" title="M" />
      <p className="closing__note">{COPY.closing.note}</p>
      <a href={LINKS.m} target="_blank" rel="noopener noreferrer" className="btn btn--ink">
        {COPY.closing.cta}
        <span className="sr-only"> ({COPY.newTab})</span>
        <ArrowUpRight size={16} />
      </a>
      <div className="closing__print">
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
  );
}
