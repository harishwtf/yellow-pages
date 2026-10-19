interface CategoryChipsProps {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
  /** Section title, for the group's accessible name. */
  sectionTitle: string;
}

export function CategoryChips({ categories, selected, onSelect, sectionTitle }: CategoryChipsProps) {
  if (categories.length < 2) return null;
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label={`Filter ${sectionTitle} by category`}>
      <button type="button" className="chip" aria-pressed={selected === null} onClick={() => onSelect(null)}>
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className="chip"
          aria-pressed={selected === category}
          onClick={() => onSelect(selected === category ? null : category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
