# The Indiranagar Move-In Guide — by M

M's move-in guide for Indiranagar, Bengaluru ([indiranagar.tellm.co](https://indiranagar.tellm.co/)),
set as an old phone directory: a cover-yellow card, paper pages, dotted leaders from each name to its
number, thumb-index tabs, running heads, and one boxed classified ad. Calm, analogue, and quick to use on a
phone mid-move. The Yellow Pages name and marks are not used; the mark is M's wave.

React 19 + Vite 8 + TypeScript + Tailwind CSS v4. No backend. The front end is meant to move into
Emergent.ai, so it is component-based and data-driven: every listing comes from one JSON file, every
colour and font is a token, every line of copy lives in one place.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve dist/
npm run data      # data/playbook.csv + data/sections.json → src/data/listings.json
npm run fonts     # re-download the self-hosted fonts and rewrite src/fonts.css
npm run lint      # oxlint
npm run versions  # build every git tag side by side into versions/ (npm run versions:serve → :4180)
```

## Where things live

```
data/playbook.csv             the guide's spreadsheet, exported as CSV and copied in verbatim: the source of truth
data/sections.json            the six sections' id, nav label, title and subtitle, in sheet order
scripts/build-listings.mjs    turns the two into src/data/listings.json (npm run data); the rules are in its header
scripts/fetch-fonts.sh        downloads Archivo (width + weight axes) and Caveat as latin woff2 (npm run fonts)
scripts/build-versions.sh     builds every tag + the working copy, with versions-index.html as the flip viewer
public/hero.png               the cover illustration: a line-art placeholder, swap it for the real one
public/favicon.svg            the M wave on a yellow tile
public/fonts/                 Archivo variable, Caveat variable (OFL)
src/
  index.css                   the tokens (@theme) and the component classes
  types.ts                    Listing / Section / Directory
  data/listings.json          generated; never edited by hand
  data/ui.ts                  all copy, the link labels, the chips, the red-circle threshold, the CTA link
  lib/                        search (folded matching + highlight ranges), phone, clipboard, jump, cn
  hooks/                      useActiveSection, useInView, useLongPress, useToast, useUrlQuery
  components/
    Cover                     the directory cover: illustration, title, subtitle, "— by M", search, quick chips
    SectionNav                TabStrip (sticky strip on small screens) and ThumbIndex (tabs down the right edge from 1280px)
    DirectorySection          running head, title, subtitle, the entries in two columns with a thin rule
    DirectoryEntry            NAME ····· number, then tags · ★ rating · action link; boxed in red pen when featured
    PhoneLink, ActionLink     the tel: link (a Call button on a phone) with a copy icon; Map / App / Website / Contact M
    Rating, CategoryTags, VerifiedMark, AdCard, BackCover, EmptyState, Toast, Highlight, PaperGrain, MWave, icons
```

## Design

- **Colour** (tokens in `src/index.css`): cover yellow `#F4C430` for the covers, tabs and primary buttons; page
  paper `#FBF4DC` for the reading areas; ink `#1C1B18`; muted ink `#5E5A50` (AA on paper, so never small on the
  yellow); rules at 15% ink; red pen `#C23B2E` only on the featured box and the top-rated circles.
- **Type**: Archivo throughout. Titles and business names at a condensed width (`font-stretch: 75%`) and a
  black weight, in capitals, like directory listings. Phone numbers are bold with tabular numerals and are the
  loudest thing on each line. Caveat is used once: the cover signature "— by M".
- **Paper**: a faint SVG grain over the whole page and a slight darkening at the edges of the covers. Felt,
  not seen. No stains, tape or clutter.
- **The nostalgic details, and no others**: dotted leaders, double rules on the two boxes, running heads
  ("INDIRANAGAR · KITCHEN · P.2"), thumb-index tabs, a thin hand-drawn red circle around ratings of 4.8 and
  up, and M's promo as a boxed classified ad with a small "ADVERTISEMENT" label.
- **Motion**: a gentle fade-up as each section arrives and the red circles drawing in once. Both off under
  `prefers-reduced-motion`.

## Behaviour

- Search filters every section live by name and category; matching is on letters and digits only, so
  "wifi" finds "Wi-Fi". Matches get a highlighter swipe. Empty sections collapse; nothing at all shows
  "Nothing in the directory for that." The search is in the URL (`?q=gas`). The five chips set the search.
- The tabs jump to a section and light up as you scroll past it; while searching they show the match counts.
- The number is a `tel:` link. On a phone it is the yellow Call button; the copy icon beside it, or
  touch-and-hold on the number, copies it and shows "Number copied".
- Entries without a number put their one link where the number would be. Missing numbers and ratings are
  simply absent, never "—".
- "Get Access to M" and "Need a hand?" both open M's site in a new tab (`CONTACT_M` in `src/data/ui.ts`).

## Data

`src/data/listings.json` is `{ sections: [{ id, navLabel, title, subtitle, note, listings: [{ id,
categories, name, verified?, linkType, url, phone, phoneNote?, rating, featured? }] }] }`. Nothing in it is
typed by hand: the build reads the sheet and applies these rules (see the script's header for the full list):
rows with the same name in one section merge into one listing with several categories (Urban Company has
six); a name ending in "(featured)" is M's own entry; a rating cell of "Official" marks a verified helpline;
"1533 (WhatsApp +91 …)" splits into the number and a note; the link is the App Store page, M's site, a Google
Maps page, the map location for a local shop, or otherwise the website. Empty cells are `null`.

## Checks

Lighthouse (mobile, production build, 20 Oct 2026): performance 96, accessibility 100, best practices 100,
SEO 92. No horizontal scroll at 360px. The cover is 70% of a 375×812 viewport and about 440px tall at 1440px,
so the first entries show without scrolling.

## History

- **v1–v5** (19 Oct 2026): a printed Yellow Pages with annotations, a Web Interface Guidelines pass, a clean
  single-column directory, a printed phone-book page, and a classic directory with one line per place.
- **v6** (20 Oct 2026): rebuilt from scratch to the design brief, with the listings from the guide's
  spreadsheet (83 entries) instead of the site's 64.
