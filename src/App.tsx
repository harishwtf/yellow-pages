import { useCallback, useMemo, useState } from 'react';
import { ChapterChips } from './components/ChapterChips';
import { ChapterSection } from './components/ChapterSection';
import { EmptyState } from './components/EmptyState';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { PaperTexture } from './components/PaperTexture';
import { SavedView, type SavedItem } from './components/SavedView';
import { SearchBar } from './components/SearchBar';
import { Toast } from './components/Toast';
import { CHAPTER_META, COPY, STORAGE_KEYS } from './data/ui';
import listingsData from './data/listings.json';
import { useActiveSection } from './hooks/useActiveSection';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useToast } from './hooks/useToast';
import { readUrlState, useUrlSync } from './hooks/useUrlState';
import { matchesQuery } from './lib/search';
import type { GuideData, Listing } from './types';

const data = listingsData as GuideData;
const ALL_LISTINGS: Listing[] = data.sections.flatMap((section) => section.listings);
const LISTING_BY_ID = new Map(ALL_LISTINGS.map((listing) => [listing.id, listing]));
const SECTION_OF = new Map(data.sections.flatMap((section) => section.listings.map((listing) => [listing.id, section.id])));
const INITIAL = readUrlState();

export default function App() {
  const [query, setQuery] = useState(INITIAL.query);
  const [view, setView] = useState<'all' | 'saved'>(INITIAL.view);
  const [savedIds, setSavedIds] = useLocalStorage<string[]>(STORAGE_KEYS.favorites, []);
  const { toast, show: notify, dismiss: dismissToast } = useToast();

  useUrlSync({ query, view });

  const saved = useMemo(() => new Set(savedIds), [savedIds]);
  const searching = query.trim().length > 0;

  const chapters = useMemo(
    () =>
      data.sections.map((section) => ({
        section,
        listings: section.listings.filter((listing) => matchesQuery(listing, query)),
      })),
    [query],
  );
  const visibleChapters = searching ? chapters.filter((chapter) => chapter.listings.length > 0) : chapters;
  const resultCount = chapters.reduce((count, chapter) => count + chapter.listings.length, 0);
  const activeId = useActiveSection(view === 'all' ? visibleChapters.map((chapter) => chapter.section.id) : []);

  const savedItems = useMemo<SavedItem[]>(
    () =>
      savedIds.flatMap((id) => {
        const listing = LISTING_BY_ID.get(id);
        if (!listing || !matchesQuery(listing, query)) return [];
        return [{ listing, chapterLabel: CHAPTER_META[SECTION_OF.get(id) ?? '']?.short ?? '' }];
      }),
    [savedIds, query],
  );

  const toggleSaved = useCallback(
    (listing: Listing) => {
      const index = savedIds.indexOf(listing.id);
      if (index === -1) {
        setSavedIds((prev) => (prev.includes(listing.id) ? prev : [...prev, listing.id]));
        notify(COPY.savedToast);
        return;
      }
      setSavedIds((prev) => prev.filter((id) => id !== listing.id));
      notify(COPY.removedToast, {
        label: COPY.undo,
        onClick: () =>
          setSavedIds((prev) => {
            if (prev.includes(listing.id)) return prev;
            const next = [...prev];
            next.splice(Math.min(index, next.length), 0, listing.id);
            return next;
          }),
      });
    },
    [savedIds, setSavedIds, notify],
  );

  const jumpTo = (sectionId: string) => {
    setView('all');
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
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:font-bold focus:uppercase focus:tracking-wider focus:text-bg"
      >
        Skip to places
      </a>
      <Header
        onHome={() => {
          setQuery('');
          setView('all');
          window.scrollTo({ top: 0 });
          try {
            window.history.replaceState(window.history.state, '', window.location.pathname);
          } catch {
            // the view is already reset
          }
        }}
      />
      <div className="sticky-bar">
        <div className="mx-auto flex max-w-4xl flex-col gap-2 px-4 py-2.5">
          <SearchBar value={query} onChange={setQuery} resultCount={view === 'saved' ? savedItems.length : resultCount} />
          <ChapterChips
            sections={data.sections}
            activeId={activeId}
            view={view}
            savedCount={savedIds.length}
            onJump={jumpTo}
            onToggleSaved={() => setView((current) => (current === 'saved' ? 'all' : 'saved'))}
          />
        </div>
      </div>

      <main id="main" className="mx-auto max-w-4xl px-4 pt-8">
        {view === 'saved' ? (
          <SavedView items={savedItems} query={query} onToggleSaved={toggleSaved} onNotify={notify} />
        ) : visibleChapters.length === 0 ? (
          <EmptyState icon="search" title={`${COPY.noMatches} “${query.trim()}”`} hint={COPY.noMatchesHint} />
        ) : (
          <div className="space-y-14">
            {visibleChapters.map(({ section, listings }) => (
              <ChapterSection
                key={section.id}
                section={section}
                listings={listings}
                query={query}
                saved={saved}
                onToggleSaved={toggleSaved}
                onNotify={notify}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
      <Toast toast={toast} onDismiss={dismissToast} />
      <PaperTexture />
    </div>
  );
}
