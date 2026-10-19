import { Fragment, useMemo, useState } from 'react';
import { AdCard } from './components/AdCard';
import { BackCover } from './components/BackCover';
import { Cover } from './components/Cover';
import { DirectorySection } from './components/DirectorySection';
import { EmptyState } from './components/EmptyState';
import { PaperGrain } from './components/PaperGrain';
import { TabStrip, ThumbIndex, type SectionTab } from './components/SectionNav';
import { Toast } from './components/Toast';
import { AD_AFTER_SECTION, COPY } from './data/ui';
import listingsData from './data/listings.json';
import { useActiveSection } from './hooks/useActiveSection';
import { useToast } from './hooks/useToast';
import { readUrlQuery, useUrlQuerySync } from './hooks/useUrlQuery';
import { matchesListing } from './lib/search';
import type { Directory } from './types';

const directory = listingsData as Directory;

export default function App() {
  const [query, setQuery] = useState(readUrlQuery);
  const { toast, notify } = useToast();
  useUrlQuerySync(query);

  const pages = useMemo(
    () =>
      directory.sections.map((section, index) => ({
        section,
        page: index + 1,
        listings: section.listings.filter((listing) => matchesListing(listing, query)),
      })),
    [query],
  );
  const visible = pages.filter((page) => page.listings.length > 0);
  const resultCount = visible.reduce((count, page) => count + page.listings.length, 0);
  const activeId = useActiveSection(visible.map((page) => page.section.id));

  const tabs: SectionTab[] = pages.map(({ section, listings }) => ({
    id: section.id,
    label: section.navLabel,
    count: listings.length,
    active: section.id === activeId,
    empty: listings.length === 0,
  }));

  return (
    <>
      <a
        href="#directory"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:font-bold focus:uppercase focus:tracking-wider focus:text-cover"
      >
        {COPY.skipLink}
      </a>
      <Cover query={query} onQueryChange={setQuery} resultCount={resultCount} />
      <TabStrip tabs={tabs} />
      <ThumbIndex tabs={tabs} />
      <main id="directory" className="mx-auto max-w-[62rem] px-4 pt-10 md:pt-14">
        {visible.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-14 md:space-y-20">
            {visible.map(({ section, page, listings }) => (
              <Fragment key={section.id}>
                <DirectorySection section={section} listings={listings} page={page} query={query} onNotify={notify} />
                {section.id === AD_AFTER_SECTION && <AdCard />}
              </Fragment>
            ))}
          </div>
        )}
      </main>
      <BackCover />
      <Toast toast={toast} />
      <PaperGrain />
    </>
  );
}
