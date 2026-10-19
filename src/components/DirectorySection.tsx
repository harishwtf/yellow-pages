import { COPY } from '../data/ui';
import { useInView } from '../hooks/useInView';
import type { Listing, Section } from '../types';
import { DirectoryEntry } from './DirectoryEntry';

interface DirectorySectionProps {
  section: Section;
  /** The section's listings after search. */
  listings: Listing[];
  /** The page number in the running head. */
  page: number;
  query: string;
  onNotify: (text: string) => void;
}

/** One section, set as a directory page: running head, title, then the entries in two columns. */
export function DirectorySection({ section, listings, page, query, onNotify }: DirectorySectionProps) {
  const [ref, inView] = useInView<HTMLElement>();
  return (
    <section
      ref={ref}
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      data-reveal={inView ? 'in' : 'out'}
      className="scroll-mt-20 xl:scroll-mt-10"
    >
      <p className="running-head caps" aria-hidden="true">
        <span>
          {COPY.place} · {section.navLabel}
        </span>
        <span>P.{page}</span>
      </p>
      <h2 id={`${section.id}-title`} className="display section__title">
        {section.title}
      </h2>
      <p className="section__subtitle">{section.subtitle}</p>
      <ul className="directory">
        {listings.map((listing) => (
          <DirectoryEntry key={listing.id} listing={listing} query={query} onNotify={onNotify} />
        ))}
      </ul>
    </section>
  );
}
