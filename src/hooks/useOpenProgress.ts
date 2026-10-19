import { type RefObject, useCallback, useEffect, useState } from 'react';
import { prefersReducedMotion } from '../lib/motion';

/** Scroll distance to open the folder, in viewport heights. Keep in step with `.track` in index.css. */
const OPEN_DISTANCE = 0.9;

/** Scroll opens the folder: progress runs 0 → 1 over the track's first stretch and lands on the stage as --p.
 *  With reduced motion there's no scroll animation: the folder simply starts open. */
export function useOpenProgress(track: RefObject<HTMLElement | null>, stage: RefObject<HTMLElement | null>) {
  const [reduced] = useState(prefersReducedMotion);
  const [open, setOpen] = useState(reduced);

  /** How far the user scrolls to open it fully. The track in CSS is 100svh + this + a short hold. */
  const distance = useCallback(() => window.innerHeight * OPEN_DISTANCE, []);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    if (reduced) {
      el.style.setProperty('--p', '1');
      el.setAttribute('data-full', 'true');
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const top = track.current?.getBoundingClientRect().top ?? 0;
      const p = Math.min(1, Math.max(0, -top / distance()));
      el.style.setProperty('--p', p.toFixed(4));
      // Fully open: what was turning in 3D can be swapped for flat, crisp copies.
      el.setAttribute('data-full', String(p > 0.985));
      setOpen(p > 0.6);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [reduced, stage, track, distance]);

  /** Tap to open: scroll to the end of the open stretch, so scroll and tap stay one motion. */
  const openFully = useCallback(
    (instant = false) => {
      const el = track.current;
      if (!el || reduced) return;
      const top = el.getBoundingClientRect().top + window.scrollY + distance();
      window.scrollTo({ top, behavior: instant ? 'auto' : 'smooth' });
    },
    [reduced, track, distance],
  );

  return { open, openFully, reduced };
}
