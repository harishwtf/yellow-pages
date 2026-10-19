import { useCallback, useMemo, useState } from 'react';
import { FavoritesDrawer, type FavoriteItem } from './components/FavoritesDrawer';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { PaperTexture } from './components/PaperTexture';
import { SearchBar } from './components/SearchBar';
import { SectionChapter } from './components/SectionChapter';
import { SectionNav } from './components/SectionNav';
import { Toast } from './components/Toast';
import { COPY, SECTION_META, STORAGE_KEYS } from './data/annotations';
import listingsData from './data/listings.json';
import { useActiveSection } from './hooks/useActiveSection';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useToast } from './hooks/useToast';
import { matchesQuery } from './lib/search';
import type { GuideData, Listing } from './types';

const data = listingsData as GuideData;
const ALL_LISTINGS: Listing[] = data.sections.flatMap((section) => section.listings);
const LISTING_BY_ID = new Map(ALL_LISTINGS.map((listing) => [listing.id, listing]));
const SECTION_OF = new Map(data.sections.flatMap((section) => section.listings.map((listing) => [listing.id, section.id])));

export default function App() {
  const [query, setQuery] = useState('');
  const [categoryFilters, setCategoryFilters] = useState<Record<string, string | null>>({});
  const [favoriteIds, setFavoriteIds] = useLocalStorage<string[]>(STORAGE_KEYS.favorites, []);
  const [doneIds, setDoneIds] = useLocalStorage<string[]>(STORAGE_KEYS.checklist, []);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const { toast, show: notify } = useToast();

  const favorites = useMemo(() => new Set(favoriteIds), [favoriteIds]);
  const done = useMemo(() => new Set(doneIds), [doneIds]);
  const searching = query.trim().length > 0;

  const chapters = useMemo(
    () =>
      data.sections.map((section) => {
        const category = categoryFilters[section.id] ?? null;
        const listings = section.listings.filter(
          (listing) => matchesQuery(listing, query) && (category === null || listing.category === category),
        );
        return { section, listings };
      }),
    [query, categoryFilters],
  );
  const visibleChapters = searching ? chapters.filter((chapter) => chapter.listings.length > 0) : chapters;
  const resultCount = chapters.reduce((count, chapter) => count + chapter.listings.length, 0);
  const activeId = useActiveSection(visibleChapters.map((chapter) => chapter.section.id));

  const favoriteItems = useMemo<FavoriteItem[]>(
    () =>
      favoriteIds.flatMap((id) => {
        const listing = LISTING_BY_ID.get(id);
        if (!listing) return [];
        const sectionId = SECTION_OF.get(id) ?? '';
        return [{ listing, sectionLabel: SECTION_META[sectionId]?.short ?? '' }];
      }),
    [favoriteIds],
  );

  const toggleFavorite = useCallback(
    (listing: Listing) => {
      const has = favorites.has(listing.id);
      setFavoriteIds((prev) => (has ? prev.filter((id) => id !== listing.id) : [...prev.filter((id) => id !== listing.id), listing.id]));
      notify(has ? COPY.favoriteRemoved : COPY.favoriteAdded);
    },
    [favorites, setFavoriteIds, notify],
  );

  const setSectionDone = (sectionId: string, isDone: boolean) => {
    setDoneIds((prev) => (isDone ? [...prev.filter((id) => id !== sectionId), sectionId] : prev.filter((id) => id !== sectionId)));
    if (isDone) notify(COPY.sectionDone);
  };

  const jumpToSection = (sectionId: string) => {
    if (!visibleChapters.some((chapter) => chapter.section.id === sectionId)) setQuery('');
    window.requestAnimationFrame(() => {
      document.getElementById(`section-${sectionId}`)?.scrollIntoView({ block: 'start' });
      window.history.replaceState(null, '', `#section-${sectionId}`);
    });
  };

  const closeFavorites = useCallback(() => setFavoritesOpen(false), []);

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:font-bold focus:uppercase focus:tracking-wider focus:text-paper"
      >
        Skip to listings
      </a>
      <PaperTexture />
      <Header listingCount={ALL_LISTINGS.length} sectionCount={data.sections.length} />
      <SectionNav
        sections={data.sections}
        activeId={activeId}
        doneIds={done}
        favoriteCount={favoriteIds.length}
        favoritesOpen={favoritesOpen}
        onSelect={jumpToSection}
        onOpenFavorites={() => setFavoritesOpen(true)}
      />

      <main id="main" className="mx-auto max-w-6xl px-4 pt-6 lg:pr-28">
        <SearchBar value={query} onChange={setQuery} resultCount={resultCount} total={ALL_LISTINGS.length} />

        <div className="mt-8 space-y-14">
          {visibleChapters.map(({ section, listings }) => (
            <SectionChapter
              key={section.id}
              section={section}
              listings={listings}
              query={query}
              selectedCategory={categoryFilters[section.id] ?? null}
              onSelectCategory={(category) => setCategoryFilters((prev) => ({ ...prev, [section.id]: category }))}
              done={done.has(section.id)}
              onToggleDone={(isDone) => setSectionDone(section.id, isDone)}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onNotify={notify}
            />
          ))}
        </div>

        {searching && visibleChapters.length === 0 && (
          <p className="hand mt-16 text-center text-4xl leading-tight text-pen-blue">{COPY.emptySearch}</p>
        )}
      </main>

      <Footer />
      <FavoritesDrawer open={favoritesOpen} items={favoriteItems} onClose={closeFavorites} onRemove={toggleFavorite} />
      <Toast toast={toast} />
    </div>
  );
}
