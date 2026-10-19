# The Indiranagar Move-In Guide — by M

A calm, single-column directory of trusted services for people moving into Indiranagar, Bengaluru:
who to call, where to go, what to install. Source data: [indiranagar.tellm.co](https://indiranagar.tellm.co/).

React + Vite + TypeScript + Tailwind CSS v4. No backend.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve dist/
```

## Where things live

```
data/guide.md                 the guide as markdown tables (the source of truth)
data/play-store.json          Google Play pages for the App Store listings, merged in by the build
scripts/build-listings.mjs    converts data/guide.md → src/data/listings.json   (npm run data)
scripts/fetch-fonts.sh        re-downloads the self-hosted fonts                (npm run fonts)
scripts/ink-art.mjs           turns black-and-white art into a 4-tone ink PNG with transparent paper
public/img/spot-auto-*.png    the one ink spot drawing on the cover (an auto rickshaw), 240 and 480 wide
public/fonts/                 Archivo Narrow, Oswald, Caveat (latin woff2, OFL)
design/                       the spot drawing source (Figma AI) and the store icon SVGs
src/
  index.css                   theme tokens (@theme) + base + the few component classes
  fonts.css                   @font-face rules for the self-hosted fonts
  types.ts                    Listing / Section types
  data/listings.json          generated; { sections: [{ id, number, title, listings: [...] }] }
  data/ui.ts                  UI copy, chapter labels / icons / tones, featured card, storage key
  lib/                        phone formatting, search matching, clipboard
  hooks/                      useLocalStorage (try/catch), useActiveSection, useToast, useUrlState
  components/
    Header                    phone-book cover masthead: imprint, double rules, set-type title, by M, promise, ink spot
    PaperTexture              paper relief (SVG normal map, soft-light) + printed ink voids (lighten), over the document
    SearchBar                 live search across name + category
    ChapterChips              the index: numbered chapter tabs + Saved, in a sticky bar
    ChapterSection            numbered chapter header, category filters, two-column listings
    ListingCard               NAME ······ number, category · rating; tap the name to unfold copy / open / save
    OpenLink, icons           website / map / App Store / Play Store / contact links and line icons
    SavedView, EmptyState     saved places, and the empty states
    Footer, Toast, Highlight
```

## Design

A printed directory page, set calmly: directory-yellow paper, condensed grotesk (Archivo Narrow)
for every entry, heavy condensed display (Oswald) for the masthead and chapter titles, bold
uppercase names with dotted leaders running to local phone numbers (no +91, the tel: link keeps
it), dotted hairlines between entries, two columns with a rule from tablet up, numbered black
index tabs, a double masthead rule, and one boxed "display ad" for M. Each entry is two lines of
print; tapping the name unfolds its actions (copy number, map / website / stores, save) as small
caps text, and a copy icon sits right after every number. App Store and Google Play links use
the real store marks, set in the page ink. The paper has tooth: an SVG normal map (a noise height
field run through feDiffuseLighting) laid in soft-light, plus sparse specks of the paper colour in
lighten mode that knock tiny voids out of every printed line and letter. Both scroll with the page.
The masthead is a phone-book cover set in real type: the imprint line, double rules, the title in
Oswald, "by M", the one-line promise, and one small linocut-style ink spot of an auto rickshaw. It
takes about a third of the first screen. Red only for saved hearts.
Nothing handwritten, no textures, no cards.

Every colour and font is a token in the `@theme` block at the top of `src/index.css`.

## Behaviour

- Search filters every chapter live and highlights matches; chapters with no match are hidden.
- Chapter chips jump to the chapter (the sticky bar keeps them in reach); the current chapter is
  highlighted as you scroll.
- Category filters narrow a chapter; they are hidden while searching.
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

### Regenerating the spot drawing

Crop the white space off `design/spot-auto.png` (sips or any editor), resize to 240 and 480 wide,
then `node scripts/ink-art.mjs <in.png> public/img/spot-auto-<w>.png '#1c1a17'`.
