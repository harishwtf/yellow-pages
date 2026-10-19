import type { MouseEvent } from 'react';

/** A plain left click, with no modifier that asks the browser for a new tab or window. */
export const isPlainClick = (event: MouseEvent): boolean =>
  !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0);

/** Scroll a section into view and put its anchor in the address bar without adding history. */
export function jumpTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ block: 'start' });
  try {
    window.history.replaceState(window.history.state, '', `#${id}`);
  } catch {
    // the scroll already happened
  }
}
