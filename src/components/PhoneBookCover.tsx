import { COPY } from '../data/ui';
import type { Section } from '../types';
import { MWave } from './icons';

/** The front of the book: a directory-yellow phone book. Place, name, what's inside. */
export function PhoneBookCover({ sections, total }: { sections: Section[]; total: number }) {
  return (
    <div className="pb-cover">
      <p className="pb-cover__top" aria-hidden="true">
        <span>
          {COPY.pinPlace} {COPY.pinCode}
        </span>
        <span>{COPY.edition}</span>
      </p>
      <span className="pb-cover__rule" aria-hidden="true" />
      <h1 className="pb-cover__title">
        <span className="pb-cover__place">{COPY.coverPlace}</span>
        <span className="pb-cover__brand">{COPY.coverBrand}</span>
      </h1>
      <p className="pb-cover__sub">
        {COPY.coverSub}{' '}
        <span className="pb-cover__sig" translate="no">
          {COPY.signature}
        </span>
      </p>
      <div className="pb-cover__band">
        <p className="pb-cover__inside">
          {COPY.inside}
          <MWave className="pb-cover__mark" title="M" />
        </p>
        <ol className="pb-cover__list">
          {sections.map((section, i) => (
            <li key={section.id}>
              <span aria-hidden="true">{i + 1}</span> {section.navLabel}
            </li>
          ))}
        </ol>
        <p className="pb-cover__count">
          {total} {COPY.places} · {COPY.promise}
        </p>
      </div>
    </div>
  );
}
