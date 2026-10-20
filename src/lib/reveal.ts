let observer: IntersectionObserver | null = null;

/** Cards keep a steady rhythm as they arrive, one every STEP_MS, however the scroll batches them; none waits longer
 *  than MAX_WAIT_MS, so a fast flick still fills the screen quickly. */
const STEP_MS = 60;
const MAX_WAIT_MS = 240;
let nextSlot = 0;

function shared(): IntersectionObserver | null {
  if (observer || typeof IntersectionObserver === 'undefined') return observer;
  observer = new IntersectionObserver((entries, io) => {
    // Top to bottom, then left to right, so the two desktop columns cascade down the page together.
    const arriving = entries
      .filter((entry) => entry.isIntersecting)
      .sort(
        (a, b) =>
          a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left,
      );
    for (const entry of arriving) {
      const element = entry.target as HTMLElement;
      const now = performance.now();
      const wait = Math.min(Math.max(0, nextSlot - now), MAX_WAIT_MS);
      nextSlot = now + wait + STEP_MS;
      element.style.setProperty('--reveal-delay', `${Math.round(wait)}ms`);
      element.setAttribute('data-in', '');
      io.unobserve(element);
    }
  });
  return observer;
}

/** Ref callback for a `.reveal` element (a card, M's plug): it fades and slides up into place the first time it
 *  scrolls into view (see index.css). Without IntersectionObserver nothing is ever hidden (main.tsx only sets
 *  `.motion` when it exists). */
export function reveal(element: Element | null) {
  const io = shared();
  if (!element || !io) return;
  io.observe(element);
  return () => io.unobserve(element);
}
