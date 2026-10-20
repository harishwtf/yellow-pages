# Indiranagar peela pages — the move-in guide by M (phone-book edition)

The guide as a phone book: a directory-yellow cover, cream bookmarks sticking out of the top, and yellow
directory pages inside in the v5 style (black category bars, NAME ····· number, Top rated! tags). Scroll
to open the cover, then every stretch of scroll turns one page (snap points make each scroll settle on a
whole page). Click the left side of the book to go back, the right side to go forward; bookmarks and the
contents page jump to a section. Nothing scrolls inside a page: every item is measured and poured onto
pages, and what doesn't fit turns over, with a "(cont.)" bar when a category runs on. The closing note and
small print are the last page; there's no footer.

On phones and tablets (under 1024px) the book becomes one scrolling directory: the cover at the top,
then every section on one long paper page, with a numbered section index pinned along the top (the
section you're in is inked in). Each place's first line is a 44px call target, ⧉ copies the number, and the page ends on
a yellow back cover with the closing note. Desktop keeps the page-turning book.

The cover is printed chipboard: board relief and flecks, rubbed corners and edges, a hinge groove, and
ink with slightly rough edges and tiny voids. The pages carry a paper relief, fibres and flecks, with the
same ink voids. Every texture is a small inline SVG noise tile, so there are no image files.

React + Vite + TypeScript + Tailwind CSS v4. No backend, no images. Built to move into Emergent.ai.

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
src/index.css              @theme tokens, then the phone book: boards, pages, cover, bookmarks, the leaf
src/lib/pages.ts           sections → items → measured pages → the whole book (contents … closing)
src/components/
  Book.tsx                 desktop: the pinned stage, measuring page, spread, turning leaf, cover, arrows
  PhoneDirectory.tsx       phones: cover, pinned SectionIndex, one scrolling page of ListEntry rows
  PhoneBookCover.tsx       the yellow cover: Indiranagar, peela pages, what's inside
  BookPage.tsx             contents, directory, notes and closing pages; PageItem for the measuring pass
  DirEntry.tsx             one listing, v5 style: NAME ····· number ⧉ / ★ rating, Top rated!, link
  Bookmarks.tsx            the six slips: turned sections on the left page, the rest on the right
src/hooks/
  useBookScroll.ts         scroll → --p (cover) and --f (the turning leaf), plus the snap points
  usePagination.ts         measures every item in a hidden page and pours them into pages
```

## Behaviour

- Places are listed A–Z under each category (the data keeps the guide's order).
- Every section starts on a new page; one that needs two pages is split evenly across them. The closed
  book sits a little further away and comes towards you as the cover opens.
- The search icon (top right) finds places by name or category; a result turns the book to its page (or
  scrolls to it on phones) and highlights it. Numbers call straight from the results.
- Only the outer margins of the open book turn pages on click (the page-turn cursor shows there).
- One scroll gesture opens the cover or turns one spread, however fast the flick (trackpad momentum is
  ignored); swipes and ↑ ↓ ← → / Page Up/Down / Space do the same. Bookmarks and the contents jump further.
- Click or tap the left half of the book to go back, the right half to go forward; ← → do the same.
- A link like `/#utilities` opens the book at that section, and the address follows as you read.
- With reduced motion the cover and pages switch at each stop without turning.
