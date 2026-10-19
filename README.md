# The Indiranagar Move-In Guide — by M (notebook edition)

A kraft notebook named Indiranagar on a cream desk, with six yellow paper bookmarks sticking out of the
top, one per section. Scroll (or tap the cover) and it swings open; tap a bookmark and the pages turn to
that section. On desktop it's a two-page spread — title and the first places on the left, the rest on
the right — and the bookmarks for sections you've passed move to the left page, as in a real book. On a
phone it's one page at a time, with ‹ › buttons at the foot.

React + Vite + TypeScript + Tailwind CSS v4. No backend, no images: the cover, stamps, bookmarks and
pages are SVG and CSS. Built to move into Emergent.ai.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run data     # data/guide.md → src/data/listings.json
npm run fonts    # re-download the self-hosted Archivo, Caveat and Fraunces
npm run versions # build every saved version side by side (npm run versions:serve to view)
```

## Where things live

```
src/data/listings.json     every listing (generated from data/guide.md; never edited by hand)
src/data/ui.ts             every piece of interface copy and link
src/index.css              @theme tokens, then the notebook, pages, bookmarks and page-turn styles
src/components/
  BookStage.tsx            the pinned stage: bookmarks, back board, pages, turning leaf, cover
  CoverArt.tsx, Stamps.tsx the kraft cover: label, title, M stamp, "64 places inside" stamp
  Bookmarks.tsx            the six slips and where they sit, closed and open
  BookPages.tsx            left and right pages of a section (one long page on phones)
  Entry.tsx                one listing: NAME ····· number ⧉, tags, rating, Call on phones
src/hooks/
  useOpenProgress.ts       scroll → --p (0 closed … 1 open); tapping the cover scrolls it open
  useBook.ts               the open section (in the hash, e.g. #kitchen) and the page turn
```

## Behaviour

- Scrolling 0.9 of a screen opens the cover; a bookmark on the closed book opens it straight there.
- ← and → turn pages; a link like `/#utilities` opens the book at that section.
- Long sections scroll within the page; a fade at the foot of the page shows there's more.
- With reduced motion the book starts open and pages swap without turning.
