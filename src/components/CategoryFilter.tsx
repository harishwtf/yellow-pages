interface CategoryFilterProps {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
  sectionTitle: string;
}

/** A line of small-caps text to narrow a chapter to one category, like an index line. */
export function CategoryFilter({ categories, selected, onSelect, sectionTitle }: CategoryFilterProps) {
  if (categories.length < 2) return null;
  return (
    <p className="filters" role="group" aria-label={`Filter ${sectionTitle} by category`}>
      <button type="button" className="filter" aria-pressed={selected === null} onClick={() => onSelect(null)}>
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className="filter"
          title={category}
          aria-pressed={selected === category}
          onClick={() => onSelect(selected === category ? null : category)}
        >
          {category}
        </button>
      ))}
    </p>
  );
}
