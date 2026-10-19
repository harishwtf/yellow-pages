import { useCallback, useEffect, useRef, useState } from 'react';

/** How long a page takes to turn; the CSS leaf animation uses the same value. */
export const TURN_MS = 700;

export interface Turn {
  /** forward: the right-hand leaf turns over to the left; back: a leaf comes over from the left. */
  dir: 'forward' | 'back';
  /** What the turning leaf shows on its front (a right-hand page) and back (a left-hand page). */
  front: number;
  back: number;
  key: number;
}

const indexFromHash = (ids: string[]) => {
  const i = ids.indexOf(decodeURIComponent(window.location.hash.slice(1)));
  return i;
};

/** Which section the book is open at, which halves are showing, and the page currently turning.
 *  The section lives in the hash (#kitchen) so a link opens the book there. */
export function useBook(ids: string[], animate: boolean) {
  const [initial] = useState(() => indexFromHash(ids));
  const [current, setCurrent] = useState(Math.max(0, initial));
  /** The left and right pages lag behind `current` while a leaf is turning, like a real book. */
  const [shown, setShown] = useState({ left: Math.max(0, initial), right: Math.max(0, initial) });
  const [turn, setTurn] = useState<Turn | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const currentRef = useRef(current);

  const goTo = useCallback(
    (next: number, withTurn: boolean) => {
      const prev = currentRef.current;
      if (next === prev || next < 0 || next >= ids.length) return;
      currentRef.current = next;
      try {
        window.history.replaceState(window.history.state, '', `#${ids[next]}`);
      } catch {
        // History API unavailable: the book still turns.
      }
      window.clearTimeout(timer.current);
      setCurrent(next);
      if (!withTurn || !animate) {
        setTurn(null);
        setShown({ left: next, right: next });
        return;
      }
      const forward = next > prev;
      setShown((s) => (forward ? { left: s.left, right: next } : { left: next, right: s.right }));
      setTurn({ dir: forward ? 'forward' : 'back', front: forward ? prev : next, back: forward ? next : prev, key: Date.now() });
      timer.current = window.setTimeout(() => {
        setShown({ left: next, right: next });
        setTurn(null);
      }, TURN_MS);
    },
    [ids, animate],
  );

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return { current, shown, turn, goTo, linkedOnLoad: initial >= 0 };
}
