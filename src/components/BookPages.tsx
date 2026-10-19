import type { ReactNode } from 'react';
import { AD_AFTER_SECTION, COPY } from '../data/ui';
import type { Section } from '../types';
import { ClassifiedAd } from './ClassifiedAd';
import { Entry } from './Entry';

/** On a two-page spread the left page holds the section's title and the first few places, the right page
 *  the rest. The title takes about three entries' worth of room. */
const leftCount = (n: number) => Math.max(0, Math.floor((n - 3) / 2));

interface PageProps {
  section: Section;
  index: number;
  onCopy: (phone: string) => void;
}

function RunningHead({ section, page, side }: { section: Section; page: number; side: 'left' | 'right' }) {
  const place = `Indiranagar · ${section.navLabel}`;
  const number = `${COPY.page} ${page}`;
  return (
    <p className="sheet__head" aria-hidden="true">
      <span>{side === 'left' ? number : place}</span>
      <span>{side === 'left' ? place : number}</span>
    </p>
  );
}

function SectionIntro({ section, index }: { section: Section; index: number }) {
  return (
    <header className="intro">
      <span className="intro__no" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
      <h2 className="intro__title">{section.title}</h2>
      <p className="intro__subtitle">{section.subtitle}</p>
      <p className="intro__count">
        {section.listings.length} {COPY.places}
      </p>
    </header>
  );
}

/** The left-hand page of a spread (desktop only): title, then the first places. */
export function LeftPage({ section, index, onCopy }: PageProps) {
  const k = leftCount(section.listings.length);
  return (
    <div className="sheet__inner">
      <RunningHead section={section} page={index * 2 + 1} side="left" />
      <SectionIntro section={section} index={index} />
      <ul className="entries">
        {section.listings.slice(0, k).map((listing) => (
          <Entry key={listing.id} listing={listing} pattern={null} onCopy={onCopy} />
        ))}
      </ul>
    </div>
  );
}

/** The right-hand page: the rest of the places. On a phone it's the only page, so it carries the title
 *  and every place, and ends with the way to the neighbouring sections. */
export function RightPage({ section, index, onCopy, footer }: PageProps & { footer?: ReactNode }) {
  const k = leftCount(section.listings.length);
  return (
    <div className="sheet__inner">
      <RunningHead section={section} page={index * 2 + 2} side="right" />
      <div className="only-single">
        <SectionIntro section={section} index={index} />
      </div>
      <ul className="entries">
        {section.listings.map((listing, i) => (
          <Entry key={listing.id} listing={listing} pattern={null} onCopy={onCopy} className={i < k ? 'only-single' : undefined} />
        ))}
      </ul>
      {section.id === AD_AFTER_SECTION && <ClassifiedAd />}
      {footer}
    </div>
  );
}
