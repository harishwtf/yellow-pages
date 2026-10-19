import { COPY } from '../data/ui';
import { fold } from '../lib/search';

interface QuickChipsProps {
  query: string;
  onPick: (query: string) => void;
}

/** Five quick searches under the search bar. Tapping the current one clears it. */
export function QuickChips({ query, onPick }: QuickChipsProps) {
  return (
    <ul className="mt-3 flex flex-wrap gap-2" aria-label="Quick searches">
      {COPY.chips.map((chip) => {
        const on = fold(query) === fold(chip);
        return (
          <li key={chip}>
            <button type="button" className="chip" aria-pressed={on} onClick={() => onPick(on ? '' : chip)}>
              {chip}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
