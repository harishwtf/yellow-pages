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
public/fonts/                 DM Sans, Fraunces, Caveat (latin woff2, OFL)
design/                       postcard illustrations generated with Figma AI (not used by the app)
src/
  index.css                   theme tokens (@theme) + base + the few component classes
  fonts.css                   @font-face rules for the self-hosted fonts
  types.ts                    Listing / Section types
  data/listings.json          generated; { sections: [{ id, number, title, listings: [...] }] }
  data/ui.ts                  UI copy, chapter labels / icons / tones, featured card, storage key
  lib/                        phone formatting, search matching, clipboard
  hooks/                      useLocalStorage (try/catch), useActiveSection, useToast, useUrlState
  components/
    Header                    title, "by M", one-line intro
    SearchBar                 live search across name + category
    ChapterChips              chapter anchors with icons + the Saved view, in a sticky bar
    ChapterSection            chapter header, category filters, cards
    ListingCard               name → category · rating → number + copy / open / store, heart to save
    OpenLink, icons           website / map / App Store / Play Store / contact links and line icons
    SavedView, EmptyState     saved places, and the empty states
    Footer, Toast, Highlight
```

## Design

A directory-yellow page with white rounded cards on it, like a white book on a yellow table: one
reading order per card, a pastel badge per chapter, a double masthead rule and a tiny imprint
line as the only Yellow Pages flourishes, butter yellow for the featured card and search
highlights, and a pink heart for saved places. Fraunces for headings, DM Sans for everything
else, Caveat only for the "by M" byline. No textures, no decoration that does not do a job.

Every colour and font is a token in the `@theme` block at the top of `src/index.css`; chapter
tones are `--color-<chapter>` and `--color-<chapter>-ink`.

## Behaviour

- Search filters every chapter live and highlights matches; chapters with no match are hidden.
- Chapter chips jump to the chapter (the sticky bar keeps them in reach); the current chapter is
  highlighted as you scroll.
- Category filters narrow a chapter; they are hidden while searching.
- The heart saves a place to this phone (`localStorage`, every access wrapped in try/catch);
  removing shows an Undo. The Saved chip switches to a view of saved places.
- Phone numbers are `tel:` links with a copy icon; links open in a new tab. App Store rows also
  carry a Google Play link (package ids checked against the store).
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
  clean single-column design.
