# peela.pages

*Peela* is Hindi for yellow: the yellow pages for anyone moving into Indiranagar, Bengaluru.
It is the Indiranagar move-in guide by M, set as a phone book.

A calm, single-column directory of trusted services for people moving into Indiranagar, Bengaluru:
who to call, where to go, what to install. Source data: [indiranagar.tellm.co](https://indiranagar.tellm.co/).

React + Vite + TypeScript + Tailwind CSS v4. No backend.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve dist/
npm run versions        # build every saved version (git tags v1, v2, …) + the working copy into versions/
npm run versions:serve  # flip between them at http://localhost:4180
```

## Where things live

```
data/guide.md                 the guide as markdown tables (the source of truth)
data/play-store.json          Google Play pages for the App Store listings, merged in by the build
scripts/build-listings.mjs    converts data/guide.md → src/data/listings.json   (npm run data)
scripts/fetch-fonts.sh        re-downloads the self-hosted fonts                (npm run fonts)
scripts/ink-art.mjs           turns black-and-white art into a 4-tone ink PNG with transparent paper
scripts/pixel-cursors.mjs     draws the 1-bit cursors as crisp SVGs (npm run cursors prints the CSS tokens)
scripts/build-versions.sh     builds every tag side by side, with versions-index.html as the viewer
public/fonts/                 Archivo Narrow, Fraunces with its SOFT axis (latin woff2, OFL)
design/                       the store icon SVGs and the cursor SVGs
src/
  index.css                   theme tokens (@theme) + base + the few component classes
  fonts.css                   @font-face rules for the self-hosted fonts
  types.ts                    Listing / Section types
  data/listings.json          generated; { sections: [{ id, number, title, listings: [...] }] }
  data/ui.ts                  UI copy, chapter labels / icons / tones, featured card, storage key
  lib/                        phone formatting, search matching, clipboard, group-by-category
  hooks/                      useLocalStorage (try/catch), useActiveSection, useToast, useUrlState
  components/
    Header                    the masthead: the "peela.pages by M" home link top left, the title, one line
    PaperTexture              paper relief (SVG normal map, soft-light) + printed ink voids (lighten), over the document
    SearchBar                 live search across name + category
    ChapterChips              the index: numbered chapter tabs + Saved, in a sticky bar
    ChapterSection            chapter header, then category headings with one directory line per place
    DirectoryEntry            NAME ······ number ⧉ / ★ rating · Top rated! · map-web-store icons · ♡
    FeaturedCard              M's own entry, set as a boxed display ad
    OpenLink, icons           website / map / App Store / Play Store / contact links and their marks
    SavedView, EmptyState     saved places (same directory lines, with chapter · category), empty states
    PaperTexture              paper relief (SVG normal map) + printed ink voids, over the document
    Footer, Toast, Highlight
```

## Design

A printed phone-book page in directory yellow and ink, built so nobody has to think or click
more than once. Nothing decorative that doesn't help someone act: no imprint line, no ornamental
rules. The masthead is just type: a small "peela.pages by M" home link top left, the title in Fraunces
set soft and chunky, then one quiet line, "Who to call, where to go, what to install." The home
link clears search, leaves Saved and goes back to the top. Each chapter opens on a
numbered ink tab and a soft-serif title, then lists its places under black category bars, like a
phone book.

Every place is one directory line, with everything visible:

    WAKEFIT ································ 98833 33123 ⧉
    ★ 4.6  Top rated!                               ◎  ♡

Tap the number to call, ⧉ to copy it, the icon for the map / website / app stores, ♡ to save.
Places without a number put their one action (Website, App Store and Play Store, Contact M) where
the number would be. M's own entry is a boxed display ad. Places rated 4.9 or more carry a red
"Top rated!" tag. On a mouse or trackpad the cursors are the vintage 1-bit set: the classic Mac arrow, the
HyperCard pointing hand over anything you can tap, and the pixel I-beam in search; each directory line lights up under the
pointer so the eye stays on the right number. The paper has tooth (an SVG normal map in soft-light) and the ink has printed
voids (lighten).

Every colour and font is a token in the `@theme` block at the top of `src/index.css`.

## Behaviour

- Search filters every chapter live and highlights matches; chapters with no match are hidden.
- Chapter chips jump to the chapter (the sticky bar keeps them in reach); the current chapter is
  highlighted as you scroll.
- Category headings inside each chapter replace filters; search narrows everything at once.
- The heart saves a place to this phone (`localStorage`, every access wrapped in try/catch);
  removing shows an Undo. The Saved chip switches to a view of saved places.
- Phone numbers are `tel:` links printed without the country code; "Copy number" copies the full
  number and shows it in the toast. Links open in a new tab. App Store rows also carry a Google
  Play link (package ids checked against the store).
- Search and the Saved view are in the query string (`?q=gas`, `?view=saved`), chapters are
  `#anchors`, so any view can be shared.

## Data

`src/data/listings.json` is generated from `data/guide.md`; edit the markdown and run
`npm run data`. Rows are copied verbatim, "—" becomes `null`, and each listing gets a stable id
of `<section>-<category>-<name>`. Two additions on request: Google Play links for App Store rows,
and M's row reworded from "trained home cook" to kitchen management.

## History

- **v1** — first build, a printed Yellow Pages with handwritten annotations.
- **v2** — Web Interface Guidelines pass (URL state, undo, safe areas, motion, typography).
- Uncommitted after v2: cards, icons, a Seasoned-inspired restyle, a WebGL paper shader, a
  book with bookmark tabs, an ink line-art pass. All of it judged a miss and replaced by this
  clean single-column design (v3).
- After v3: "this doesn't feel like Yellow Pages, it feels like a B2B website" — reset as a
  printed directory page (condensed type, leaders, numbered tabs, the M ad box) on the same
  calm structure.

