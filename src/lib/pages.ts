import type { Listing, Section } from '../types';

/** Everything that can sit on a directory page, in reading order. */
export type Item =
  | { kind: 'head'; key: string; section: Section; index: number }
  | { kind: 'cat'; key: string; label: string; cont?: boolean }
  | { kind: 'entry'; key: string; listing: Listing; cat: string };

/** A page of the book. Section pages carry the items that fit; the rest are fixed pages. */
export type Page =
  | { kind: 'title' }
  | { kind: 'contents' }
  | { kind: 'section'; section: Section; items: Item[]; first: string; last: string }
  | { kind: 'notes' }
  | { kind: 'closing' };

const catLabel = (l: Listing) => l.categories.join(' · ');

/** A–Z as a directory prints it: case and punctuation ignored ("R K Nursery" files under R). */
const byName = new Intl.Collator('en', { sensitivity: 'base', ignorePunctuation: true, numeric: true });

/** Each section's items: its heading, then a black bar per category (in the guide's order) with the places
 *  under it listed A–Z, like a directory. The data itself keeps the guide's order. */
export function sectionItems(sections: Section[]): Item[][] {
  return sections.map((section, index) => {
    const groups = new Map<string, Listing[]>();
    for (const listing of section.listings) {
      const label = catLabel(listing);
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label)!.push(listing);
    }
    const items: Item[] = [{ kind: 'head', key: `${section.id}-head`, section, index }];
    for (const [label, listings] of groups) {
      const sorted = [...listings].sort((a, b) => byName.compare(a.name, b.name));
      items.push({ kind: 'cat', key: `${sorted[0].id}-cat`, label });
      for (const listing of sorted) items.push({ kind: 'entry', key: listing.id, listing, cat: label });
    }
    return items;
  });
}

/** Lays one section onto pages no taller than `cap`: a category bar never ends a page, and a category that
 *  runs over starts the next page with a "cont." bar. */
function pour(items: Item[], heights: Map<string, number>, cap: number, catHeight: number): Item[][] {
  const height = (key: string | undefined) => (key ? (heights.get(key) ?? 0) : 0);
  const pages: Item[][] = [];
  let page: Item[] = [];
  let used = 0;
  let cat = '';
  items.forEach((item, i) => {
    const h = height(item.key);
    // A heading or a bar travels with what follows it.
    const need =
      item.kind === 'head'
        ? h + height(items[i + 1]?.key) + height(items[i + 2]?.key)
        : item.kind === 'cat'
          ? h + height(items[i + 1]?.key)
          : h;
    if (used + need > cap && page.length) {
      pages.push(page);
      page = [];
      used = 0;
      if (item.kind === 'entry' && cat) {
        page.push({ kind: 'cat', key: `${item.key}-cont`, label: cat, cont: true });
        used += catHeight;
      }
    }
    if (item.kind === 'cat') cat = item.label;
    page.push(item);
    used += h;
  });
  if (page.length) pages.push(page);
  return pages;
}

/** Every section gets its own spread (or spreads): it starts on a left-hand page and fills an even number
 *  of pages, split evenly, so two sections never share a view and the next one only appears after a turn. */
export function paginate(perSection: Item[][], heights: Map<string, number>, room: number, catHeight: number): Page[] {
  const pages: Page[] = [];
  for (const items of perSection) {
    const section = (items[0] as Extract<Item, { kind: 'head' }>).section;
    const natural = pour(items, heights, room, catHeight).length;
    const target = Math.max(2, natural + (natural % 2));
    // The smallest page height that still fits the section on `target` pages: an even split.
    let lo = 0;
    let hi = room;
    while (hi - lo > 1) {
      const mid = Math.floor((lo + hi) / 2);
      if (pour(items, heights, mid, catHeight).length <= target) hi = mid;
      else lo = mid;
    }
    const laid = pour(items, heights, hi, catHeight);
    while (laid.length < target) laid.push([]);
    for (const page of laid) {
      const cats = page.filter((i): i is Extract<Item, { kind: 'cat' }> => i.kind === 'cat').map((i) => i.label);
      pages.push({ kind: 'section', section, items: page, first: cats[0] ?? section.navLabel, last: cats[cats.length - 1] ?? section.navLabel });
    }
  }
  return pages;
}

/** Book page index where each section's heading is printed. */
export function sectionStarts(pages: Page[]): Record<string, number> {
  const map: Record<string, number> = {};
  pages.forEach((page, i) => {
    if (page.kind !== 'section') return;
    for (const item of page.items) if (item.kind === 'head' && !(item.section.id in map)) map[item.section.id] = i;
  });
  return map;
}

/** The whole book: a title page and the contents on the first spread, the directory, then the closing page.
 *  The page count is made even with a ruled notes page so the closing note lands on the last right-hand page. */
export function bookPages(directory: Page[]): Page[] {
  const all: Page[] = [{ kind: 'title' }, { kind: 'contents' }, ...directory];
  if (all.length % 2 === 0) all.push({ kind: 'notes' });
  all.push({ kind: 'closing' });
  return all;
}
