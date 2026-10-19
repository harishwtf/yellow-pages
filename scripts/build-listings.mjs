// Converts data/guide.md (the guide as markdown tables) into src/data/listings.json.
// Rows are copied verbatim; "—" becomes null. Run with: npm run data
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const SOURCE = resolve(here, '../data/guide.md');
const OUTPUT = resolve(here, '../src/data/listings.json');

const SECTION_IDS = { 1: 'settle-in', 2: 'kitchen', 3: 'utilities', 4: 'laundry', 5: 'plants', 6: 'corners' };
const LINK_TYPES = { Website: 'website', Maps: 'maps', 'App Store': 'appstore', 'Contact M': 'contact' };

const slug = (text) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
const nullable = (cell) => (cell.trim() === '—' ? null : cell.trim());

const markdown = readFileSync(SOURCE, 'utf8');
const sections = [];
let current = null;

for (const rawLine of markdown.split('\n')) {
  const line = rawLine.trim();
  const heading = line.match(/^## (\d+)\. (.+)$/);
  if (heading) {
    const number = Number(heading[1]);
    current = { id: SECTION_IDS[number] ?? `section-${number}`, number, title: heading[2].trim(), listings: [] };
    sections.push(current);
    continue;
  }
  if (!current || !line.startsWith('|')) continue;
  const cells = line.slice(1, -1).split('|').map((cell) => cell.trim());
  if (cells.length !== 5 || cells[0] === 'Category' || /^-+$/.test(cells[0])) continue;

  const [category, name, link, number, rating] = cells;
  const linkMatch = link.match(/^\[(.+?)\]\((.+?)\)$/);
  if (!linkMatch) throw new Error(`Unreadable link cell: ${link}`);
  const linkType = LINK_TYPES[linkMatch[1]];
  if (!linkType) throw new Error(`Unknown link label "${linkMatch[1]}" for ${name}`);
  const ratingCell = nullable(rating);

  current.listings.push({
    id: `${current.id}-${slug(category)}-${slug(name)}`,
    category,
    name,
    linkType,
    url: linkMatch[2],
    phone: nullable(number),
    rating: ratingCell === null ? null : Number(ratingCell),
  });
}

const seen = new Set();
for (const section of sections) {
  for (const listing of section.listings) {
    if (seen.has(listing.id)) throw new Error(`Duplicate listing id: ${listing.id}`);
    seen.add(listing.id);
  }
}

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, `${JSON.stringify({ sections }, null, 2)}\n`);
const total = sections.reduce((n, s) => n + s.listings.length, 0);
console.log(`Wrote ${sections.length} sections, ${total} listings → ${OUTPUT}`);
