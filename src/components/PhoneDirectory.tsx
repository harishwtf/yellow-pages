import { useEffect, useMemo, useState } from 'react';
import { useActiveSection } from '../hooks/useActiveSection';
import { sectionItems } from '../lib/pages';
import type { Section } from '../types';
import { Closing } from './Closing';
import { HomeLink } from './HomeLink';
import { ListEntry } from './ListEntry';
import { PhoneBookCover } from './PhoneBookCover';
import { SearchButton, type SearchHit, SearchPanel } from './SearchPanel';
import { SectionIndex } from './SectionIndex';

/** Height of the pinned section index; sections stop just below it. Keep in step with `.index`. */
const STRIP = 62;

/** The guide on phones and tablets: the cover, then every section on one long paper page you scroll,
 *  with the section index pinned along the top. Built for one hand: no page turns to aim for. */
export function PhoneDirectory({ sections, onCopy }: { sections: Section[]; onCopy: (phone: string) => void }) {
  const perSection = useMemo(() => sectionItems(sections), [sections]);
  const ids = useMemo(() => sections.map((s) => s.id), [sections]);
  const active = useActiveSection(ids, STRIP + 24);
  const total = sections.reduce((n, s) => n + s.listings.length, 0);

  /** Search: scroll to the place and give it a highlighter swipe. */
  const [searching, setSearching] = useState(false);
  const [flash, setFlash] = useState<{ id: string; key: number } | null>(null);
  const openPlace = ({ listing }: SearchHit) => {
    setSearching(false);
    setFlash({ id: listing.id, key: Date.now() });
    window.requestAnimationFrame(() => document.getElementById(`place-${listing.id}`)?.scrollIntoView({ block: 'center' }));
  };

  // A link to a section (#kitchen) lands on it once the page has rendered.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (ids.includes(id)) document.getElementById(id)?.scrollIntoView();
  }, [ids]);

  // The address follows the section being read, so it can be shared.
  useEffect(() => {
    try {
      const next = active ? `#${active}` : `${window.location.pathname}${window.location.search}`;
      window.history.replaceState(window.history.state, '', next);
    } catch {
      // History API unavailable.
    }
  }, [active]);

  return (
    <div className="m-book">
      <div className="m-top">
        <HomeLink onHome={() => window.scrollTo({ top: 0 })} />
        <SearchButton onOpen={() => setSearching(true)} />
      </div>
      {searching && <SearchPanel sections={sections} onClose={() => setSearching(false)} onPick={openPlace} />}
      <SectionIndex sections={sections} active={active} />
      <header className="m-cover cover__front">
        <PhoneBookCover sections={sections} total={total} />
      </header>

      <div className="m-pages">
        {perSection.map((items) => {
          const head = items[0];
          if (head.kind !== 'head') return null;
          const { section } = head;
          return (
            <section key={section.id} id={section.id} className="m-section" aria-labelledby={`${section.id}-title`}>
              <div className="item--head">
                <span className="num-tab" aria-hidden="true">
                  {head.index + 1}
                </span>
                <div>
                  <h2 id={`${section.id}-title`} className="sec-title">
                    {section.title}
                  </h2>
                  <p className="sec-sub">{section.subtitle}</p>
                </div>
              </div>
              {items.slice(1).map((item) => {
                if (item.kind === 'cat') {
                  return (
                    <h3 key={item.key} className="cat-bar m-cat">
                      {item.label}
                    </h3>
                  );
                }
                if (item.kind === 'entry') {
                  return (
                    <ListEntry
                      key={item.key}
                      listing={item.listing}
                      onCopy={onCopy}
                      flashKey={flash?.id === item.listing.id ? flash.key : undefined}
                    />
                  );
                }
                return null;
              })}
            </section>
          );
        })}
      </div>

      <section className="m-back cover__front" aria-label="M">
        <Closing />
      </section>
    </div>
  );
}
