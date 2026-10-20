import { type RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../lib/motion';

/** Scroll distances, in viewport heights: one stretch swings the cover open, then one per page turn.
 *  Snap points sit at the end of each stretch so a scroll always settles on a whole page. */
export const OPEN_VH = 0.9;
export const TURN_VH = 0.75;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Maps the page's scroll position to the book: --p (cover, 0 → 1) and --f (the leaf turning, 0 → 1) on
 *  the stage, plus `step`, the spread or page the book rests on. With reduced motion nothing animates:
 *  the cover and pages simply switch at the halfway mark.
 *
 *  --f is always measured from the spread React has actually drawn. When a turn completes, the drawn leaf
 *  is held fully turned (which looks exactly like the next spread) until React draws the next spread, and
 *  the real value is applied in a layout effect before paint. So pages and bookmarks never snap back. */
export function useBookScroll(track: RefObject<HTMLElement | null>, stage: RefObject<HTMLElement | null>, turns: number) {
  const [reduced] = useState(prefersReducedMotion);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [vh, setVh] = useState(() => window.innerHeight);

  /** The spread currently drawn on screen, and the function that applies scroll to the stage. */
  const drawn = useRef(0);
  const apply = useRef<() => void>(() => {});

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const h = window.innerHeight;
      const scrolled = -(track.current?.getBoundingClientRect().top ?? 0);
      let p = clamp(scrolled / (h * OPEN_VH), 0, 1);
      const t = clamp((scrolled - h * OPEN_VH) / (h * TURN_VH), 0, turns);
      let k = Math.min(Math.floor(t), turns);
      // How far the drawn spread's leaf has turned (0 → 1), even if scroll has already reached the next one.
      let f = clamp(t - drawn.current, 0, 1);
      if (drawn.current >= turns) f = 0;
      if (reduced) {
        p = p >= 0.5 ? 1 : 0;
        k = Math.round(t);
        f = 0;
      }
      el.style.setProperty('--p', p.toFixed(4));
      el.style.setProperty('--f', f.toFixed(4));
      // At rest, the 3D pieces are swapped for flat ones so text stays crisp.
      el.setAttribute('data-still', String(f < 0.002));
      el.setAttribute('data-full', String(p > 0.985));
      setOpen(p > 0.6);
      setStep(k);
    };
    apply.current = update;
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const resize = () => {
      setVh(window.innerHeight);
      schedule();
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', resize);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
    };
  }, [reduced, stage, track, turns]);

  // A new spread has been drawn: measure the turn from it, before the browser paints.
  useLayoutEffect(() => {
    drawn.current = step;
    apply.current();
  }, [step]);

  /** Scroll to a resting point: -1 is the closed book, 0 the first spread, and so on. */
  const goTo = (target: number, instant = false) => {
    const el = track.current;
    if (!el) return;
    const h = window.innerHeight;
    const k = clamp(target, -1, turns);
    const offset = k < 0 ? 0 : h * OPEN_VH + k * h * TURN_VH;
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: instant || reduced ? 'auto' : 'smooth' });
  };
  const goToRef = useRef(goTo);
  useEffect(() => {
    goToRef.current = goTo;
  });

  /** One gesture turns one page, however fast: a wheel or trackpad flick, a swipe, or a key press moves to
   *  the next resting point, and the rest of that gesture (trackpad momentum included) is ignored. */
  const latest = useRef({ open: false, step: 0 });
  useEffect(() => {
    latest.current = { open, step };
  }, [open, step]);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let busyUntil = 0;
    let lastEvent = 0;
    let lastSize = 0;
    let peak = 0;
    let pending = 0;
    /** This gesture has already turned its page; the rest of it is ignored. */
    let spent = false;

    /** Whether the book is on screen (the track covers the viewport). */
    const inBook = () => {
      const r = el.getBoundingClientRect();
      return r.top <= 1 && r.bottom >= window.innerHeight - 1;
    };
    const turn = (dir: 1 | -1) => {
      const { open: isOpen, step: at } = latest.current;
      const target = !isOpen ? (dir > 0 ? 0 : -1) : at + dir;
      if (target < -1 || target > turns) return;
      busyUntil = performance.now() + (reduced ? 120 : 700);
      goToRef.current(target);
    };

    /** Inside the search panel, scrolling and keys belong to the panel. */
    const inPanel = (event: Event) => (event.target as HTMLElement | null)?.closest?.('[data-free-scroll]');

    const onWheel = (event: WheelEvent) => {
      const panel = inPanel(event);
      if (panel) {
        // The results list scrolls; the dimmed page behind it stays put.
        if (!(event.target as HTMLElement).closest('.search-results')) event.preventDefault();
        return;
      }
      if (event.ctrlKey || !inBook()) return; // pinch-zoom, or outside the book
      event.preventDefault();
      const now = performance.now();
      const size = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      // A new gesture: after a real pause, or a clear new push once the last flick has died down to under a
      // third of its peak. A flick speeding up, or its momentum jittering, never counts as a second scroll.
      const magnitude = Math.abs(size);
      const faded = peak > 0 && lastSize < peak * 0.3;
      const fresh = now - lastEvent > 220 || (faded && magnitude > 40 && magnitude > lastSize * 3);
      lastEvent = now;
      lastSize = magnitude;
      if (fresh) {
        pending = 0;
        spent = false;
        peak = 0;
      }
      peak = Math.max(peak, magnitude);
      if (spent || now < busyUntil) return;
      pending += size;
      if (Math.abs(pending) < 12) return;
      const dir = pending > 0 ? 1 : -1;
      pending = 0;
      spent = true;
      turn(dir);
    };

    let startX = 0;
    let startY = 0;
    const onTouchStart = (event: TouchEvent) => {
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (inPanel(event)) return;
      if (inBook() && event.cancelable) event.preventDefault();
    };
    const onTouchEnd = (event: TouchEvent) => {
      if (inPanel(event) || !inBook() || performance.now() < busyUntil) return;
      const dx = startX - event.changedTouches[0].clientX;
      const dy = startY - event.changedTouches[0].clientY;
      const along = Math.abs(dx) > Math.abs(dy) ? dx : dy;
      if (Math.abs(along) > 40) turn(along > 0 ? 1 : -1);
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || !inBook() || inPanel(event)) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select')) return;
      const forward = ['ArrowDown', 'PageDown', 'ArrowRight'].includes(event.key) || (event.key === ' ' && !event.shiftKey);
      const backward = ['ArrowUp', 'PageUp', 'ArrowLeft'].includes(event.key) || (event.key === ' ' && event.shiftKey);
      if (!forward && !backward) return;
      event.preventDefault();
      if (performance.now() >= busyUntil) turn(forward ? 1 : -1);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKey);
    };
  }, [track, turns, reduced]);

  /** The track's height and its snap points, in px. */
  const openPx = vh * OPEN_VH;
  const turnPx = vh * TURN_VH;
  const snaps = [0, ...Array.from({ length: turns + 1 }, (_, k) => openPx + k * turnPx)];
  const height = vh + openPx + turns * turnPx;

  return { open, step, goTo, snaps, height, reduced };
}
