// Converts data/guide.md (the guide as markdown tables) into src/data/listings.json.
// Rows are copied verbatim; "—" becomes null. Run with: npm run data
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const SOURCE = resolve(here, '../data/guide.md');
const OUTPUT = resolve(here, '../src/data/listings.json');
/** Google Play pages for the App Store listings, keyed by listing id. Every app listing must have one. */
const PLAY_STORE = resolve(here, '../data/play-store.json');

/** Section ids, nav labels, titles and subtitles exactly as the live site has them, by section number. */
const SECTIONS = {
  1: { id: 'settle-in', navLabel: 'Settle in', title: 'A little shelf help', subtitle: 'Unpack, unwind and settle in' },
  2: { id: 'kitchen', navLabel: 'Kitchen', title: 'May the fork be with you', subtitle: 'Set up your kitchen' },
  3: { id: 'utilities', navLabel: 'Utilities', title: 'Plug into Convenience', subtitle: 'Get your utilities working' },
  4: { id: 'laundry', navLabel: 'Laundry', title: 'Dhobi or not dhobi?', subtitle: 'Get your laundry sorted' },
  5: { id: 'plants', navLabel: 'Plants', title: 'Grow new roots', subtitle: 'Make it cozy with plants' },
  6: {
    id: 'neighbourhood',
    navLabel: 'Neighbourhood',
    title: 'Love thy neighbourhood',
    subtitle: 'Find cafes, gyms and favorite corners',
  },
};
const LINK_TYPES = { Website: 'website', Maps: 'maps', 'App Store': 'app', 'Contact M': 'contact' };
/** Official services that get a small check mark. */
const VERIFIED = new Set(['BESCOM 24x7', 'BBMP / BSWML']);
/** The one listing set as a boxed, featured entry. */
const FEATURED = new Set(['M – trained home cook']);

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
    const meta = SECTIONS[Number(heading[1])];
    if (!meta) throw new Error(`No section meta for "${line}"`);
    current = { ...meta, listings: [] };
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
  // "1533 (WhatsApp +91 94481 97197)": the number to call, plus a note kept as written.
  const phoneCell = nullable(number);
  const phoneParts = phoneCell?.match(/^(.+?)\s*\((.+)\)$/);

  const listing = {
    id: `${current.id}-${slug(name)}`,
    categories: category.split(' / ').map((c) => c.trim()),
    name,
    ...(VERIFIED.has(name) && { verified: true }),
    linkType,
    url: linkMatch[2],
    phone: phoneParts ? phoneParts[1] : phoneCell,
    ...(phoneParts && { phoneNote: phoneParts[2] }),
    rating: ratingCell === null ? null : Number(ratingCell),
    ...(FEATURED.has(name) && { featured: true }),
  };
  current.listings.push(listing);
}

const seen = new Set();
for (const section of sections) {
  for (const listing of section.listings) {
    if (seen.has(listing.id)) listing.id = `${listing.id}-${slug(listing.categories[0])}`;
    if (seen.has(listing.id)) throw new Error(`Duplicate listing id: ${listing.id}`);
    seen.add(listing.id);
  }
}
const playStore = existsSync(PLAY_STORE) ? JSON.parse(readFileSync(PLAY_STORE, 'utf8')) : {};
for (const section of sections) {
  for (const listing of section.listings) {
    if (listing.linkType !== 'app') continue;
    const play = playStore[listing.id];
    if (!play?.url) throw new Error(`No Google Play link for ${listing.id} in data/play-store.json`);
    listing.androidUrl = play.url;
  }
}
for (const name of [...VERIFIED, ...FEATURED]) {
  if (!sections.some((s) => s.listings.some((l) => l.name === name))) throw new Error(`No listing named "${name}"`);
}

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, `${JSON.stringify({ sections }, null, 2)}\n`);
const total = sections.reduce((n, s) => n + s.listings.length, 0);
console.log(`Wrote ${sections.length} sections, ${total} listings → ${OUTPUT}`);
for (const s of sections) console.log(`  ${s.navLabel}: ${s.listings.length}`);
