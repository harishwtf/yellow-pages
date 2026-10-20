import { COPY } from '../data/ui';
import type { Item, Page } from '../lib/pages';
import type { Section } from '../types';
import { Closing } from './Closing';
import { DirEntry } from './DirEntry';

interface BookPageProps {
  page: Page;
  /** Printed page number (the contents page has none). */
  number: number;
  side: 'left' | 'right';
  sections: Section[];
  /** Book page index where each section starts, for the contents list. */
  starts: Record<string, number>;
  onCopy: (phone: string) => void;
  onGoTo: (sectionId: string) => void;
  /** A section just picked from the contents or a bookmark: its title gets a highlighter swipe. */
  flash?: Flash | null;
}

export interface Flash {
  id: string;
  key: number;
}

/** Renders one item of a directory page. Shared with the measuring pass so heights match exactly. */
export function PageItem({ item, onCopy, flash }: { item: Item; onCopy: (phone: string) => void; flash?: Flash | null }) {
  switch (item.kind) {
    case 'head':
      return (
        <div className="item item--head">
          <span className="num-tab" aria-hidden="true">
            {item.index + 1}
          </span>
          <div>
            <h2 className="sec-title">
              {flash?.id === item.section.id && <span key={flash.key} className="sec-title__flash" aria-hidden="true" />}
              {item.section.title}
            </h2>
            <p className="sec-sub">{item.section.subtitle}</p>
          </div>
        </div>
      );
    case 'cat':
      return (
        <div className="item item--cat">
          <p className="cat-bar">
            {item.label}
            {item.cont && <span className="cat-bar__cont"> ({COPY.continued})</span>}
          </p>
        </div>
      );
    case 'entry':
      return (
        <div className="item item--entry">
          {flash?.id === item.listing.id && <span key={flash.key} className="place-flash" aria-hidden="true" />}
          <DirEntry listing={item.listing} onCopy={onCopy} />
        </div>
      );
  }
}

function RunningHead({ left, right, number, side }: { left: string; right: string; number?: number; side: 'left' | 'right' }) {
  return (
    <p className="sheet__head" aria-hidden="true">
      {side === 'left' && number !== undefined && <span className="sheet__no">{number}</span>}
      <span className="sheet__guide">{left}</span>
      <span className="sheet__guide sheet__guide--end">{right}</span>
      {side === 'right' && number !== undefined && <span className="sheet__no">{number}</span>}
    </p>
  );
}

/** One page of the book, whatever kind it is. */
export function BookPage({ page, number, side, sections, starts, onCopy, onGoTo, flash }: BookPageProps) {
  if (page.kind === 'title') {
    const total = sections.reduce((n, sec) => n + sec.listings.length, 0);
    return (
      <div className="sheet__inner">
        <div className="sheet__body title-page">
          <p className="title-page__top">
            <span>
              {COPY.pinPlace} {COPY.pinCode}
            </span>
            <span>{COPY.edition}</span>
          </p>
          <p className="title-page__place">{COPY.coverPlace}</p>
          <p className="title-page__brand">{COPY.coverBrand}</p>
          <p className="title-page__sub">
            {COPY.coverSub}{' '}
            <span className="title-page__sig" translate="no">
              {COPY.signature}
            </span>
          </p>
          <div className="title-page__foot">
            <p className="title-page__promise">{COPY.promise}</p>
            <p className="title-page__count">
              {total} {COPY.places} · {sections.length} {COPY.sectionsWord}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (page.kind === 'contents') {
    return (
      <div className="sheet__inner">
        <RunningHead left={COPY.coverPlace} right={COPY.coverBrand} side={side} />
        <div className="sheet__body contents">
          <h2 className="contents__title">{COPY.contents}</h2>
          <ol className="contents__list">
            {sections.map((section, i) => (
              <li key={section.id}>
                <button type="button" className="contents__row" onClick={() => onGoTo(section.id)}>
                  <span className="num-tab num-tab--small" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="contents__name">
                    <b>{section.navLabel}</b>
                    <span>{section.title}</span>
                  </span>
                  <span className="leader" aria-hidden="true" />
                  <span className="contents__page">{starts[section.id]}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  if (page.kind === 'closing') {
    return (
      <div className="sheet__inner">
        <RunningHead left={COPY.coverPlace} right={COPY.coverBrand} number={number} side={side} />
        <div className="sheet__body">
          <Closing />
        </div>
      </div>
    );
  }

  if (page.kind === 'notes') {
    return (
      <div className="sheet__inner">
        <RunningHead left={COPY.coverPlace} right={COPY.notes} number={number} side={side} />
        <div className="sheet__body notes">
          <p className="notes__title">{COPY.notes}</p>
        </div>
      </div>
    );
  }

  const guide = page.first === page.last ? page.first : `${page.first} – ${page.last}`;
  return (
    <div className="sheet__inner">
      <RunningHead left={page.section.navLabel} right={guide} number={number} side={side} />
      <div className="sheet__body">
        {page.items.map((item) => (
          <div key={item.key}>
            <PageItem item={item} onCopy={onCopy} flash={flash} />
          </div>
        ))}
      </div>
    </div>
  );
}
