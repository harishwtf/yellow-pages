// Builds src/data/listings.json from the guide's spreadsheet.
//   data/playbook.csv    the sheet, exported as CSV and copied in verbatim (never edited by hand)
//   data/sections.json   the six sections' id, nav label, title and subtitle, in sheet order
// Run with: npm run data
//
// Rules, all derived from the sheet (nothing is invented):
//   - a row whose first cell is "1. Settle in" (a number, a dot, a name) and has no name starts a section;
//     its second cell is the section's one-line note
//   - rows with the same name inside one section become one listing with several categories
//     (Urban Company: Plumber, Electrician, Carpenter, Appliance repair, Pest control, Deep cleaning)
//   - a name ending in "(featured)" is M's own entry: the marker comes off and `featured` goes on
//   - a rating cell of "Official" means a verified helpline: `verified: true`, no rating
//   - the rating is the first number in the rating cell (the App Store figure for apps, Google for shops)
//   - "1533 (WhatsApp +91 94481 97197)" splits into phone "1533" and phoneNote "WhatsApp +91 94481 97197";
//     "a / b" splits into phone "a" and phoneNote "b"; an empty cell is null
//   - the action link: an App Store page is "app", tellm.co is "contact", a Google Maps page is "maps",
//     a local shop or store with a map location is "maps", any other site is "website",
//     and a row with only a map location is "maps"
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const CSV = resolve(here, '../data/playbook.csv');
const SECTIONS = resolve(here, '../data/sections.json');
const OUTPUT = resolve(here, '../src/data/listings.json');

/** The sheet's columns, in order. */
const COL = { section: 0, category: 1, name: 2, type: 3, rating: 4, link: 5, phone: 6, address: 7, why: 8, map: 9 };

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += c;
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const tidy = (s) => (s ?? '').replace(/\s+/g, ' ').trim();
const slug = (s) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
const isUrl = (s) => /^https?:\/\//i.test(s);
const isMaps = (s) => /maps\.app\.goo\.gl|google\.[a-z.]+\/maps|maps\.google\./i.test(s);

function resolveLink(type, link, map, name) {
  if (isUrl(link) && /apps\.apple\.com/i.test(link)) return { linkType: 'app', url: link };
  if (isUrl(link) && /(^|\.)tellm\.co/i.test(new URL(link).hostname)) return { linkType: 'contact', url: link };
  if (isUrl(link) && isMaps(link)) return { linkType: 'maps', url: link };
  if (/^local/i.test(type) && isUrl(map) && isMaps(map)) return { linkType: 'maps', url: map };
  if (isUrl(link)) return { linkType: 'website', url: link };
  if (isUrl(map) && isMaps(map)) return { linkType: 'maps', url: map };
  throw new Error(`No link or map for ${name}`);
}

function parsePhone(cell) {
  const text = tidy(cell);
  if (!text) return { phone: null };
  const paren = text.match(/^(.*?)\s*\((.+)\)$/);
  if (paren) return { phone: paren[1].trim(), phoneNote: paren[2].trim() };
  const alternatives = text.split(/\s*\/\s*/);
  if (alternatives.length > 1) return { phone: alternatives[0], phoneNote: alternatives.slice(1).join(' / ') };
  return { phone: text };
}

function parseRating(cell) {
  const text = tidy(cell);
  const number = text.match(/^(\d+(?:\.\d+)?)/);
  return { rating: number ? Number(number[1]) : null, verified: /^official$/i.test(text) };
}

const meta = JSON.parse(readFileSync(SECTIONS, 'utf8'));
const rows = parseCsv(readFileSync(CSV, 'utf8'));
const headerAt = rows.findIndex((r) => tidy(r[COL.section]) === 'Section');
if (headerAt === -1) throw new Error('No header row (a row starting with "Section") in data/playbook.csv');

const sections = [];
let current = null;
for (const r of rows.slice(headerAt + 1)) {
  const cell = (key) => tidy(r[COL[key]]);
  const heading = cell('section').match(/^(\d+)\.\s+(.+)$/);
  if (heading && !cell('name')) {
    const m = meta[sections.length];
    if (!m) throw new Error(`The sheet has more sections than data/sections.json (at "${cell('section')}")`);
    current = { id: m.id, navLabel: m.navLabel, title: m.title, subtitle: m.subtitle, note: cell('category'), listings: [] };
    sections.push(current);
    continue;
  }
  if (!current || !cell('name')) continue;

  let name = cell('name');
  let featured = false;
  const marker = name.match(/^(.*?)\s*\(featured\)$/i);
  if (marker) {
    name = marker[1];
    featured = true;
  }
  const category = cell('category');
  const existing = current.listings.find((l) => l.name === name);
  if (existing) {
    if (!existing.categories.includes(category)) existing.categories.push(category);
    continue;
  }

  const { rating, verified } = parseRating(cell('rating'));
  const link = resolveLink(cell('type'), cell('link'), cell('map'), name);
  const phone = parsePhone(cell('phone'));
  const listing = { id: `${current.id}-${slug(name)}`, categories: [category], name };
  if (verified) listing.verified = true;
  listing.linkType = link.linkType;
  listing.url = link.url;
  listing.phone = phone.phone;
  if (phone.phoneNote) listing.phoneNote = phone.phoneNote;
  listing.rating = rating;
  if (featured) listing.featured = true;
  current.listings.push(listing);
}
if (sections.length !== meta.length) throw new Error(`Found ${sections.length} sections in the sheet, expected ${meta.length}`);

const ids = new Set();
for (const s of sections)
  for (const l of s.listings) {
    if (ids.has(l.id)) throw new Error(`Duplicate id ${l.id}`);
    ids.add(l.id);
  }

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, `${JSON.stringify({ sections }, null, 2)}\n`);
console.log(
  `Wrote ${sections.length} sections, ${ids.size} listings → src/data/listings.json (${sections.map((s) => `${s.navLabel} ${s.listings.length}`).join(', ')})`,
);
