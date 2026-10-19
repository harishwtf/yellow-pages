# The Indiranagar Move-In Guide — by M

A single-page directory of trusted services for people moving into Indiranagar, Bengaluru,
styled like an old printed phone book that a friend has scribbled tips all over.
Source data: [indiranagar.tellm.co](https://indiranagar.tellm.co/).

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
scripts/build-listings.mjs    converts data/guide.md → src/data/listings.json   (npm run data)
scripts/fetch-fonts.sh        re-downloads the self-hosted fonts                (npm run fonts)
public/fonts/                 Archivo Narrow, Oswald, Caveat, Kalam (latin woff2, OFL)
src/
  index.css                   theme tokens (@theme) + paper textures + component classes
  fonts.css                   @font-face rules for the self-hosted fonts
  types.ts                    Listing / Section types
  data/listings.json          generated; { sections: [{ id, number, title, listings: [...] }] }
  data/annotations.ts         UI copy, thumb-tab labels, margin notes, featured card, storage keys
  lib/                        phone formatting, search matching, clipboard, deterministic wobble
  hooks/                      useLocalStorage (try/catch), useInView, useActiveSection, useToast, useUrlState
  components/
    Header                    phone-book cover masthead with torn bottom edge
    SectionNav                thumb-index tabs (sticky strip on mobile, right-edge stack on desktop)
    SearchBar                 live search across name + category
    CategoryChips             per-section category filter
    SectionChapter            chapter header, Done ✓ checkbox, chips, column layout
    ListingCard               name · dotted leader · phone, rating, Copy / Open / ★ actions
    FavoritesDrawer           "My Page": starred listings on a torn-out page
    Footer                    source + small print, coffee ring
    Toast, Highlight, TornEdge, PaperTexture
    ink/                      HandCircle, HandCheck, HandArrow, HandUnderline, HandCheckbox
```

## Re-skinning

Every colour and font is a Tailwind theme token in the `@theme` block at the top of
`src/index.css` (`--color-paper`, `--color-ink`, `--color-pen-red`, `--font-print`, …).
Change them there and the whole app follows. Handwritten copy, thumb-tab labels and the
per-chapter margin notes are in `src/data/annotations.ts`.

Textures are generated, not image files: SVG `feTurbulence` noise and fibre overlays,
a CSS radial-gradient vignette and halftone, a CSS coffee ring and an SVG torn edge.

## Data

`src/data/listings.json` is generated from `data/guide.md`; edit the markdown and run
`npm run data`. Rows are copied verbatim, "—" becomes `null`, and each listing gets a stable id
of `<section>-<category>-<name>`. Nothing in the UI invents data: ratings, phones and links are
shown exactly as listed, and a phone like "1533 (WhatsApp …)" dials the part before the bracket.

## Linkable state

Search, per-chapter category filters and the My Page drawer are mirrored into the query string
(`?q=gas&kitchen=Gas&page=mine`), and the active chapter into the hash, so any view can be
shared or bookmarked. Writes use `replaceState`, debounced, so typing never spams history.

## Local state

Favourites (`movein-guide:favorites`) and the chapter checklist (`movein-guide:checklist`)
are stored in `localStorage`; every access is wrapped in try/catch so private mode or a full
quota only loses persistence, never the page.

## Versions

- **v1** — first complete build: data pipeline, paper textures, annotations, search, favourites,
  checklist, self-hosted fonts.
- **v2** — audited against Vercel's Web Interface Guidelines (`web-design-guidelines` skill):
  URL-linkable search, filters and drawer; Undo when a place is taken off My Page; hover and
  thumb-tab motion on transform/opacity only; safe-area insets and `viewport-fit=cover`;
  `touch-action: manipulation` and intentional tap highlight; `scroll-padding-top` so the sticky
  tab strip never covers a focused element; `overscroll-behavior` on the drawer and desktop page;
  `content-visibility: auto` per chapter; `text-balance` / `text-pretty`, curly quotes, non-breaking
  spaces and `translate="no"` on names and numbers; modifier-clicks on thumb tabs left to the browser.
