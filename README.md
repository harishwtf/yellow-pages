# The Indiranagar Move-In Guide — by M

A printed phone-directory page of trusted services for people moving into Indiranagar, Bengaluru: a handbook of
everything you need to turn your house into a home. Source data: [indiranagar.tellm.co](https://indiranagar.tellm.co/).

React + Vite + TypeScript + Tailwind CSS v4. No backend.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve dist/
npm run data     # data/guide.md → src/data/listings.json
npm run logos    # design/logos/raw → one-ink logos in src/assets/logos (needs Google Chrome)
npm run scenes   # design/scenes/raw → ink header drawings in src/assets/scenes (needs Google Chrome)
```

## Where things live

```
data/guide.md                 the guide as markdown tables (the source of truth)
data/play-store.json          Google Play pages for the App Store listings, merged in by the build
data/logos.json               where each brand logo came from (or why a place gets initials instead)
scripts/build-listings.mjs    converts data/guide.md → src/data/listings.json   (npm run data)
scripts/build-logos.mjs       official logos → single-ink PNGs + src/data/logos.json sizes   (npm run logos)
scripts/build-scenes.mjs      Figma drawings → ink-on-transparent WebP at 600 and 1200 wide  (npm run scenes)
scripts/fetch-fonts.sh        re-downloads the self-hosted fonts                (npm run fonts)
public/fonts/                 Archivo Narrow, Oswald, Caveat (latin woff2, OFL)
design/logos/raw/             the official logos as downloaded
design/scenes/raw/            the header drawings as generated in Figma (black ink on white)
design/scenes/places.json     why each place was picked, what its drawing is based on, sources
src/
  index.css                   theme tokens (@theme) + base + the component classes
  fonts.css                   @font-face rules for the self-hosted fonts
  types.ts                    Listing / Section types
  data/listings.json          generated; { sections: [{ id, number, title, listings: [...] }] }
  data/ui.ts                  UI copy: chapter tabs, headers and subtitles, CMYK inks, M's ad, sign-off
  data/scenes.ts              the header drawings and their captions
  data/trivia.ts              "Did you know?" facts, each with its source
  lib/                        phone formatting, search, brand logos, A–Z grouping, reveal motion, storage, platform
  hooks/                      useActiveSection, useFreshPick, useToast, useUrlState
  components/
    Header                    cover masthead: imprint, double rules, title, by M, promise, a drawing per visit
    PaperTexture              paper relief (SVG normal map, soft-light) + printed ink voids (lighten), over the page
    SearchBar                 live search across name + category (ignores spaces and hyphens: "wifi" finds Wi-Fi)
    ChapterChips              the index: numbered tabs in each chapter's CMYK ink, in a sticky bar
    ChapterSection            chapter header + subtitle, category chips, category bars, two-column listings
    ListingCard               mark · NAME ······ number, then rating; copy button after every number
    BrandMark                 the place's logo in ink, or its initials in a stamped ring
    MPlug                     M's ad, reversed out of the ink, after the Kitchen chapter
    Trivia                    "Did you know?", reversed out of the ink, a different fact per visit
    OpenLink, icons           website / map / App Store or Google Play / contact icons
    Footer, Toast, Highlight, EmptyState, CategoryFilter
```

## Design

A printed directory page: directory-yellow paper, condensed grotesk (Archivo Narrow) for every entry, heavy
condensed display (Oswald) for the masthead and chapter titles, bold uppercase names with dotted leaders running to
local phone numbers (no +91, the tel: link keeps it), dotted hairlines between entries, two columns with a rule from
tablet up, a double masthead rule. Each chapter has a number tab in one of the four process inks (cyan, magenta,
yellow, key), a playful title with a plain subtitle, and black category bars as sub-headings. Every place carries its
own logo printed in the page ink (or its initials), and places within a category are listed A–Z.

The masthead shows one ink drawing of an iconic Indiranagar place per visit (never the same one twice in a row),
captioned like a printed plate. M's ad and the "Did you know?" box are reversed out of the ink. The paper has tooth:
an SVG normal map laid in soft-light plus sparse specks of the paper colour in lighten mode that knock tiny voids out
of the print; the two ink panels sit above it, and the sticky bar carries its own copy.

Every colour and font is a token in the `@theme` block at the top of `src/index.css`.

## Behaviour

- Search filters every chapter live and highlights matches; chapters with no match are hidden, and M's ad with them.
- Index tabs jump to a chapter; the current chapter's tab is marked as you scroll (and kept in view on phones).
  Links to a chapter (`/#laundry`) open at that chapter.
- Category chips narrow a chapter; they are hidden while searching.
- Phone numbers are `tel:` links printed without the country code; the copy button copies the full number and shows
  it in a toast. A place without a number shows its website / map / app / contact icon instead. App rows show one
  store: Google Play on Android, the App Store everywhere else.
- Cards fade and slide up the first time they scroll into view (ease-out cubic, a beat apart), driven by one
  registered CSS number so no card is lifted onto its own layer. Reduced motion, printing and browsers without
  IntersectionObserver show everything at once.
- Search is in the query string (`?q=gas`) and chapters are `#anchors`, so a view can be shared.

## Data

`src/data/listings.json` is generated from `data/guide.md`; edit the markdown and run `npm run data`. Rows are copied
verbatim, "—" becomes `null`, and each listing gets a stable id of `<section>-<category>-<name>`. One addition on
request: Google Play links for App Store rows.

## History

- **v1** — first build, a printed Yellow Pages with handwritten annotations.
- **v2** — Web Interface Guidelines pass (URL state, undo, safe areas, motion, typography).
- **v3** — "Phone-Book Page": reset as a printed directory page (condensed type, leaders, numbered tabs, the M ad).
- After v3, from team feedback: brand logos in ink, header drawings of iconic places, CMYK tabs, the copy deck's
  section headers, M's ad after Kitchen, fact-checked trivia, A–Z order; Save and the tap-to-unfold panel removed.
