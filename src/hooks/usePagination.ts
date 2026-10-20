import { type RefObject, useLayoutEffect, useState } from 'react';
import { type Item, type Page, paginate } from '../lib/pages';

/** Measures every item in a hidden page the same size as the real ones, then pours them into pages.
 *  Re-runs when the page size changes and once the fonts have loaded, so nothing ever overflows a page. */
export function usePagination(perSection: Item[][], measure: RefObject<HTMLDivElement | null>) {
  const [pages, setPages] = useState<Page[]>([]);

  useLayoutEffect(() => {
    const root = measure.current;
    if (!root) return;
    let lastKey = '';
    const run = () => {
      const body = root.querySelector<HTMLElement>('.sheet__body');
      if (!body) return;
      const room = body.clientHeight;
      // The book may be drawn scaled (it zooms in as it opens): measure in unscaled layout pixels.
      const scale = root.getBoundingClientRect().height / root.offsetHeight || 1;
      const heights = new Map<string, number>();
      let catHeight = 0;
      root.querySelectorAll<HTMLElement>('[data-key]').forEach((el) => {
        const h = el.getBoundingClientRect().height / scale;
        heights.set(el.dataset.key ?? '', h);
        if (!catHeight && el.dataset.kind === 'cat') catHeight = h;
      });
      const key = `${room}|${[...heights.values()].join(',')}`;
      if (key === lastKey) return;
      lastKey = key;
      setPages(paginate(perSection, heights, room, catHeight));
    };
    run();
    void document.fonts?.ready.then(run);
    const observer = new ResizeObserver(run);
    observer.observe(root);
    return () => observer.disconnect();
  }, [perSection, measure]);

  return pages;
}
