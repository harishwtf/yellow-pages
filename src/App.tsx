import { Fragment, useEffect, useMemo, useState } from 'react';
import { ChapterChips } from './components/ChapterChips';
import { ChapterSection } from './components/ChapterSection';
import { EmptyState } from './components/EmptyState';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { MPlug } from './components/MPlug';
import { PaperTexture } from './components/PaperTexture';
import { SearchBar } from './components/SearchBar';
import { Toast } from './components/Toast';
import { COPY } from './data/ui';
import listingsData from './data/listings.json';
import { useActiveSection } from './hooks/useActiveSection';
import { useToast } from './hooks/useToast';
import { readUrlState, useUrlSync } from './hooks/useUrlState';
import { matchesQuery } from './lib/search';
import type { GuideData } from './types';

const data = listingsData as GuideData;
const INITIAL = readUrlState();
/** M's own listing (the one that opens M's contact form): its plug follows the Kitchen chapter. */
const M_LISTING = data.sections
  .flatMap((section) => section.listings)
  .find((listing) => listing.linkType === 'contact');

export default function App() {
  const [query, setQuery] = useState(INITIAL.query);
  const [categoryFilters, setCategoryFilters] = useState<Record<string, string | null>>({});
  const { toast, show: notify } = useToast();

  useUrlSync({ query });

  // The chapters only exist once React has drawn them, after the browser has tried the #hash: go there now.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const id = hash === 'corners' ? 'neighbourhood' : hash;
    if (id) document.getElementById(id)?.scrollIntoView({ block: 'start' });
  }, []);

  const searching = query.trim().length > 0;

  const chapters = useMemo(
    () =>
      data.sections.map((section) => {
        const category = searching ? null : (categoryFilters[section.id] ?? null);
        const listings = section.listings.filter(
          (listing) => matchesQuery(listing, query) && (category === null || listing.category === category),
        );
        return { section, listings };
      }),
    [query, searching, categoryFilters],
  );
  const visibleChapters = searching ? chapters.filter((chapter) => chapter.listings.length > 0) : chapters;
  const resultCount = chapters.reduce((count, chapter) => count + chapter.listings.length, 0);
  const activeId = useActiveSection(visibleChapters.map((chapter) => chapter.section.id));

  const jumpTo = (sectionId: string) => {
    setQuery('');
    window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ block: 'start' });
      try {
        window.history.replaceState(window.history.state, '', `#${sectionId}`);
      } catch {
        // scrolling already happened
      }
    });
  };

  return (
    <div className="relative min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[95] focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:font-bold focus:uppercase focus:tracking-wider focus:text-bg"
      >
        Skip to places
      </a>
      <Header />
      <div className="sticky-bar">
        <div className="mx-auto flex max-w-[68rem] flex-col gap-2 px-4 py-2.5">
          <SearchBar value={query} onChange={setQuery} resultCount={resultCount} />
          <ChapterChips sections={data.sections} activeId={activeId} onJump={jumpTo} />
        </div>
      </div>

      <main id="main" className="mx-auto max-w-[68rem] px-4 pt-8">
        {visibleChapters.length === 0 ? (
          <EmptyState icon="search" title={`${COPY.noMatches} “${query.trim()}”`} hint={COPY.noMatchesHint} />
        ) : (
          <div className="space-y-14">
            {visibleChapters.map(({ section, listings }) => (
              <Fragment key={section.id}>
                <ChapterSection
                  section={section}
                  listings={listings}
                  query={query}
                  filter={{
                    selected: categoryFilters[section.id] ?? null,
                    onSelect: (category) =>
                      setCategoryFilters((prev) => ({
                        ...prev,
                        [section.id]: category,
                      })),
                  }}
                  onNotify={notify}
                />
                {section.id === 'kitchen' && !searching && M_LISTING && <MPlug listing={M_LISTING} />}
              </Fragment>
            ))}
          </div>
        )}
      </main>
      <Footer contactUrl={M_LISTING?.url ?? undefined} />
      <Toast toast={toast} />
      <PaperTexture />
    </div>
  );
}
