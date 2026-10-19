import { Highlight } from './Highlight';

/** Small uppercase ink-outlined tags, one per category. */
export function CategoryTags({ categories, query }: { categories: string[]; query: string }) {
  return (
    <>
      {categories.map((category) => (
        <span key={category} className="tag">
          <Highlight text={category} query={query} />
        </span>
      ))}
    </>
  );
}
